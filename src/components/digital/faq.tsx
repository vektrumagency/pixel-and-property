"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";

type FaqItem = { q: string; a: string };

export function DigitalFaq() {
  const t = useTranslations("digital.faq");
  const items = t.raw("items") as FaqItem[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl bg-white px-6 py-16 lg:py-32">
      <Reveal>
        <span className="mb-4 block text-[0.52rem] uppercase tracking-[0.45em] text-gold-dark">
          {t("label")}
        </span>
        <h2 className="mb-10 font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-light lg:mb-12">
          {t("title")}
        </h2>
      </Reveal>

      <div>
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border-b border-gold/20">
              <button
                className="flex w-full items-center justify-between gap-4 py-6 text-left text-[0.85rem] font-normal transition-colors hover:text-gold-dark"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {item.q}
                <span
                  className={`shrink-0 text-gold-dark transition-transform ${isOpen ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
              <div
                className="overflow-hidden text-[0.78rem] leading-[2] text-black/55 transition-[max-height] duration-300"
                style={{ maxHeight: isOpen ? "300px" : "0px" }}
              >
                <p className="pb-6">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
