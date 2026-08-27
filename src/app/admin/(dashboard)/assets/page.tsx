import { createClient } from "@/lib/supabase/server";
import { AssetForm } from "./asset-form";

const SLOTS = [
  { page: "home", slot: "hero_video", label: "Home Hero Video", mediaType: "video" as const },
  { page: "home", slot: "hero_poster", label: "Home Hero Poster Image (opcional — aparece antes do vídeo; se vazio, usa o 1.º fotograma)", mediaType: "image" as const },
  { page: "digital", slot: "hero_image", label: "Digital Hero Image", mediaType: "image" as const },
  { page: "management", slot: "hero_image", label: "Management Hero Image", mediaType: "image" as const },
  { page: "investments", slot: "hero_image", label: "Investments Hero Image", mediaType: "image" as const },
];

export default async function AdminAssetsPage() {
  const supabase = await createClient();
  const { data: assets, error } = await supabase.from("page_assets").select("*");

  const assetMap: Record<string, string> = {};
  for (const a of assets ?? []) {
    assetMap[`${a.page}:${a.slot}`] = a.public_id;
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black">Page Assets</h1>
      {error && (
        <p className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-[0.78rem] text-red-700">
          Failed to load page assets: {error.message}
        </p>
      )}
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
