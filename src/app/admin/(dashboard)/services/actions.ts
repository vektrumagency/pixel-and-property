"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ServiceCategory } from "@/lib/projects";

export type ServiceFormData = {
  id?: string;
  category: ServiceCategory;
  name_pt: string;
  name_en: string;
  desc_pt: string;
  desc_en: string;
  sort_order: number;
  published: boolean;
};

export async function saveService(data: ServiceFormData): Promise<{ error?: string }> {
  const supabase = await createClient();

  const row = {
    category: data.category,
    name: { pt: data.name_pt, en: data.name_en },
    desc: { pt: data.desc_pt, en: data.desc_en },
    sort_order: data.sort_order,
    published: data.published,
  };

  const { error } = data.id
    ? await supabase.from("services").update(row).eq("id", data.id)
    : await supabase.from("services").insert(row);

  if (error) {
    return { error: error.message };
  }

  // The catalogue drives the public /services page, and the project form reads
  // the same rows for its services picker.
  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}/services`, "page");
  }
  revalidatePath("/admin/projects", "layout");

  redirect("/admin/services");
}

export async function deleteService(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}/services`, "page");
  }
  revalidatePath("/admin/projects", "layout");

  redirect("/admin/services");
}
