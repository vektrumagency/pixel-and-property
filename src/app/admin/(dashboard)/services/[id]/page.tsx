import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ServiceForm } from "@/app/admin/(dashboard)/services/service-form";
import type { ServiceFormData } from "@/app/admin/(dashboard)/services/actions";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").eq("id", id).single();
  if (!data) notFound();

  const initial: ServiceFormData = {
    id: data.id,
    category: data.category,
    name_pt: data.name.pt,
    name_en: data.name.en,
    desc_pt: data.desc.pt,
    desc_en: data.desc.en,
    published: data.published,
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">Edit Service</h1>
      <ServiceForm initial={initial} />
    </div>
  );
}
