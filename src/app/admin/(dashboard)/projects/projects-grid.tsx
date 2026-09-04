"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { updateProjectHeroImage } from "@/app/admin/(dashboard)/projects/actions";
import { cldUrl } from "@/lib/cloudinary";
import {
  compressImageIfNeeded,
  uploadToCloudinary,
  validateFile,
} from "@/lib/cloudinary-upload";
import type { ProjectRow } from "@/app/admin/(dashboard)/projects/projects-table";

const categoryLabels = { digital: "Digital", management: "Management" } as const;
const categoryOrder = ["digital", "management"] as const;

export function ProjectsGrid({ rows }: { rows: ProjectRow[] }) {
  return (
    <div className="space-y-8">
      {categoryOrder.map((category) => {
        const group = rows.filter((p) => p.category === category);
        if (!group.length) return null;
        return (
          <div key={category}>
            <h2 className="mb-3 text-[0.78rem] font-medium text-neutral-700">
              {categoryLabels[category]}
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {group.map((p) => (
                <Card key={p.id} project={p} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Card({ project }: { project: ProjectRow }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [heroImage, setHeroImage] = useState(project.heroImage);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    const compressed = await compressImageIfNeeded(file, "image");
    const invalid = validateFile(compressed, "image");
    if (invalid) {
      setError(invalid);
      return;
    }

    setBusy(true);
    try {
      const publicId = await uploadToCloudinary(
        compressed,
        `pixel/projects/${project.slug}`,
        "image"
      );
      const result = await updateProjectHeroImage(project.id, project.slug, publicId);
      if (result?.error) {
        setError(result.error);
      } else {
        setHeroImage(publicId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="group relative aspect-[4/3] bg-neutral-100">
        {heroImage ? (
          <Image
            src={cldUrl(heroImage, { w: 640, q: 70 })}
            alt=""
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 45vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[0.65rem] text-neutral-400">
            No hero image
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="absolute inset-0 flex items-center justify-center bg-black/45 text-[0.7rem] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 disabled:opacity-100"
        >
          {busy ? "Uploading…" : heroImage ? "Replace image" : "Upload image"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      <div className="space-y-1.5 p-4">
        <Link
          href={`/admin/projects/${project.id}`}
          className="block truncate text-[0.8rem] font-medium text-black underline-offset-2 hover:underline"
        >
          {project.name}
        </Link>
        <p className="truncate text-[0.7rem] text-neutral-500">
          {project.location} · {project.year}
        </p>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[0.62rem] font-medium ${
            project.published
              ? "bg-green-100 text-green-700"
              : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {project.published ? "Published" : "Draft"}
        </span>
        {error && <p className="text-[0.62rem] text-red-600">{error}</p>}
      </div>
    </div>
  );
}
