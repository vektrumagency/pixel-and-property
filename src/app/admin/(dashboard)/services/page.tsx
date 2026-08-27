import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ServiceCategory } from "@/lib/projects";

const categoryLabels: Record<ServiceCategory, string> = {
  media: "Photography & Video",
  ondemand: "On Demand",
};

const categoryOrder: ServiceCategory[] = ["media", "ondemand"];

type Row = {
  id: string;
  category: ServiceCategory;
  name: { pt: string };
  desc: { pt: string };
  sort_order: number;
  published: boolean;
};

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, category, name, desc, sort_order, published")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  const services = (data ?? []) as Row[];

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

      <div className="space-y-8">
        {categoryOrder.map((category) => {
          const group = services.filter((s) => s.category === category);
          if (!group.length) return null;
          return (
            <div key={category}>
              <h2 className="mb-2 text-[0.78rem] font-medium text-neutral-700">
                {categoryLabels[category]}
              </h2>
              <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
                <table className="w-full text-[0.78rem]">
                  <thead className="border-b border-neutral-200 bg-neutral-50 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium text-neutral-600">Name</th>
                      <th className="px-4 py-3 font-medium text-neutral-600">Description</th>
                      <th className="px-4 py-3 font-medium text-neutral-600">Sort</th>
                      <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {group.map((s) => (
                      <tr key={s.id} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 font-medium text-black">{s.name.pt}</td>
                        <td className="max-w-md truncate px-4 py-3 text-neutral-600">
                          {s.desc.pt}
                        </td>
                        <td className="px-4 py-3 text-neutral-600">{s.sort_order}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                              s.published
                                ? "bg-green-100 text-green-700"
                                : "bg-neutral-100 text-neutral-500"
                            }`}
                          >
                            {s.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/admin/services/${s.id}`}
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
    </div>
  );
}
