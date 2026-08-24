import { ProjectForm } from "@/app/admin/(dashboard)/projects/project-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSortOrder = (data?.sort_order ?? 0) + 1;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">New Project</h1>
      <ProjectForm nextSortOrder={nextSortOrder} />
    </div>
  );
}
