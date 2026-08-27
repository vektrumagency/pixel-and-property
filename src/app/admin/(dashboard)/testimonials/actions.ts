"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type TestimonialFormData = {
  id?: string;
  author: string;
  quote_pt: string;
  quote_en: string;
  job_pt: string;
  job_en: string;
  sort_order: number;
  published: boolean;
};

export async function saveTestimonial(data: TestimonialFormData): Promise<{ error?: string }> {
  const supabase = await createClient();

  const row = {
    author: data.author,
    quote: { pt: data.quote_pt, en: data.quote_en },
    job: { pt: data.job_pt, en: data.job_en },
    sort_order: data.sort_order,
    published: data.published,
  };

  const { error } = data.id
    ? await supabase.from("testimonials").update(row).eq("id", data.id)
    : await supabase.from("testimonials").insert(row);

  if (error) {
    return { error: error.message };
  }

  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}`, "layout");
  }

  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}`, "layout");
  }

  redirect("/admin/testimonials");
}
