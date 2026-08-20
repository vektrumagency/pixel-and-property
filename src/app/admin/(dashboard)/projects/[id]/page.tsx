import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/app/admin/(dashboard)/projects/project-form";
import type { ProjectFormData } from "@/app/admin/(dashboard)/projects/actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!data) notFound();

  const initial: ProjectFormData = {
    id: data.id,
    slug: data.slug,
    category: data.category,
    location: data.location,
    year: data.year,
    name_pt: data.name.pt,
    name_en: data.name.en,
    services_pt: data.services.pt,
    services_en: data.services.en,
    strategy_pt: data.strategy.pt,
    strategy_en: data.strategy.en,
    what_we_did_pt: data.what_we_did.pt,
    what_we_did_en: data.what_we_did.en,
    description: data.description,
    results: data.results.map((r: { value: string; label: { pt: string; en: string } }) => ({
      value: r.value,
      label_pt: r.label.pt,
      label_en: r.label.en,
    })),
    hero_image: data.hero_image,
    gallery: [
      data.gallery?.[0] ?? "",
      data.gallery?.[1] ?? "",
      data.gallery?.[2] ?? "",
      data.gallery?.[3] ?? "",
    ],
    sort_order: data.sort_order,
    published: data.published,
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">Edit Project</h1>
      <ProjectForm initial={initial} />
    </div>
  );
}
