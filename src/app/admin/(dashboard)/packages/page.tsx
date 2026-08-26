import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
        const rows = packages?.filter((p) => (p.section ?? "management") === key) ?? [];
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

            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <table className="w-full text-[0.78rem]">
                <thead className="border-b border-neutral-200 bg-neutral-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium text-neutral-600">Name</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Popular</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Sort</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-neutral-400">
                        No {label.toLowerCase()} packages yet.
                      </td>
                    </tr>
                  )}
                  {rows.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 font-medium text-black">
                        {(p.name as { pt: string }).pt}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{p.popular ? "Yes" : ""}</td>
                      <td className="px-4 py-3 text-neutral-600">{p.sort_order}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                            p.published
                              ? "bg-green-100 text-green-700"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {p.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/packages/${p.id}`}
                          className="text-[0.72rem] text-black underline-offset-2 hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
