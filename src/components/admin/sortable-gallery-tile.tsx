"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cldUrl, cldVideoThumb } from "@/lib/cloudinary";
import type { GalleryItem } from "@/lib/projects";

type Props = {
  item: GalleryItem;
  onRemove: () => void;
  onTypeChange: (type: GalleryItem["type"]) => void;
};

export function SortableGalleryTile({ item, onRemove, onTypeChange }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-square overflow-hidden rounded border border-neutral-300 bg-neutral-100 ${
        isDragging ? "z-10 opacity-70" : ""
      }`}
    >
      {item.type === "video" ? (
        <>
          <Image
            src={cldVideoThumb(item.id, { w: 320 })}
            alt=""
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-[0.7rem] text-white">
              ▶
            </span>
          </span>
        </>
      ) : (
        <Image
          src={cldUrl(item.id, { w: 320, q: 70 })}
          alt=""
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
      )}

      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Reorder"
        className="absolute left-1 top-1 flex h-6 w-6 cursor-grab items-center justify-center rounded bg-black/55 text-[0.7rem] text-white active:cursor-grabbing"
      >
        ⠿
      </button>

      <button
        type="button"
        onClick={() => onTypeChange(item.type === "image" ? "video" : "image")}
        aria-label="Toggle media type"
        className="absolute bottom-1 left-1 rounded bg-black/55 px-1.5 py-0.5 text-[0.6rem] uppercase text-white"
      >
        {item.type === "image" ? "IMG" : "VID"}
      </button>

      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove"
        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded bg-black/55 text-[0.8rem] text-white hover:bg-red-600"
      >
        ×
      </button>
    </div>
  );
}
