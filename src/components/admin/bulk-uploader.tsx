"use client";

import { useRef, useState } from "react";
import type { GalleryItem } from "@/lib/projects";
import {
  mediaTypeOf,
  uploadToCloudinary,
  validateFile,
} from "@/lib/cloudinary-upload";

type Props = {
  folder: string;
  onUploaded: (items: GalleryItem[]) => void;
};

/** Uploads many local files at once and appends one gallery item per file. */
export function BulkUploader({ folder, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleFiles(fileList: FileList) {
    const files = Array.from(fileList);
    setErrors([]);
    setProgress({ done: 0, total: files.length });

    const uploaded: GalleryItem[] = [];
    const failures: string[] = [];

    // Sequential on purpose: the order the admin picked the files becomes the
    // gallery order, and Cloudinary is not hammered with parallel uploads.
    for (const file of files) {
      const mediaType = mediaTypeOf(file);
      if (!mediaType) {
        failures.push(`${file.name}: not an image or a video.`);
      } else {
        const invalid = validateFile(file, mediaType);
        if (invalid) {
          failures.push(`${file.name}: ${invalid}`);
        } else {
          try {
            const id = await uploadToCloudinary(file, folder, mediaType);
            uploaded.push({ id, type: mediaType });
          } catch (err) {
            failures.push(
              `${file.name}: ${err instanceof Error ? err.message : "upload failed"}`
            );
          }
        }
      }
      setProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : prev));
    }

    if (uploaded.length) onUploaded(uploaded);
    setErrors(failures);
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const busy = progress !== null;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="rounded border border-neutral-300 px-3 py-1.5 text-[0.68rem] text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
      >
        {busy ? `Uploading ${progress.done}/${progress.total}…` : "Bulk upload files"}
      </button>
      <p className="text-[0.62rem] text-neutral-400">
        Select several images or videos at once. Each file is added to the gallery in
        the order you pick it. Max 20 MB per image, 200 MB per video.
      </p>
      {errors.map((message) => (
        <p key={message} className="text-[0.65rem] text-red-600">
          {message}
        </p>
      ))}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) handleFiles(files);
        }}
      />
    </div>
  );
}
