"use client";

import Link from "next/link";
import { useState } from "react";
import { savePackage, deletePackage, type PackageFormData } from "@/app/admin/(dashboard)/packages/actions";

function empty(nextSortOrder: number): PackageFormData {
  return {
    name_pt: "",
    name_en: "",
    description_pt: "",
    description_en: "",
    features: [{ pt: "", en: "" }],
    popular: false,
    sort_order: nextSortOrder,
    published: true,
    section: "management",
  };
}

export function PackageForm({
  initial,
  nextSortOrder = 1,
}: {
  initial?: PackageFormData;
  nextSortOrder?: number;
}) {
  const [data, setData] = useState<PackageFormData>(initial ?? empty(nextSortOrder));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof PackageFormData>(key: K, value: PackageFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await savePackage(data);
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  async function handleDelete() {
    if (!data.id) return;
    if (!confirm(`Delete package "${data.name_pt}"? This cannot be undone.`)) return;
    setSaving(true);
    setError(null);
    const result = await deletePackage(data.id);
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <Section title="Basic Info">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="popular"
            checked={data.popular}
            onChange={(e) => set("popular", e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="popular" className="text-[0.78rem] text-neutral-700">Mark as &quot;Most Popular&quot;</label>
        </div>
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

      <Section title="Name">
        <BilingualField
          labelPt="Name PT" valuePt={data.name_pt} onChangePt={(v) => set("name_pt", v)}
          labelEn="Name EN" valueEn={data.name_en} onChangeEn={(v) => set("name_en", v)}
        />
      </Section>

      <Section title="Description">
        <BilingualField
          labelPt="Description PT" valuePt={data.description_pt} onChangePt={(v) => set("description_pt", v)}
          labelEn="Description EN" valueEn={data.description_en} onChangeEn={(v) => set("description_en", v)}
        />
      </Section>

      <Section title="Features">
        {data.features.map((f, i) => (
          <div key={i} className="rounded border border-neutral-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.72rem] font-medium text-neutral-500">Feature {i + 1}</span>
              {data.features.length > 1 && (
                <button type="button" onClick={() => set("features", data.features.filter((_, j) => j !== i))} className="text-[0.65rem] text-red-500 hover:underline">Remove</button>
              )}
            </div>
            <BilingualField
              labelPt="PT" valuePt={f.pt} onChangePt={(v) => set("features", data.features.map((x, j) => j === i ? { ...x, pt: v } : x))}
              labelEn="EN" valueEn={f.en} onChangeEn={(v) => set("features", data.features.map((x, j) => j === i ? { ...x, en: v } : x))}
            />
          </div>
        ))}
        <button type="button" onClick={() => set("features", [...data.features, { pt: "", en: "" }])} className="text-[0.72rem] text-black underline-offset-2 hover:underline">+ Add feature</button>
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
            Delete package
          </button>
        )}
        <div className="ml-auto flex gap-3">
          <Link href="/admin/packages" className="rounded border border-neutral-300 px-4 py-2 text-[0.72rem] text-neutral-600 hover:bg-neutral-50">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-black px-4 py-2 text-[0.72rem] font-medium text-white hover:opacity-80 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save package"}
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

const input = "rounded border border-neutral-300 px-3 py-2 text-[0.8rem] focus:border-black focus:outline-none w-full";
