"use client";

import Link from "next/link";
import { useState } from "react";
import { saveProject, deleteProject, type ProjectFormData } from "@/app/admin/(dashboard)/projects/actions";
import { MediaUploader } from "@/components/admin/media-uploader";
import { GalleryDropzone } from "@/components/admin/gallery-dropzone";
import { SortableGalleryGrid } from "@/components/admin/sortable-gallery-grid";
import { ProjectPreview } from "@/app/admin/(dashboard)/projects/project-preview";
import { slugify } from "@/lib/slug";
import type { Service } from "@/lib/projects";

function empty(nextSortOrder: number): ProjectFormData {
  return {
    slug: "",
    category: "digital",
    location: "",
    year: new Date().getFullYear().toString(),
    name_pt: "",
    name_en: "",
    services_pt: "",
    services_en: "",
    description: [{ pt: "", en: "" }],
    hero_image: "",
    gallery: [],
    sort_order: nextSortOrder,
    published: true,
  };
}

export function ProjectForm({
  initial,
  nextSortOrder = 1,
  serviceCatalog,
}: {
  initial?: ProjectFormData;
  nextSortOrder?: number;
  /** The same catalogue the public quote page offers, so the two never drift. */
  serviceCatalog: Service[];
}) {
  const [data, setData] = useState<ProjectFormData>(initial ?? empty(nextSortOrder));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  // Slug is derived from the name automatically and never shown or edited
  // in this form. Once a project exists, its slug stays fixed (it's the
  // public URL and the Cloudinary folder name for media already uploaded
  // under it) — only new projects derive theirs from the name as it's typed.
  const slugLocked = Boolean(initial?.id);

  function set<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function setNamePt(value: string) {
    setData((prev) => ({
      ...prev,
      name_pt: value,
      slug: slugLocked ? prev.slug : slugify(value),
    }));
  }

  // The PT and EN service lists are kept index-aligned, so a catalogue entry is
  // considered selected only when both locales carry its name.
  function toggleService(id: string) {
    const item = serviceCatalog.find((x) => x.id === id);
    if (!item) return;
    setData((prev) => {
      const parts = (value: string) => value.split(",").map((x) => x.trim()).filter(Boolean);
      const ptParts = parts(prev.services_pt);
      const enParts = parts(prev.services_en);
      const selected = ptParts.includes(item.name.pt) && enParts.includes(item.name.en);
      const next = (list: string[], name: string) =>
        (selected ? list.filter((x) => x !== name) : [...list, name]).join(", ");
      return {
        ...prev,
        services_pt: next(ptParts, item.name.pt),
        services_en: next(enParts, item.name.en),
      };
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await saveProject(data);
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  async function handleDelete() {
    if (!data.id) return;
    if (!confirm(`Delete project "${data.name_pt}"? This cannot be undone.`)) return;
    setSaving(true);
    setError(null);
    const result = await deleteProject(data.id, data.slug);
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <Section title="Basic Info">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
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
          labelPt="Name PT" valuePt={data.name_pt} onChangePt={setNamePt}
          labelEn="Name EN" valueEn={data.name_en} onChangeEn={(v) => set("name_en", v)}
        />
      </Section>

      <Section title="Services">
        <div className="flex flex-wrap gap-2">
          {serviceCatalog.map((item) => {
            const selected =
              data.services_pt.split(",").map((x) => x.trim()).includes(item.name.pt) &&
              data.services_en.split(",").map((x) => x.trim()).includes(item.name.en);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleService(item.id)}
                title={item.desc.pt}
                className={`rounded border px-3 py-1.5 text-[0.68rem] transition-colors ${
                  selected
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {item.name.pt}
              </button>
            );
          })}
        </div>
        <p className="text-[0.62rem] text-neutral-400">
          Click a service to add or remove it in both languages. The fields below stay
          editable for anything not in the catalogue.
        </p>
        <BilingualField
          labelPt="Services PT" valuePt={data.services_pt} onChangePt={(v) => set("services_pt", v)}
          labelEn="Services EN" valueEn={data.services_en} onChangeEn={(v) => set("services_en", v)}
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

      <Section title="Media">
        <MediaUploader
          label="Hero image"
          value={data.hero_image}
          onChange={(v) => set("hero_image", v)}
          folder={`pixel/projects/${data.slug || "_new"}`}
        />
        <div className="space-y-3">
          <label className="text-[0.68rem] font-medium text-neutral-600">Gallery</label>
          <SortableGalleryGrid
            items={data.gallery}
            onReorder={(next) => set("gallery", next)}
            onRemove={(i) => set("gallery", data.gallery.filter((_, j) => j !== i))}
            onTypeChange={(i, type) =>
              set("gallery", data.gallery.map((g, j) => (j === i ? { ...g, type } : g)))
            }
          />
          <GalleryDropzone
            folder={`pixel/projects/${data.slug || "_new"}`}
            onUploaded={(items) =>
              setData((prev) => ({ ...prev, gallery: [...prev.gallery, ...items] }))
            }
          />
        </div>
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
            Delete project
          </button>
        )}
        <div className="ml-auto flex gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="rounded border border-neutral-300 px-4 py-2 text-[0.72rem] text-neutral-600 hover:bg-neutral-50"
          >
            Preview
          </button>
          <Link href="/admin/projects" className="rounded border border-neutral-300 px-4 py-2 text-[0.72rem] text-neutral-600 hover:bg-neutral-50">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-black px-4 py-2 text-[0.72rem] font-medium text-white hover:opacity-80 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save project"}
          </button>
        </div>
      </div>

      {showPreview && <ProjectPreview data={data} onClose={() => setShowPreview(false)} />}
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
