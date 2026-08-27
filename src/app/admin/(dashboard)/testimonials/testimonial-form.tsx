"use client";

import Link from "next/link";
import { useState } from "react";
import { saveTestimonial, deleteTestimonial, type TestimonialFormData } from "@/app/admin/(dashboard)/testimonials/actions";

function empty(nextSortOrder: number): TestimonialFormData {
  return {
    author: "",
    quote_pt: "",
    quote_en: "",
    job_pt: "",
    job_en: "",
    sort_order: nextSortOrder,
    published: true,
  };
}

export function TestimonialForm({
  initial,
  nextSortOrder = 1,
}: {
  initial?: TestimonialFormData;
  nextSortOrder?: number;
}) {
  const [data, setData] = useState<TestimonialFormData>(initial ?? empty(nextSortOrder));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof TestimonialFormData>(key: K, value: TestimonialFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await saveTestimonial(data);
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  async function handleDelete() {
    if (!data.id) return;
    if (!confirm(`Delete testimonial from "${data.author}"? This cannot be undone.`)) return;
    setSaving(true);
    setError(null);
    const result = await deleteTestimonial(data.id);
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <Section title="Basic Info">
        <Field label="Author" required>
          <input
            value={data.author}
            onChange={(e) => set("author", e.target.value)}
            required
            placeholder="Maria Santos"
            className={input}
          />
        </Field>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={data.published}
            onChange={(e) => set("published", e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="published" className="text-[0.78rem] text-neutral-700">Published</label>
        </div>
        <Field label="Sort order">
          <input type="number" value={data.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className={`${input} w-24`} />
        </Field>
      </Section>

      <Section title="Quote">
        <BilingualTextarea
          labelPt="Quote PT" valuePt={data.quote_pt} onChangePt={(v) => set("quote_pt", v)}
          labelEn="Quote EN" valueEn={data.quote_en} onChangeEn={(v) => set("quote_en", v)}
        />
      </Section>

      <Section title="Job / Company">
        <BilingualField
          labelPt="Job PT" valuePt={data.job_pt} onChangePt={(v) => set("job_pt", v)}
          labelEn="Job EN" valueEn={data.job_en} onChangeEn={(v) => set("job_en", v)}
        />
      </Section>

      {error && (
        <p className="rounded border border-red-300 bg-red-50 px-4 py-3 text-[0.78rem] text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-neutral-200 pt-6">
        {data.id && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="rounded border border-red-300 px-4 py-2 text-[0.72rem] text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete testimonial
          </button>
        )}
        <div className="ml-auto flex gap-3">
          <Link href="/admin/testimonials" className="rounded border border-neutral-300 px-4 py-2 text-[0.72rem] text-neutral-600 hover:bg-neutral-50">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-black px-4 py-2 text-[0.72rem] font-medium text-white hover:opacity-80 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save testimonial"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-neutral-500">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.68rem] font-medium text-neutral-600">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}

function BilingualField({ labelPt, valuePt, onChangePt, labelEn, valueEn, onChangeEn }: {
  labelPt: string; valuePt: string; onChangePt: (v: string) => void;
  labelEn: string; valueEn: string; onChangeEn: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label={labelPt}>
        <input value={valuePt} onChange={(e) => onChangePt(e.target.value)} className={input} />
      </Field>
      <Field label={labelEn}>
        <input value={valueEn} onChange={(e) => onChangeEn(e.target.value)} className={input} />
      </Field>
    </div>
  );
}

function BilingualTextarea({ labelPt, valuePt, onChangePt, labelEn, valueEn, onChangeEn }: {
  labelPt: string; valuePt: string; onChangePt: (v: string) => void;
  labelEn: string; valueEn: string; onChangeEn: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label={labelPt}>
        <textarea value={valuePt} onChange={(e) => onChangePt(e.target.value)} rows={4} className={textarea} />
      </Field>
      <Field label={labelEn}>
        <textarea value={valueEn} onChange={(e) => onChangeEn(e.target.value)} rows={4} className={textarea} />
      </Field>
    </div>
  );
}

const input = "rounded border border-neutral-300 px-3 py-2 text-[0.8rem] focus:border-black focus:outline-none w-full";
const textarea = "rounded border border-neutral-300 px-3 py-2 text-[0.8rem] focus:border-black focus:outline-none w-full resize-none";
