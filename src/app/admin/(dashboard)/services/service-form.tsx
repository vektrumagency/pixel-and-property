"use client";

import Link from "next/link";
import { useState } from "react";
import { saveService, deleteService, type ServiceFormData } from "@/app/admin/(dashboard)/services/actions";
import type { ServiceCategory } from "@/lib/projects";

const categoryLabels: Record<ServiceCategory, string> = {
  media: "Photography & Video",
  ondemand: "On Demand",
};

function empty(): ServiceFormData {
  return {
    category: "media",
    name_pt: "",
    name_en: "",
    desc_pt: "",
    desc_en: "",
    published: true,
  };
}

export function ServiceForm({ initial }: { initial?: ServiceFormData }) {
  const [data, setData] = useState<ServiceFormData>(initial ?? empty());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ServiceFormData>(key: K, value: ServiceFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await saveService(data);
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  async function handleDelete() {
    if (!data.id) return;
    if (!confirm(`Delete service "${data.name_pt}"? This cannot be undone.`)) return;
    setSaving(true);
    setError(null);
    const result = await deleteService(data.id);
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <Section title="Basic Info">
        <Field label="Category" required>
          <select
            value={data.category}
            onChange={(e) => set("category", e.target.value as ServiceCategory)}
            className={`${input} max-w-xs`}
          >
            {(Object.keys(categoryLabels) as ServiceCategory[]).map((key) => (
              <option key={key} value={key}>
                {categoryLabels[key]}
              </option>
            ))}
          </select>
          <p className="text-[0.62rem] text-neutral-400">
            A new service goes to the end of its category. Change the order by
            dragging rows on the services list.
          </p>
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
      </Section>

      <Section title="Name">
        <BilingualField
          labelPt="Name PT" valuePt={data.name_pt} onChangePt={(v) => set("name_pt", v)}
          labelEn="Name EN" valueEn={data.name_en} onChangeEn={(v) => set("name_en", v)}
        />
      </Section>

      <Section title="Description">
        <BilingualTextarea
          labelPt="Description PT" valuePt={data.desc_pt} onChangePt={(v) => set("desc_pt", v)}
          labelEn="Description EN" valueEn={data.desc_en} onChangeEn={(v) => set("desc_en", v)}
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
            Delete service
          </button>
        )}
        <div className="ml-auto flex gap-3">
          <Link href="/admin/services" className="rounded border border-neutral-300 px-4 py-2 text-[0.72rem] text-neutral-600 hover:bg-neutral-50">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-black px-4 py-2 text-[0.72rem] font-medium text-white hover:opacity-80 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save service"}
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
        <input value={valuePt} onChange={(e) => onChangePt(e.target.value)} required className={input} />
      </Field>
      <Field label={labelEn}>
        <input value={valueEn} onChange={(e) => onChangeEn(e.target.value)} required className={input} />
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
        <textarea value={valuePt} onChange={(e) => onChangePt(e.target.value)} rows={3} className={textarea} />
      </Field>
      <Field label={labelEn}>
        <textarea value={valueEn} onChange={(e) => onChangeEn(e.target.value)} rows={3} className={textarea} />
      </Field>
    </div>
  );
}

const input = "rounded border border-neutral-300 px-3 py-2 text-[0.8rem] focus:border-black focus:outline-none w-full";
const textarea = "rounded border border-neutral-300 px-3 py-2 text-[0.8rem] focus:border-black focus:outline-none w-full resize-none";
