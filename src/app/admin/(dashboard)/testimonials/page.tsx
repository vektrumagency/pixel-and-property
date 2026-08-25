import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("id, author, job, published, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="rounded bg-black px-4 py-2 text-[0.72rem] font-medium text-white hover:opacity-80"
        >
          + New testimonial
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-[0.78rem] text-red-700">
          Failed to load testimonials: {error.message}
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-[0.78rem]">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-neutral-600">Author</th>
              <th className="px-4 py-3 font-medium text-neutral-600">Job</th>
              <th className="px-4 py-3 font-medium text-neutral-600">Sort</th>
              <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {testimonials?.map((t) => (
              <tr key={t.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium text-black">{t.author}</td>
                <td className="px-4 py-3 text-neutral-600">{(t.job as { pt: string }).pt}</td>
                <td className="px-4 py-3 text-neutral-600">{t.sort_order}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                      t.published
                        ? "bg-green-100 text-green-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {t.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/testimonials/${t.id}`}
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
}
