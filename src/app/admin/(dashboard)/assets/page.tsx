import { createClient } from "@/lib/supabase/server";
import { AssetForm } from "./asset-form";

const SLOTS = [
  { page: "home", slot: "hero_video", label: "Home Hero Video", mediaType: "video" as const },
  { page: "home", slot: "hero_poster", label: "Home Hero Poster Image", mediaType: "image" as const },
  { page: "digital", slot: "hero_image", label: "Digital Hero Image", mediaType: "image" as const },
  { page: "management", slot: "hero_image", label: "Management Hero Image", mediaType: "image" as const },
];

export default async function AdminAssetsPage() {
  const supabase = await createClient();
  const { data: assets } = await supabase.from("page_assets").select("*");

  const assetMap: Record<string, string> = {};
  for (const a of assets ?? []) {
    assetMap[`${a.page}:${a.slot}`] = a.public_id;
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">Page Assets</h1>
      <div className="space-y-4">
        {SLOTS.map((slot) => (
          <div key={`${slot.page}:${slot.slot}`} className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-[0.78rem] font-semibold text-neutral-700">{slot.label}</h2>
            <AssetForm
              page={slot.page}
              slot={slot.slot}
              mediaType={slot.mediaType}
              currentValue={assetMap[`${slot.page}:${slot.slot}`] ?? ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
