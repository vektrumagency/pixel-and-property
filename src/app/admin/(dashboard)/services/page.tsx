import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ServicesTable, type ServiceRow } from "@/app/admin/(dashboard)/services/services-table";
import type { ServiceCategory } from "@/lib/projects";

type Row = {
  id: string;
  category: ServiceCategory;
  name: { pt: string };
  desc: { pt: string };
  published: boolean;
};

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, category, name, desc, sort_order, published")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  const rows: ServiceRow[] = ((data ?? []) as Row[]).map((s) => ({
    id: s.id,
    category: s.category,
    name: s.name.pt,
    desc: s.desc.pt,
    published: s.published,
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black">Services</h1>
        <Link
          href="/admin/services/new"
          className="rounded bg-black px-4 py-2 text-[0.72rem] font-medium text-white hover:opacity-80"
        >
          + New service
        </Link>
      </div>

      <p className="mb-6 text-[0.72rem] text-neutral-500">
        These are the services a client can pick on the public quote page.
      </p>

      {error && (
        <p className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-[0.78rem] text-red-700">
          Failed to load services: {error.message}
        </p>
      )}

      {/* Keyed on the row order so a save elsewhere in the admin remounts the
          table with fresh server data instead of keeping stale local state. */}
      <ServicesTable key={rows.map((r) => r.id).join(":")} rows={rows} />
    </div>
  );
}
