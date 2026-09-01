"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";

type Status = "idle" | "submitting" | "success" | "error";

export function InvestmentsPartner() {
  const t = useTranslations("investments.partner");
  const f = useTranslations("investments.partner.form");

  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.company
            ? `${f("company")}: ${form.company}\n\n${form.message}`
            : form.message,
          source: "investments",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Lead submission failed (${res.status})`);
      }
      setStatus("success");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      console.warn("Investments partner form submission failed:", err);
      setStatus("error");
    }
  }

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

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
        onSubmit={handleSubmit}
      >
        {status === "success" ? (
          <div className="flex flex-col gap-4 py-12 text-center">
            <p className="text-[0.85rem] text-black/70">{f("successMessage")}</p>
          </div>
        ) : (
          <>
            <Field
              label={f("name")}
              type="text"
              placeholder={f("namePlaceholder")}
              value={form.name}
              onChange={update("name")}
              required
            />
            <Field
              label={f("email")}
              type="email"
              placeholder="email@exemplo.com"
              value={form.email}
              onChange={update("email")}
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
              title="Enter a complete email address, e.g. name@example.com"
              required
            />
            <Field
              label={f("company")}
              type="text"
              placeholder={f("companyPlaceholder")}
              value={form.company}
              onChange={update("company")}
            />
            <div className="flex flex-col gap-2">
              <label className="text-[0.6rem] uppercase tracking-[0.15em] text-text-muted">
                {f("message")}
              </label>
              <textarea
                rows={4}
                placeholder={f("messagePlaceholder")}
                value={form.message}
                onChange={update("message")}
                required
                className="border border-gold/25 bg-transparent px-4 py-3 text-[0.8rem] text-black placeholder:text-black/30 focus:border-gold-dark/60 focus:outline-none"
              />
            </div>
            {status === "error" && (
              <p className="text-[0.72rem] text-red-600">{f("errorMessage")}</p>
            )}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 border border-gold-dark/50 py-3.5 text-[0.6rem] font-medium uppercase tracking-[0.22em] transition-colors hover:bg-gold hover:border-gold hover:text-black disabled:opacity-50"
            >
              {status === "submitting" ? f("submitting") : f("submit")}
            </button>
          </>
        )}
      </Reveal>
    </section>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
  required,
  pattern,
  title,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  pattern?: string;
  title?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[0.6rem] uppercase tracking-[0.15em] text-text-muted">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        pattern={pattern}
        title={title}
        className="border border-gold/25 bg-transparent px-4 py-3 text-[0.8rem] text-black placeholder:text-black/30 focus:border-gold-dark/60 focus:outline-none"
      />
    </div>
  );
}
