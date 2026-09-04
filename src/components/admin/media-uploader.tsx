"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cldUrl, cldVideoThumb } from "@/lib/cloudinary";
import {
  compressMediaIfNeeded,
  maxLabelFor,
  uploadToCloudinary,
  validateFile,
} from "@/lib/cloudinary-upload";

type Props = {
  value: string;
  onChange: (publicId: string) => void;
  folder: string;
  mediaType?: "image" | "video";
  label?: string;
};

export function MediaUploader({
  value,
  onChange,
  folder,
  mediaType = "image",
  label,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [compressProgress, setCompressProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const maxLabel = maxLabelFor(mediaType);

  async function handleFile(file: File) {
    setError(null);

    const compressed = await compressMediaIfNeeded(file, mediaType, (ratio) =>
      setCompressProgress(ratio)
    );
    setCompressProgress(null);
    const invalid = validateFile(compressed, mediaType);
    if (invalid) {
      setError(invalid);
      return;
    }

    setUploading(true);
    try {
      onChange(await uploadToCloudinary(compressed, folder, mediaType));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const preview = value ? (
    mediaType === "video" ? (
      <div className="relative h-24 w-40">
        <Image
          src={cldVideoThumb(value, { w: 320 })}
          alt=""
          width={160}
          height={96}
          className="h-24 w-40 rounded border border-neutral-300 bg-neutral-100 object-cover"
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-[0.7rem] text-white">
            ▶
          </span>
        </span>
      </div>
    ) : (
      <Image
        src={cldUrl(value, { w: 320, q: 70 })}
        alt=""
        width={160}
        height={96}
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
              disabled={uploading || compressProgress !== null}
              className="rounded bg-black px-3 py-1.5 text-[0.68rem] font-medium text-white hover:opacity-80 disabled:opacity-50"
            >
              {compressProgress !== null
                ? `Compressing… ${Math.round(compressProgress * 100)}%`
                : uploading
                  ? "Uploading…"
                  : value
                    ? "Replace"
                    : "Upload"}
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
            {mediaType === "video" && " Larger videos are compressed automatically."}
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
