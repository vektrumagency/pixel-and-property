"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type PackageSection = "management" | "digital";

export type PackageFormData = {
  id?: string;
  name_pt: string;
  name_en: string;
  description_pt: string;
  description_en: string;
  features: { pt: string; en: string }[];
  popular: boolean;
  sort_order: number;
  published: boolean;
  section: PackageSection;
};

export async function savePackage(data: PackageFormData): Promise<{ error?: string }> {
  const supabase = await createClient();

  const row = {
    name: { pt: data.name_pt, en: data.name_en },
    description: { pt: data.description_pt, en: data.description_en },
    features: data.features.filter((f) => f.pt || f.en),
    popular: data.popular,
    sort_order: data.sort_order,
    published: data.published,
    section: data.section,
  };

  const { error } = data.id
    ? await supabase.from("packages").update(row).eq("id", data.id)
    : await supabase.from("packages").insert(row);

  if (error) {
    return { error: error.message };
  }

  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}/management`, "layout");
    revalidatePath(`/${locale}/digital`, "layout");
  }

  redirect("/admin/packages");
}

export async function deletePackage(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("packages").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}/management`, "layout");
    revalidatePath(`/${locale}/digital`, "layout");
  }

  redirect("/admin/packages");
}
