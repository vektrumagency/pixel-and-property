"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HorizontalScrollGallery({ slides }: { slides: ReactNode[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    let ticking = false;

    function update() {
      ticking = false;
      const rect = wrapper!.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      const maxShift = track!.scrollWidth - track!.clientWidth;
      track!.style.transform = `translate3d(${-progress * maxShift}px, 0, 0)`;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [slides.length]);

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${slides.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 -mx-6 flex items-start overflow-hidden pt-6 lg:-mx-24 lg:pt-10">
        <div ref={trackRef} className="flex w-full gap-6 px-[5vw]">
          {slides.map((slide, i) => (
            <div key={i} className="w-[90vw] shrink-0">
              {slide}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
