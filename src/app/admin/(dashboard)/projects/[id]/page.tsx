import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeGallery, getServices } from "@/lib/projects";
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

  const serviceCatalog = await getServices();

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
    description: data.description,
    hero_image: data.hero_image,
    gallery: normalizeGallery(data.gallery),
    sort_order: data.sort_order,
    published: data.published,
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">Edit Project</h1>
      <ProjectForm initial={initial} serviceCatalog={serviceCatalog} />
    </div>
  );
}
