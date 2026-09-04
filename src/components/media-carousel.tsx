"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cldUrl, cldVideoUrl, cldVideoThumb } from "@/lib/cloudinary";
import type { GalleryItem } from "@/lib/projects";

export function MediaCarousel({
  items,
  alt,
}: {
  items: GalleryItem[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);

  // Warm the browser cache for every gallery asset as soon as the page
  // opens, so stepping through the carousel doesn't wait on network
  // requests. Images are preloaded in full; videos only by their poster
  // thumbnail, since preloading full video files would be wasteful.
  useEffect(() => {
    const preloaded = items.map((item) =>
      item.type === "video" ? cldVideoThumb(item.id, { w: 1600 }) : cldUrl(item.id, { w: 1600 })
    );
    const images = preloaded.map((src) => {
      const img = new window.Image();
      img.src = src;
      return img;
    });
    return () => {
      images.forEach((img) => {
        img.src = "";
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) return null;

  function go(next: number) {
    setIndex(((next % items.length) + items.length) % items.length);
  }

  const current = items[Math.min(index, items.length - 1)];
  // Keep the side arrows clear of the native video control bar and, for
  // videos, narrow them to edge strips so they don't sit on top of the
  // video's clickable area (play button, control bar, etc.).
  const navHeight = current.type === "video" ? "bottom-20" : "bottom-0";
  const navWidth = current.type === "video" ? "w-16" : "w-1/2";

  return (
    <div className="relative h-[70vh] min-h-[420px] w-full bg-white lg:h-[85vh]">
      {current.type === "video" ? (
        <video
          key={current.id}
          src={cldVideoUrl(current.id, { w: 1600 })}
          poster={cldVideoThumb(current.id, { w: 1600 })}
          controls
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : (
        <Image
          key={current.id}
          src={cldUrl(current.id, { w: 1600 })}
          alt={alt}
          fill
          priority={index === 0}
          className="object-contain"
        />
      )}

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous item"
            onClick={() => go(index - 1)}
            className={`group/nav absolute left-0 top-0 flex items-center justify-start pl-6 lg:pl-12 ${navWidth} ${navHeight}`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-md opacity-0 transition-opacity duration-300 group-hover/nav:opacity-100">
              ←
            </span>
          </button>
          <button
            type="button"
            aria-label="Next item"
            onClick={() => go(index + 1)}
            className={`group/nav absolute right-0 top-0 flex items-center justify-end pr-6 lg:pr-12 ${navWidth} ${navHeight}`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-md opacity-0 transition-opacity duration-300 group-hover/nav:opacity-100">
              →
            </span>
          </button>

          <div className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-white px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-black/60 shadow-md lg:bottom-6 lg:right-8">
            {index + 1} / {items.length}
          </div>
        </>
      )}
    </div>
  );
}
