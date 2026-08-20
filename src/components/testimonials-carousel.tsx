"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";

type Testimonial = { text: string; author: string; role: string };

export function TestimonialsCarousel() {
  const t = useTranslations("home.testimonials");
  const items = useTranslations("digital.testimonials").raw(
    "items",
  ) as Testimonial[];
  const [index, setIndex] = useState(0);

  function go(next: number) {
    setIndex(((next % items.length) + items.length) % items.length);
  }

  const current = items[index];

  return (
    <section className="bg-white px-6 py-16 lg:px-24 lg:py-32">
      <Reveal>
        <span className="mb-4 block text-[0.52rem] uppercase tracking-[0.45em] text-gold-dark">
          {t("label")}
        </span>
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-light">
          {t("title")}
        </h2>
      </Reveal>

      <div className="mt-12 lg:mt-16">
        <span className="mb-6 block font-serif text-6xl leading-none text-gold/50">
          &ldquo;
        </span>
        <p
          key={index}
          className="animate-page-in min-h-[7.5em] font-serif text-lg font-light italic leading-[1.6] text-black/75 lg:min-h-[6em] lg:text-xl"
        >
          {current.text}
        </p>

        <div className="relative mt-10 h-px bg-black/10">
          <div
            key={index}
            className="absolute left-0 top-0 h-px animate-[fill-bar_6s_linear_forwards] bg-black"
            onAnimationEnd={() => go(index + 1)}
          />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.1em]">
              {current.author}
            </p>
            <p className="text-[0.64rem] tracking-[0.08em] text-text-muted">
              {current.role}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              aria-label="Previous"
              onClick={() => go(index - 1)}
              className="flex h-9 w-9 items-center justify-center border border-black/15 text-black/60 transition-colors hover:border-gold-dark hover:text-gold-dark"
            >
              ←
            </button>
            <button
              aria-label="Next"
              onClick={() => go(index + 1)}
              className="flex h-9 w-9 items-center justify-center border border-black/15 text-black/60 transition-colors hover:border-gold-dark hover:text-gold-dark"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
