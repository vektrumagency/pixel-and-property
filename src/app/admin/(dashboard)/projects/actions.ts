"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
  gallery: string[];
  sort_order: number;
  published: boolean;
};

export async function saveProject(data: ProjectFormData) {
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
    gallery: data.gallery.filter(Boolean),
    sort_order: data.sort_order,
    published: data.published,
  };

  if (data.id) {
    await supabase.from("projects").update(row).eq("id", data.id);
  } else {
    await supabase.from("projects").insert(row);
  }

  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}/digital`, "layout");
    revalidatePath(`/${locale}/digital/${data.slug}`, "page");
    revalidatePath(`/${locale}/management`, "layout");
  }

  redirect("/admin/projects");
}

export async function deleteProject(id: string, slug: string) {
  const supabase = await createClient();
  await supabase.from("projects").delete().eq("id", id);

  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}/digital`, "layout");
    revalidatePath(`/${locale}/digital/${slug}`, "page");
  }

  redirect("/admin/projects");
}
