import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PackagesTable, type PackageRow } from "@/app/admin/(dashboard)/packages/packages-table";

const SECTIONS: { key: string; label: string }[] = [
  { key: "management", label: "Management" },
  { key: "digital", label: "Digital" },
];

export default async function AdminPackagesPage() {
  const supabase = await createClient();
  const { data: packages, error } = await supabase
    .from("packages")
    .select("id, name, section, popular, published, sort_order")
    .order("section", { ascending: true })
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black">Packages</h1>
        <Link
          href="/admin/packages/new"
          className="rounded bg-black px-4 py-2 text-[0.72rem] font-medium text-white hover:opacity-80"
        >
          + New package
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-[0.78rem] text-red-700">
          Failed to load packages: {error.message}
        </p>
      )}

      {SECTIONS.map(({ key, label }) => {
        const rows: PackageRow[] = (packages ?? [])
          .filter((p) => (p.section ?? "management") === key)
          .map((p) => ({
            id: p.id,
            name: (p.name as { pt: string }).pt,
            section: key as PackageRow["section"],
            popular: p.popular,
            published: p.published,
            sortOrder: p.sort_order,
          }));
        return (
          <div key={key} className="mb-8">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-[0.82rem] font-semibold uppercase tracking-wide text-neutral-700">
                {label}
              </h2>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[0.65rem] font-medium text-neutral-500">
                {rows.length}
              </span>
            </div>

            <PackagesTable key={rows.map((r) => `${r.id}:${r.popular}`).join(",")} label={label} rows={rows} />
          </div>
        );
      })}
    </div>
  );
}
