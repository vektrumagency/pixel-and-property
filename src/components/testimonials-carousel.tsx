"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";

type Testimonial = { text: string; author: string; role: string };

function TestimonialCard({
  item,
  className = "",
}: {
  item: Testimonial;
  className?: string;
}) {
  return (
    <div className={`border border-gold/15 bg-white p-8 ${className}`}>
      <span className="mb-6 block font-serif text-5xl leading-none text-gold/40">
        &ldquo;
      </span>
      <p className="min-h-[9em] text-base font-light leading-[1.6] text-black/75">
        {item.text}
      </p>
      <div className="mt-6 border-t border-black/10 pt-4">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.1em]">
          {item.author}
        </p>
        <p className="mt-1 text-[0.6rem] tracking-[0.08em] text-text-muted">
          {item.role}
        </p>
      </div>
    </div>
  );
}

export function TestimonialsCarousel() {
  const t = useTranslations("home.testimonials");
  const items = useTranslations("digital.testimonials").raw(
    "items",
  ) as Testimonial[];
  const track = [...items, ...items];
  const mobileTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mobileTrackRef.current;
    if (!el) return;
    const id = setInterval(() => {
      const width = el.clientWidth;
      if (!width) return;
      const current = Math.round(el.scrollLeft / width);
      const next = (current + 1) % items.length;
      el.scrollTo({ left: next * width, behavior: "smooth" });
    }, 10000);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    <section className="overflow-hidden bg-white px-6 pt-16 pb-16 lg:px-24 lg:pt-32 lg:pb-32">
      <Reveal>
        <span className="mb-4 block text-[0.52rem] uppercase tracking-[0.45em] text-gold-dark">
          {t("label")}
        </span>
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-light">
          {t("title")}
        </h2>
      </Reveal>

      <div
        ref={mobileTrackRef}
        className="mt-12 flex snap-x snap-mandatory overflow-x-auto scroll-smooth lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div key={item.author} className="w-full shrink-0 snap-center">
            <TestimonialCard item={item} />
          </div>
        ))}
      </div>

      <div className="mt-12 hidden overflow-hidden lg:mt-16 lg:block">
        <div className="flex w-max animate-[scroll-logos_70s_linear_infinite] gap-6 hover:[animation-play-state:paused]">
          {track.map((item, i) => (
            <TestimonialCard
              key={`${item.author}-${i}`}
              item={item}
              className="w-96 shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
