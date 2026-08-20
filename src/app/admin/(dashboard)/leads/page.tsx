import { createClient } from "@/lib/supabase/server";

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black">Leads</h1>
        <span className="text-[0.72rem] text-neutral-500">{leads?.length ?? 0} total</span>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-[0.78rem]">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-neutral-600">Name</th>
              <th className="px-4 py-3 font-medium text-neutral-600">Email</th>
              <th className="px-4 py-3 font-medium text-neutral-600">Phone</th>
              <th className="px-4 py-3 font-medium text-neutral-600">Message</th>
              <th className="px-4 py-3 font-medium text-neutral-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {leads?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  No leads yet.
                </td>
              </tr>
            )}
            {leads?.map((lead) => (
              <tr key={lead.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium text-black">{lead.name}</td>
                <td className="px-4 py-3">
                  <a href={`mailto:${lead.email}`} className="text-black underline-offset-2 hover:underline">
                    {lead.email}
                  </a>
                </td>
                <td className="px-4 py-3 text-neutral-600">{lead.phone ?? "—"}</td>
                <td className="max-w-xs px-4 py-3 text-neutral-600">
                  <p className="line-clamp-2">{lead.message}</p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-neutral-500">
                  {new Date(lead.created_at).toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
