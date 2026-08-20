"use client";

import { useRef, useState } from "react";
import { cldUrl } from "@/lib/cloudinary";

type Props = {
  value: string;
  onChange: (publicId: string) => void;
  folder: string;
  mediaType?: "image" | "video";
  label?: string;
};

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

export function MediaUploader({
  value,
  onChange,
  folder,
  mediaType = "image",
  label,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxBytes = mediaType === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  const maxLabel = mediaType === "video" ? "200 MB" : "20 MB";

  async function handleFile(file: File) {
    setError(null);

    if (mediaType === "image" && !file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (mediaType === "video" && !file.type.startsWith("video/")) {
      setError("Please select a video file.");
      return;
    }
    if (file.size > maxBytes) {
      setError(`File too large. Max ${maxLabel}.`);
      return;
    }

    setUploading(true);
    try {
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
      onChange(result.public_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const preview = value ? (
    mediaType === "video" ? (
      <div className="flex h-24 w-40 items-center justify-center rounded border border-neutral-300 bg-neutral-100 text-[0.65rem] text-neutral-500">
        Video attached
      </div>
    ) : (
      <img
        src={cldUrl(value, { w: 320, q: 70 })}
        alt=""
        className="h-24 w-40 rounded border border-neutral-300 object-cover"
      />
    )
  ) : (
    <div className="flex h-24 w-40 items-center justify-center rounded border border-dashed border-neutral-300 bg-neutral-50 text-[0.65rem] text-neutral-400">
      No {mediaType}
    </div>
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[0.68rem] font-medium text-neutral-600">
          {label}
        </label>
      )}
      <div className="flex items-start gap-4">
        {preview}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded bg-black px-3 py-1.5 text-[0.68rem] font-medium text-white hover:opacity-80 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
            </button>
            {value && !uploading && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded border border-neutral-300 px-3 py-1.5 text-[0.68rem] text-neutral-600 hover:bg-neutral-50"
              >
                Remove
              </button>
            )}
          </div>
          {value && (
            <p className="max-w-xs truncate text-[0.62rem] text-neutral-400" title={value}>
              {value}
            </p>
          )}
          <p className="text-[0.62rem] text-neutral-400">
            Max {maxLabel}. {mediaType === "image" ? "JPG, PNG, WebP" : "MP4, MOV"}.
          </p>
          {error && <p className="text-[0.65rem] text-red-600">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={mediaType === "image" ? "image/*" : "video/*"}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
