import { PackageForm } from "@/app/admin/(dashboard)/packages/package-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewPackagePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("packages")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSortOrder = (data?.sort_order ?? 0) + 1;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">New Package</h1>
      <PackageForm nextSortOrder={nextSortOrder} />
    </div>
  );
}
