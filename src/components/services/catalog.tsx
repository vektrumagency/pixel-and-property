"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";
import { services, type ServiceCategory } from "@/data/services";
import type { Locale } from "@/i18n/routing";

const categoryOrder: ServiceCategory[] = ["media", "ondemand"];

export function ServicesCatalog() {
  const t = useTranslations("servicesCatalog");
  const f = useTranslations("servicesCatalog.form");
  const locale = useLocale() as Locale;
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const selectedItems = useMemo(
    () => services.filter((item) => selected.has(item.id)),
    [selected],
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    const requested = selectedItems
      .map((item) => `- ${item.name[locale]}`)
      .join("\n");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: `${t("panelTitle")}:\n${requested}\n\n${form.message}`.trim(),
          source: "services",
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("idle");
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setSelected(new Set());
    setSubmitted(false);
    setStatus("idle");
  }

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  return (
    <section className="grid gap-12 bg-white px-6 pt-16 pb-16 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-16 lg:px-24 lg:pt-24 lg:pb-32">
      <div>
        {categoryOrder.map((category, ci) => {
          const items = services.filter((item) => item.category === category);
          return (
            <div key={category} className={ci > 0 ? "mt-12 lg:mt-16" : ""}>
              <Reveal>
                <span className="mb-6 block text-[0.52rem] uppercase tracking-[0.45em] text-gold-dark">
                  {t(`categories.${category}`)}
                </span>
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((item, i) => {
                  const isSelected = selected.has(item.id);
                  return (
                    <Reveal key={item.id} delay={i * 60}>
                      <button
                        type="button"
                        onClick={() => toggle(item.id)}
                        aria-pressed={isSelected}
                        className={`flex w-full flex-col items-start gap-3 border p-6 text-left transition-colors ${
                          isSelected
                            ? "border-gold bg-gold/[0.08]"
                            : "border-gold/20 hover:border-gold/40"
                        }`}
                      >
                        <div className="flex w-full items-start justify-between gap-3">
                          <h3 className="font-serif text-lg font-normal">
                            {item.name[locale]}
                          </h3>
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center border text-xs transition-colors ${
                              isSelected
                                ? "border-gold bg-gold text-black"
                                : "border-gold-dark/30 text-gold-dark"
                            }`}
                          >
                            {isSelected ? "✓" : "+"}
                          </span>
                        </div>
                        <p className="text-[0.75rem] leading-[1.7] text-black/50">
                          {item.desc[locale]}
                        </p>
                      </button>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Reveal
        as="aside"
        delay={100}
        className="border border-gold/20 bg-black/[0.02] p-6 lg:sticky lg:top-32"
      >
        {submitted ? (
          <div>
            <p className="mb-2 font-serif text-xl font-normal text-gold-dark">
              {t("success.title")}
            </p>
            <p className="text-[0.78rem] leading-[1.9] text-black/60">
              {t("success.text")}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 w-full border border-gold-dark/40 py-3 text-center text-[0.58rem] font-medium uppercase tracking-[0.22em] transition-colors hover:bg-gold hover:border-gold hover:text-black"
            >
              {t("success.reset")}
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 font-serif text-xl font-normal">{t("panelTitle")}</p>

            {selectedItems.length === 0 ? (
              <p className="text-[0.78rem] leading-[1.8] text-black/45">
                {t("emptyState")}
              </p>
            ) : (
              <>
                <p className="mb-3 text-[0.6rem] uppercase tracking-[0.2em] text-gold-dark">
                  {selectedItems.length} {t("selectedLabel")}
                </p>
                <ul className="mb-6 space-y-2">
                  {selectedItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-2 border-b border-black/[0.07] pb-2 text-[0.75rem] text-black/70"
                    >
                      {item.name[locale]}
                      <button
                        type="button"
                        onClick={() => toggle(item.id)}
                        aria-label={`Remove ${item.name[locale]}`}
                        className="text-black/30 transition-colors hover:text-gold-dark"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={update("email")}
                    required
                  />
                  <Field
                    label={f("phone")}
                    type="tel"
                    placeholder="+351 ..."
                    value={form.phone}
                    onChange={update("phone")}
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.6rem] uppercase tracking-[0.15em] text-text-muted">
                      {f("message")}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={f("messagePlaceholder")}
                      value={form.message}
                      onChange={update("message")}
                      className="border border-gold/25 bg-transparent px-4 py-3 text-[0.8rem] text-black placeholder:text-black/30 focus:border-gold-dark/60 focus:outline-none"
                    />
                  </div>
                  {status === "error" && (
                    <p className="text-[0.72rem] text-red-600">{f("errorMessage")}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-1 border border-gold-dark/50 py-3.5 text-[0.6rem] font-medium uppercase tracking-[0.22em] transition-colors hover:bg-gold hover:border-gold hover:text-black disabled:opacity-50"
                  >
                    {status === "submitting" ? f("submitting") : f("submit")}
                  </button>
                </form>
              </>
            )}
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
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        value={value}
        onChange={onChange}
        required={required}
        className="border border-gold/25 bg-transparent px-4 py-3 text-[0.8rem] text-black placeholder:text-black/30 focus:border-gold-dark/60 focus:outline-none"
      />
    </div>
  );
}
