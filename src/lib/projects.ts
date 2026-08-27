import { createClient } from "@/lib/supabase/server";
import { createClient as createBaseClient } from "@supabase/supabase-js";
import { services as fallbackServices } from "@/data/services";

export type Localized = { pt: string; en: string };

export type GalleryItem = { id: string; type: "image" | "video" };

/** Gallery rows predating the jsonb migration are bare public-id strings. */
export function normalizeGallery(raw: unknown): GalleryItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry): GalleryItem | null => {
      if (typeof entry === "string") {
        return entry ? { id: entry, type: "image" } : null;
      }
      if (entry && typeof entry === "object" && "id" in entry) {
        const { id, type } = entry as { id?: unknown; type?: unknown };
        if (typeof id !== "string" || !id) return null;
        return { id, type: type === "video" ? "video" : "image" };
      }
      return null;
    })
    .filter((item): item is GalleryItem => item !== null);
}

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
  gallery: GalleryItem[];
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
  gallery: unknown;
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
    gallery: normalizeGallery(row.gallery),
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
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as ProjectRow[]).map(rowToProject);
}

export async function getProjectBySlug(
  slug: string,
  category: "digital" | "management"
): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("category", category)
    .eq("published", true)
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

export type PackageSection = "management" | "digital";

export type Package = {
  id: string;
  name: Localized;
  description: Localized;
  features: Localized[];
  popular: boolean;
  sortOrder: number;
  published: boolean;
  section: PackageSection;
};

type PackageRow = {
  id: string;
  name: Localized;
  description: Localized;
  features: Localized[];
  popular: boolean;
  sort_order: number;
  published: boolean;
  section: PackageSection;
};

function rowToPackage(row: PackageRow): Package {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    features: row.features,
    popular: row.popular,
    sortOrder: row.sort_order,
    published: row.published,
    section: row.section,
  };
}

export async function getPackages(section: PackageSection): Promise<Package[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("published", true)
    .eq("section", section)
    .order("sort_order", { ascending: true });

  if (error) return [];
  return (data as PackageRow[]).map(rowToPackage);
}

export type Testimonial = {
  id: string;
  author: string;
  quote: Localized;
  job: Localized;
  sortOrder: number;
  published: boolean;
};

type TestimonialRow = {
  id: string;
  author: string;
  quote: Localized;
  job: Localized;
  sort_order: number;
  published: boolean;
};

function rowToTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    author: row.author,
    quote: row.quote,
    job: row.job,
    sortOrder: row.sort_order,
    published: row.published,
  };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) return [];
  return (data as TestimonialRow[]).map(rowToTestimonial);
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

export type ServiceCategory = "media" | "ondemand";

export type Service = {
  id: string;
  category: ServiceCategory;
  name: Localized;
  desc: Localized;
  sortOrder: number;
  published: boolean;
};

type ServiceRow = {
  id: string;
  category: ServiceCategory;
  name: Localized;
  desc: Localized;
  sort_order: number;
  published: boolean;
};

function rowToService(row: ServiceRow): Service {
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    desc: row.desc,
    sortOrder: row.sort_order,
    published: row.published,
  };
}

/**
 * The catalogue shown on the public quote page and in the admin project form.
 * Falls back to the list that used to be hardcoded, so a failed query or an
 * unseeded table never leaves either page with nothing to offer.
 */
export async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackServices.map((item, index) => ({
      id: item.id,
      category: item.category,
      name: item.name,
      desc: item.desc,
      sortOrder: index + 1,
      published: true,
    }));
  }
  return (data as ServiceRow[]).map(rowToService);
}
