"use client";

import { useId, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/projects";
import {
  compressImageIfNeeded,
  mediaTypeOf,
  uploadToCloudinary,
  validateFile,
} from "@/lib/cloudinary-upload";

type Props = {
  folder: string;
  onUploaded: (items: GalleryItem[]) => void;
  disabled?: boolean;
};

/**
 * Drag files in from the OS, or click to pick, to upload many files at once.
 * Appends one gallery item per file, in drop/pick order.
 */
export function GalleryDropzone({ folder, onUploaded, disabled }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleFiles(fileList: FileList) {
    const files = Array.from(fileList);
    setErrors([]);
    setProgress({ done: 0, total: files.length });

    const uploaded: GalleryItem[] = [];
    const failures: string[] = [];

    // Sequential on purpose: the order files are dropped/picked in becomes the
    // gallery order, and Cloudinary is not hammered with parallel uploads.
    for (const file of files) {
      const mediaType = mediaTypeOf(file);
      if (!mediaType) {
        failures.push(`${file.name}: not an image or a video.`);
      } else {
        const compressed = await compressImageIfNeeded(file, mediaType);
        const invalid = validateFile(compressed, mediaType);
        if (invalid) {
          failures.push(`${file.name}: ${invalid}`);
        } else {
          try {
            const id = await uploadToCloudinary(compressed, folder, mediaType);
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
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        if (!disabled && e.dataTransfer.types.includes("Files")) setDragActive(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled && e.dataTransfer.types.includes("Files")) setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        if (disabled) return;
        if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
      }}
      className={`space-y-2 rounded border border-dashed px-4 py-5 text-center transition-colors ${
        dragActive ? "border-black bg-neutral-50" : "border-neutral-300"
      }`}
    >
      <p className="text-[0.72rem] text-neutral-500">
        Drag images or videos here, or{" "}
        <label
          htmlFor={inputId}
          className={`font-medium text-black underline-offset-2 hover:underline ${
            busy || disabled ? "pointer-events-none opacity-50" : "cursor-pointer"
          }`}
        >
          browse files
        </label>
        .
      </p>
      {busy && (
        <p className="text-[0.68rem] text-neutral-500">
          Uploading {progress.done}/{progress.total}…
        </p>
      )}
      <p className="text-[0.62rem] text-neutral-400">
        Several files may be selected at once. Each is added to the gallery in the
        order dropped or picked. Max 10 MB per image, 200 MB per video.
      </p>
      {errors.map((message) => (
        <p key={message} className="text-[0.65rem] text-red-600">
          {message}
        </p>
      ))}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple
        accept="image/*,video/*"
        disabled={busy || disabled}
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) handleFiles(files);
        }}
      />
    </div>
  );
}
