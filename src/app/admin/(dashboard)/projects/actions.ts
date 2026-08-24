"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/lib/projects";

export type ProjectFormData = {
  id?: string;
  slug: string;
  category: "digital" | "management";
  location: string;
  year: string;
  name_pt: string;
  name_en: string;
  services_pt: string;
  services_en: string;
  strategy_pt: string;
  strategy_en: string;
  what_we_did_pt: string;
  what_we_did_en: string;
  description: { pt: string; en: string }[];
  results: { value: string; label_pt: string; label_en: string }[];
  hero_image: string;
  gallery: GalleryItem[];
  sort_order: number;
  published: boolean;
};

export async function saveProject(data: ProjectFormData): Promise<{ error?: string }> {
  const supabase = await createClient();

  const row = {
    slug: data.slug,
    category: data.category,
    location: data.location,
    year: data.year,
    name: { pt: data.name_pt, en: data.name_en },
    services: { pt: data.services_pt, en: data.services_en },
    strategy: { pt: data.strategy_pt, en: data.strategy_en },
    what_we_did: { pt: data.what_we_did_pt, en: data.what_we_did_en },
    description: data.description,
    results: data.results.map((r) => ({
      value: r.value,
      label: { pt: r.label_pt, en: r.label_en },
    })),
    hero_image: data.hero_image,
    gallery: data.gallery.filter((item) => item.id),
    sort_order: data.sort_order,
    published: data.published,
  };

  const { error } = data.id
    ? await supabase.from("projects").update(row).eq("id", data.id)
    : await supabase.from("projects").insert(row);

  if (error) {
    if (error.code === "23505") {
      return { error: `Slug "${data.slug}" is already in use by another project.` };
    }
    return { error: error.message };
  }

  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}/digital`, "layout");
    revalidatePath(`/${locale}/digital/${data.slug}`, "page");
    revalidatePath(`/${locale}/management`, "layout");
    revalidatePath(`/${locale}/management/${data.slug}`, "page");
  }

  redirect("/admin/projects");
}

export async function deleteProject(id: string, slug: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}/digital`, "layout");
    revalidatePath(`/${locale}/digital/${slug}`, "page");
    revalidatePath(`/${locale}/management`, "layout");
    revalidatePath(`/${locale}/management/${slug}`, "page");
  }

  redirect("/admin/projects");
}
