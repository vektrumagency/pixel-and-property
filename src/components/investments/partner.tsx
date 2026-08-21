"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";

export function InvestmentsPartner() {
  const t = useTranslations("investments.partner");
  const f = useTranslations("investments.partner.form");

  return (
    <section
      id="partner"
      className="grid gap-12 bg-white px-6 pt-16 pb-16 lg:grid-cols-2 lg:gap-24 lg:px-24 lg:pt-32 lg:pb-32"
    >
      <Reveal>
        <span className="mb-4 block text-[0.52rem] uppercase tracking-[0.45em] text-gold-dark">
          {t("label")}
        </span>
        <h2 className="mb-6 font-serif text-[clamp(1.8rem,4vw,2.6rem)] font-light leading-[1.2]">
          {t("title")}
        </h2>
        <p className="text-[0.78rem] leading-[2] text-black/55">
          {t("subtitle")}
        </p>
      </Reveal>

      <Reveal
        as="form"
        delay={150}
        className="flex flex-col gap-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <Field label={f("name")} type="text" placeholder={f("namePlaceholder")} required />
        <Field label={f("email")} type="email" placeholder="email@exemplo.com" required />
        <Field label={f("company")} type="text" placeholder={f("companyPlaceholder")} />
        <div className="flex flex-col gap-2">
          <label className="text-[0.6rem] uppercase tracking-[0.15em] text-text-muted">
            {f("message")}
          </label>
          <textarea
            rows={4}
            placeholder={f("messagePlaceholder")}
            className="border border-gold/25 bg-transparent px-4 py-3 text-[0.8rem] text-black placeholder:text-black/30 focus:border-gold-dark/60 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-2 border border-gold-dark/50 py-3.5 text-[0.6rem] font-medium uppercase tracking-[0.22em] transition-colors hover:bg-gold hover:border-gold hover:text-black"
        >
          {f("submit")}
        </button>
      </Reveal>
    </section>
  );
}

function Field({
  label,
  type,
  placeholder,
  required,
}: {
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[0.6rem] uppercase tracking-[0.15em] text-text-muted">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="border border-gold/25 bg-transparent px-4 py-3 text-[0.8rem] text-black placeholder:text-black/30 focus:border-gold-dark/60 focus:outline-none"
      />
    </div>
  );
}
