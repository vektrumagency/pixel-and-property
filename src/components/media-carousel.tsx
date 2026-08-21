"use client";

import { useState } from "react";
import Image from "next/image";
import { unsplash } from "@/lib/assets";

export function MediaCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);

  function go(next: number) {
    setIndex(((next % images.length) + images.length) % images.length);
  }

  return (
    <div className="relative h-[70vh] min-h-[420px] w-full bg-white lg:h-[85vh]">
      <Image
        key={index}
        src={unsplash(images[index])}
        alt={alt}
        fill
        priority={index === 0}
        className="object-contain"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => go(index - 1)}
            className="group/nav absolute inset-y-0 left-0 flex w-1/2 items-center justify-start pl-6 lg:pl-12"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-md opacity-0 transition-opacity duration-300 group-hover/nav:opacity-100">
              ←
            </span>
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => go(index + 1)}
            className="group/nav absolute inset-y-0 right-0 flex w-1/2 items-center justify-end pr-6 lg:pr-12"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-md opacity-0 transition-opacity duration-300 group-hover/nav:opacity-100">
              →
            </span>
          </button>

          <div className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-white px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-black/60 shadow-md lg:bottom-6 lg:right-8">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
