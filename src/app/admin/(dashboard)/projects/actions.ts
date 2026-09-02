"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import type { GalleryItem } from "@/lib/projects";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/** Appends -2, -3, ... until the slug is free, so two similarly-named projects never collide. */
async function uniqueSlug(supabase: SupabaseServerClient, base: string): Promise<string> {
  const root = base || "project";
  let candidate = root;
  let n = 2;
  while (true) {
    const { data } = await supabase.from("projects").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${root}-${n++}`;
  }
}

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

  const name = data.name_pt.trim();
  let dupQuery = supabase.from("projects").select("id").ilike("name->>pt", name);
  if (data.id) dupQuery = dupQuery.neq("id", data.id);
  const { data: duplicate } = await dupQuery.maybeSingle();
  if (duplicate) {
    return { error: `Name "${name}" is already in use by another project.` };
  }

  const row = {
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

  // The slug is never taken from the client: on create it's derived from the
  // name here, and on update the existing slug is left untouched so a saved
  // project's public URL never changes underneath it.
  let slug = data.slug;
  const { error } = data.id
    ? await supabase.from("projects").update(row).eq("id", data.id)
    : await (async () => {
        slug = await uniqueSlug(supabase, slugify(name));
        return supabase.from("projects").insert({ ...row, slug });
      })();

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

export async function reorderProjects(ids: string[]): Promise<{ error?: string }> {
  const supabase = await createClient();

  // sort_order is only compared inside a category on the public pages, so each
  // category is numbered from 1 independently.
  const results = await Promise.all(
    ids.map((id, index) =>
      supabase.from("projects").update({ sort_order: index + 1 }).eq("id", id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return { error: failed.error.message };
  }

  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}/digital`, "layout");
    revalidatePath(`/${locale}/management`, "layout");
  }
  revalidatePath("/admin/projects");

  return {};
}

/** Swaps only the hero image, for the card grid on the projects overview. */
export async function updateProjectHeroImage(
  id: string,
  slug: string,
  publicId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ hero_image: publicId })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}/digital`, "layout");
    revalidatePath(`/${locale}/digital/${slug}`, "page");
    revalidatePath(`/${locale}/management`, "layout");
    revalidatePath(`/${locale}/management/${slug}`, "page");
  }
  revalidatePath("/admin/projects");

  return {};
}
