import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ProjectRow } from "@/app/admin/(dashboard)/projects/projects-table";
import { ProjectsView } from "@/app/admin/(dashboard)/projects/projects-view";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, slug, name, category, location, year, hero_image, published, sort_order")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  const rows: ProjectRow[] = (projects ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: (p.name as { pt: string }).pt,
    category: p.category as ProjectRow["category"],
    location: p.location,
    year: p.year,
    heroImage: p.hero_image ?? "",
    published: p.published,
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded bg-black px-4 py-2 text-[0.72rem] font-medium text-white hover:opacity-80"
        >
          + New project
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-[0.78rem] text-red-700">
          Failed to load projects: {error.message}
        </p>
      )}

      {/* Keyed on the row order so a save elsewhere in the admin remounts the
          table with fresh server data instead of keeping stale local state. */}
      <ProjectsView key={rows.map((r) => r.id).join(":")} rows={rows} />
    </div>
  );
}
