export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

export type MediaType = "image" | "video";

export function maxBytesFor(mediaType: MediaType) {
  return mediaType === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
}

export function maxLabelFor(mediaType: MediaType) {
  return mediaType === "video" ? "200 MB" : "20 MB";
}

/** Reads the media type from the browser MIME type; null for anything else. */
export function mediaTypeOf(file: File): MediaType | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return null;
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
