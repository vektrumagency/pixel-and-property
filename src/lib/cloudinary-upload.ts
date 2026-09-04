import imageCompression from "browser-image-compression";

// Must match the Cloudinary account's actual upload limit, not just our own
// preference — a higher client-side limit only defers the same rejection to
// after the upload round trip, with a confusing Cloudinary-side error.
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

// Video re-encode targets, given a duration in seconds:
//   targetBits = MAX_VIDEO_BYTES * 8 * bitrateSafetyMargin / durationSeconds
// The margin leaves room for the audio track and container overhead so the
// encoded file lands safely under the limit rather than skimming it.
const VIDEO_BITRATE_SAFETY_MARGIN = 0.92;
const VIDEO_AUDIO_BITRATE_BPS = 128_000;
const VIDEO_MAX_WIDTH = 1280;

export type MediaType = "image" | "video";

export function maxBytesFor(mediaType: MediaType) {
  return mediaType === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
}

export function maxLabelFor(mediaType: MediaType) {
  return mediaType === "video" ? "100 MB" : "10 MB";
}

/** Reads the media type from the browser MIME type; null for anything else. */
export function mediaTypeOf(file: File): MediaType | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return null;
}

/**
 * Re-encodes an oversized image down toward MAX_IMAGE_BYTES so it clears
 * validateFile instead of being rejected outright. Videos and images
 * already under the limit are returned untouched.
 */
export async function compressImageIfNeeded(file: File, mediaType: MediaType): Promise<File> {
  if (mediaType !== "image" || file.size <= MAX_IMAGE_BYTES) return file;
  try {
    return await imageCompression(file, {
      maxSizeMB: MAX_IMAGE_BYTES / (1024 * 1024),
      useWebWorker: true,
      preserveExif: true,
    });
  } catch {
    // Compression is a best-effort convenience — fall back to the original
    // file and let validateFile reject it with the usual size error.
    return file;
  }
}

function readVideoDurationSeconds(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error("Could not read video metadata"));
    };
  });
}

/**
 * Re-encodes an oversized video down toward MAX_VIDEO_BYTES so it clears
 * validateFile instead of being rejected outright. Bitrate is derived from
 * the video's own duration so longer videos get a lower bitrate rather than
 * a fixed setting that would blow past the size limit. Runs entirely in the
 * browser via ffmpeg.wasm — nothing is sent to Cloudinary until this returns.
 */
export async function compressVideoIfNeeded(
  file: File,
  mediaType: MediaType,
  onProgress?: (ratio: number) => void
): Promise<File> {
  if (mediaType !== "video" || file.size <= MAX_VIDEO_BYTES) return file;

  try {
    const durationSeconds = await readVideoDurationSeconds(file);
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return file;

    const targetTotalBps =
      (MAX_VIDEO_BYTES * 8 * VIDEO_BITRATE_SAFETY_MARGIN) / durationSeconds;
    const targetVideoBps = Math.max(targetTotalBps - VIDEO_AUDIO_BITRATE_BPS, 200_000);

    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL, fetchFile } = await import("@ffmpeg/util");

    const ffmpeg = new FFmpeg();
    if (onProgress) ffmpeg.on("progress", ({ progress }) => onProgress(progress));

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    const inputName = "input" + (file.name.match(/\.\w+$/)?.[0] ?? ".mp4");
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    await ffmpeg.exec([
      "-i",
      inputName,
      "-vf",
      `scale='min(${VIDEO_MAX_WIDTH},iw)':-2`,
      "-c:v",
      "libx264",
      "-b:v",
      `${Math.round(targetVideoBps)}`,
      "-c:a",
      "aac",
      "-b:a",
      `${VIDEO_AUDIO_BITRATE_BPS}`,
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    const bytes = data as Uint8Array;
    const arrayBuffer = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength
    ) as ArrayBuffer;
    return new File([arrayBuffer], file.name.replace(/\.\w+$/, ".mp4"), {
      type: "video/mp4",
    });
  } catch {
    // Compression is a best-effort convenience — fall back to the original
    // file and let validateFile reject it with the usual size error.
    return file;
  }
}

/** Compresses an oversized image or video so it clears validateFile. */
export async function compressMediaIfNeeded(
  file: File,
  mediaType: MediaType,
  onVideoProgress?: (ratio: number) => void
): Promise<File> {
  if (mediaType === "video") return compressVideoIfNeeded(file, mediaType, onVideoProgress);
  return compressImageIfNeeded(file, mediaType);
}

/** Returns an error message, or null when the file may be uploaded. */
export function validateFile(file: File, mediaType: MediaType): string | null {
  if (!file.type.startsWith(`${mediaType}/`)) {
    return `Please select ${mediaType === "image" ? "an image" : "a video"} file.`;
  }
  if (file.size > maxBytesFor(mediaType)) {
    return `File too large. Max ${maxLabelFor(mediaType)}.`;
  }
  return null;
}

/** Uploads one file to Cloudinary and returns its public ID. */
export async function uploadToCloudinary(
  file: File,
  folder: string,
  mediaType: MediaType
): Promise<string> {
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  if (!signRes.ok) throw new Error("Failed to authorise upload");
  const { signature, timestamp, api_key, cloud_name } = await signRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/${mediaType}/upload`,
    { method: "POST", body: formData }
  );
  if (!uploadRes.ok) {
    const body = await uploadRes.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? "Upload failed");
  }
  const result = await uploadRes.json();
  return result.public_id as string;
}
