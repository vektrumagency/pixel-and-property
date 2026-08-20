import { createClient } from "@/lib/supabase/server";
import { createClient as createBaseClient } from "@supabase/supabase-js";

export type Localized = { pt: string; en: string };

export type Project = {
  id: string;
  slug: string;
  category: "digital" | "management";
  location: string;
  year: string;
  name: Localized;
  services: Localized;
  strategy: Localized;
  whatWeDid: Localized;
  description: Localized[];
  results: { value: string; label: Localized }[];
  heroImage: string;
  gallery: string[];
  sortOrder: number;
  published: boolean;
};

export type PageAsset = {
  id: string;
  page: string;
  slot: string;
  mediaType: "image" | "video";
  publicId: string;
};

type ProjectRow = {
  id: string;
  slug: string;
  category: "digital" | "management";
  location: string;
  year: string;
  name: Localized;
  services: Localized;
  strategy: Localized;
  what_we_did: Localized;
  description: Localized[];
  results: { value: string; label: Localized }[];
  hero_image: string;
  gallery: string[];
  sort_order: number;
  published: boolean;
};

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    location: row.location,
    year: row.year,
    name: row.name,
    services: row.services,
    strategy: row.strategy,
    whatWeDid: row.what_we_did,
    description: row.description,
    results: row.results,
    heroImage: row.hero_image,
    gallery: row.gallery,
    sortOrder: row.sort_order,
    published: row.published,
  };
}

function staticClient() {
  return createBaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getProjectSlugs(category: "digital" | "management"): Promise<string[]> {
  const { data } = await staticClient()
    .from("projects")
    .select("slug")
    .eq("category", category)
    .eq("published", true);
  return (data ?? []).map((r) => r.slug);
}

export async function getProjects(category?: "digital" | "management"): Promise<Project[]> {
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as ProjectRow[]).map(rowToProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return rowToProject(data as ProjectRow);
}

export async function getPageAssets(page: string): Promise<Record<string, PageAsset>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_assets")
    .select("*")
    .eq("page", page);

  if (error) return {};
  const map: Record<string, PageAsset> = {};
  for (const row of data) {
    map[row.slot] = {
      id: row.id,
      page: row.page,
      slot: row.slot,
      mediaType: row.media_type,
      publicId: row.public_id,
    };
  }
  return map;
}

export async function getAllPageAssets(): Promise<Record<string, Record<string, PageAsset>>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("page_assets").select("*");
  if (error) return {};
  const map: Record<string, Record<string, PageAsset>> = {};
  for (const row of data) {
    if (!map[row.page]) map[row.page] = {};
    map[row.page][row.slot] = {
      id: row.id,
      page: row.page,
      slot: row.slot,
      mediaType: row.media_type,
      publicId: row.public_id,
    };
  }
  return map;
}
