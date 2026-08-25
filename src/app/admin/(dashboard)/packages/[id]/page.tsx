import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PackageForm } from "@/app/admin/(dashboard)/packages/package-form";
import type { PackageFormData } from "@/app/admin/(dashboard)/packages/actions";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("packages").select("*").eq("id", id).single();
  if (!data) notFound();

  const initial: PackageFormData = {
    id: data.id,
    name_pt: data.name.pt,
    name_en: data.name.en,
    description_pt: data.description.pt,
    description_en: data.description.en,
    features: data.features,
    popular: data.popular,
    sort_order: data.sort_order,
    published: data.published,
    section: data.section,
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">Edit Package</h1>
      <PackageForm initial={initial} />
    </div>
  );
}
