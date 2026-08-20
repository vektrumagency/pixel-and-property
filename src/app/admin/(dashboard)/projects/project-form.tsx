"use client";

import { useState } from "react";
import { saveProject, deleteProject, type ProjectFormData } from "@/app/admin/(dashboard)/projects/actions";

const EMPTY: ProjectFormData = {
  slug: "",
  category: "digital",
  location: "",
  year: new Date().getFullYear().toString(),
  name_pt: "",
  name_en: "",
  services_pt: "",
  services_en: "",
  strategy_pt: "",
  strategy_en: "",
  what_we_did_pt: "",
  what_we_did_en: "",
  description: [{ pt: "", en: "" }],
  results: [{ value: "", label_pt: "", label_en: "" }],
  hero_image: "",
  gallery: ["", "", "", ""],
  sort_order: 0,
  published: true,
};

export function ProjectForm({ initial }: { initial?: ProjectFormData }) {
  const [data, setData] = useState<ProjectFormData>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await saveProject(data);
  }

  async function handleDelete() {
    if (!data.id) return;
    if (!confirm(`Delete project "${data.name_pt}"? This cannot be undone.`)) return;
    setSaving(true);
    await deleteProject(data.id, data.slug);
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <Section title="Basic Info">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Field label="Slug" required>
            <input
              value={data.slug}
              onChange={(e) => set("slug", e.target.value)}
              required
              placeholder="villa-moderna"
              className={input}
            />
          </Field>
          <Field label="Category">
            <select value={data.category} onChange={(e) => set("category", e.target.value as "digital" | "management")} className={input}>
              <option value="digital">Digital</option>
              <option value="management">Management</option>
            </select>
          </Field>
          <Field label="Location" required>
            <input value={data.location} onChange={(e) => set("location", e.target.value)} required className={input} />
          </Field>
          <Field label="Year" required>
            <input value={data.year} onChange={(e) => set("year", e.target.value)} required className={input} />
          </Field>
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

      <Section title="Services">
        <BilingualField
          labelPt="Services PT" valuePt={data.services_pt} onChangePt={(v) => set("services_pt", v)}
          labelEn="Services EN" valueEn={data.services_en} onChangeEn={(v) => set("services_en", v)}
        />
      </Section>

      <Section title="Strategy">
        <BilingualTextarea
          labelPt="Strategy PT" valuePt={data.strategy_pt} onChangePt={(v) => set("strategy_pt", v)}
          labelEn="Strategy EN" valueEn={data.strategy_en} onChangeEn={(v) => set("strategy_en", v)}
        />
      </Section>

      <Section title="What We Did">
        <BilingualTextarea
          labelPt="What We Did PT" valuePt={data.what_we_did_pt} onChangePt={(v) => set("what_we_did_pt", v)}
          labelEn="What We Did EN" valueEn={data.what_we_did_en} onChangeEn={(v) => set("what_we_did_en", v)}
        />
      </Section>

      <Section title="Description Paragraphs">
        {data.description.map((para, i) => (
          <div key={i} className="rounded border border-neutral-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.72rem] font-medium text-neutral-500">Paragraph {i + 1}</span>
              {data.description.length > 1 && (
                <button type="button" onClick={() => set("description", data.description.filter((_, j) => j !== i))} className="text-[0.65rem] text-red-500 hover:underline">Remove</button>
              )}
            </div>
            <BilingualTextarea
              labelPt="PT" valuePt={para.pt} onChangePt={(v) => set("description", data.description.map((p, j) => j === i ? { ...p, pt: v } : p))}
              labelEn="EN" valueEn={para.en} onChangeEn={(v) => set("description", data.description.map((p, j) => j === i ? { ...p, en: v } : p))}
            />
          </div>
        ))}
        <button type="button" onClick={() => set("description", [...data.description, { pt: "", en: "" }])} className="text-[0.72rem] text-black underline-offset-2 hover:underline">+ Add paragraph</button>
      </Section>

      <Section title="Results">
        {data.results.map((result, i) => (
          <div key={i} className="rounded border border-neutral-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.72rem] font-medium text-neutral-500">Result {i + 1}</span>
              {data.results.length > 1 && (
                <button type="button" onClick={() => set("results", data.results.filter((_, j) => j !== i))} className="text-[0.65rem] text-red-500 hover:underline">Remove</button>
              )}
            </div>
            <Field label="Value">
              <input value={result.value} onChange={(e) => set("results", data.results.map((r, j) => j === i ? { ...r, value: e.target.value } : r))} placeholder="12" className={input} />
            </Field>
            <BilingualField
              labelPt="Label PT" valuePt={result.label_pt} onChangePt={(v) => set("results", data.results.map((r, j) => j === i ? { ...r, label_pt: v } : r))}
              labelEn="Label EN" valueEn={result.label_en} onChangeEn={(v) => set("results", data.results.map((r, j) => j === i ? { ...r, label_en: v } : r))}
            />
          </div>
        ))}
        <button type="button" onClick={() => set("results", [...data.results, { value: "", label_pt: "", label_en: "" }])} className="text-[0.72rem] text-black underline-offset-2 hover:underline">+ Add result</button>
      </Section>

      <Section title="Media">
        <Field label="Hero Image URL or Cloudinary public_id">
          <input value={data.hero_image} onChange={(e) => set("hero_image", e.target.value)} placeholder="pixel/projects/villa-moderna/hero" className={input} />
        </Field>
        <div className="space-y-2">
          <label className="text-[0.68rem] font-medium text-neutral-600">Gallery (4 images)</label>
          {data.gallery.map((url, i) => (
            <input
              key={i}
              value={url}
              onChange={(e) => set("gallery", data.gallery.map((u, j) => j === i ? e.target.value : u))}
              placeholder={`Gallery image ${i + 1}`}
              className={input}
            />
          ))}
        </div>
      </Section>

      <div className="flex items-center justify-between border-t border-neutral-200 pt-6">
        {data.id && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="rounded border border-red-300 px-4 py-2 text-[0.72rem] text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete project
          </button>
        )}
        <div className="ml-auto flex gap-3">
          <a href="/admin/projects" className="rounded border border-neutral-300 px-4 py-2 text-[0.72rem] text-neutral-600 hover:bg-neutral-50">
            Cancel
          </a>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-black px-4 py-2 text-[0.72rem] font-medium text-white hover:opacity-80 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save project"}
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
