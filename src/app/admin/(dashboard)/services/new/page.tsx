import { ServiceForm } from "@/app/admin/(dashboard)/services/service-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewServicePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSortOrder = (data?.sort_order ?? 0) + 1;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">New Service</h1>
      <ServiceForm nextSortOrder={nextSortOrder} />
    </div>
  );
}
