import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TestimonialForm } from "@/app/admin/(dashboard)/testimonials/testimonial-form";
import type { TestimonialFormData } from "@/app/admin/(dashboard)/testimonials/actions";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").eq("id", id).single();
  if (!data) notFound();

  const initial: TestimonialFormData = {
    id: data.id,
    author: data.author,
    quote_pt: data.quote.pt,
    quote_en: data.quote.en,
    job_pt: data.job.pt,
    job_en: data.job.en,
    sort_order: data.sort_order,
    published: data.published,
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">Edit Testimonial</h1>
      <TestimonialForm initial={initial} />
    </div>
  );
}
