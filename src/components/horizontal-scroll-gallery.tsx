"use client";

import { useRef, type ReactNode } from "react";

export function HorizontalScrollGallery({ slides }: { slides: ReactNode[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByOne(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-slide]");
    const amount = card
      ? card.getBoundingClientRect().width + 24
      : track.clientWidth * 0.85;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <div className="relative -mx-6 lg:-mx-24">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-2 lg:px-24 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            data-slide
            className="w-[88vw] shrink-0 snap-center lg:w-[68vw]"
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="mt-5 hidden justify-end gap-3 px-6 lg:flex lg:px-24">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollByOne(-1)}
          className="flex h-11 w-11 items-center justify-center border border-gold-dark/30 text-lg text-gold-dark transition-colors hover:border-gold hover:bg-gold/10"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollByOne(1)}
          className="flex h-11 w-11 items-center justify-center border border-gold-dark/30 text-lg text-gold-dark transition-colors hover:border-gold hover:bg-gold/10"
        >
          ›
        </button>
      </div>
    </div>
  );
}
