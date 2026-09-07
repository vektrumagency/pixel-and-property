"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import { normalizeGallery, type GalleryItem } from "@/lib/projects";
import { cleanupOrphanedAssets } from "@/lib/cloudinary-server";

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
  description: { pt: string; en: string }[];
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

  // Snapshot the assets this project referenced before the edit, so we can
  // clean up any that the admin removed once the new row is committed.
  const oldAssets: GalleryItem[] = [];
  if (data.id) {
    const { data: prev } = await supabase
      .from("projects")
      .select("hero_image, gallery")
      .eq("id", data.id)
      .maybeSingle();
    if (prev) {
      if (prev.hero_image) oldAssets.push({ id: prev.hero_image, type: "image" });
      oldAssets.push(...normalizeGallery(prev.gallery));
    }
  }

  const row = {
    category: data.category,
    location: data.location,
    year: data.year,
    name: { pt: data.name_pt, en: data.name_en },
    services: { pt: data.services_pt, en: data.services_en },
    description: data.description,
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
        // strategy/what_we_did/results are DB columns (NOT NULL, no default)
        // that the admin form no longer collects - they're never rendered on
        // the public site. New rows get empty placeholders so the insert
        // succeeds; existing rows keep whatever they already have, since
        // updates above never touch these three columns.
        return supabase.from("projects").insert({
          ...row,
          slug,
          strategy: { pt: "", en: "" },
          what_we_did: { pt: "", en: "" },
          results: [],
        });
      })();

  if (error) {
    return { error: error.message };
  }

  // Delete from Cloudinary any asset the admin removed in this edit, unless it
  // is still referenced elsewhere (reference-checked inside the helper).
  if (data.id && oldAssets.length) {
    const keptIds = new Set<string>();
    if (data.hero_image) keptIds.add(data.hero_image);
    for (const item of data.gallery) if (item.id) keptIds.add(item.id);
    await cleanupOrphanedAssets(
      supabase,
      oldAssets.filter((asset) => !keptIds.has(asset.id))
    );
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

  // Snapshot the project's assets before deleting the row, then clean up any
  // that are now orphaned (reference-checked — a shared asset is kept).
  const { data: prev } = await supabase
    .from("projects")
    .select("hero_image, gallery")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  if (prev) {
    const removed: GalleryItem[] = [];
    if (prev.hero_image) removed.push({ id: prev.hero_image, type: "image" });
    removed.push(...normalizeGallery(prev.gallery));
    await cleanupOrphanedAssets(supabase, removed);
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

  const { data: prev } = await supabase
    .from("projects")
    .select("hero_image")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("projects")
    .update({ hero_image: publicId })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  // The previous hero was swapped out — remove it from Cloudinary if orphaned.
  if (prev?.hero_image && prev.hero_image !== publicId) {
    await cleanupOrphanedAssets(supabase, [{ id: prev.hero_image, type: "image" }]);
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
