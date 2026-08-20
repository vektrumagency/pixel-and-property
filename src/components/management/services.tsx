"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";

export function ManagementServices() {
  const t = useTranslations("management.services");
  const items = t.raw("items") as { name: string; desc: string }[];
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <section id="services" className="bg-white px-6 py-16 lg:px-24 lg:py-32">
      <Reveal className="mb-12 lg:mb-16">
        <h2 className="max-w-2xl font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-light">
          {t("title")}
        </h2>
      </Reveal>

      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-3 lg:gap-y-16">
        {items.map((item, i) => {
          const isOpen = open.has(i);
          return (
            <Reveal
              key={item.name}
              delay={(i % 3) * 100}
              className="relative border-b border-gold/10 pb-6 lg:border-none lg:pb-0"
            >
              <span className="mb-4 hidden h-px w-8 bg-gold-dark/60 lg:block" />
              <button
                type="button"
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 text-left lg:pointer-events-none"
              >
                <h3 className="font-serif text-xl font-normal">{item.name}</h3>
                <span
                  className={`shrink-0 text-gold-dark transition-transform lg:hidden ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className={`grid overflow-hidden transition-[grid-template-rows] duration-300 lg:grid-rows-[1fr] ${
                  isOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr] lg:mt-3"
                }`}
              >
                <p className="min-h-0 text-[0.75rem] leading-[1.9] text-black/50">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-12 text-center lg:mt-16">
        <Link
          href="/contact"
          className="inline-block border border-gold-dark/50 px-8 py-3.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold-dark"
        >
          {t("cta")}
        </Link>
      </Reveal>
    </section>
  );
}
