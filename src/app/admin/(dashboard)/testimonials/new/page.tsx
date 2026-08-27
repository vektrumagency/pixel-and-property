import { TestimonialForm } from "@/app/admin/(dashboard)/testimonials/testimonial-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewTestimonialPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSortOrder = (data?.sort_order ?? 0) + 1;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">New Testimonial</h1>
      <TestimonialForm nextSortOrder={nextSortOrder} />
    </div>
  );
}
