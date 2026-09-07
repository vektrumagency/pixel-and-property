"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { cleanupOrphanedAssets } from "@/lib/cloudinary-server";

export async function saveAsset({
  page,
  slot,
  mediaType,
  publicId,
}: {
  page: string;
  slot: string;
  mediaType: "image" | "video";
  publicId: string;
}): Promise<{ error?: string }> {
  const supabase = await createClient();

  // What occupied this slot before, so we can clean it up if it's replaced or cleared.
  const { data: prev } = await supabase
    .from("page_assets")
    .select("public_id, media_type")
    .eq("page", page)
    .eq("slot", slot)
    .maybeSingle();

  const { error } = await supabase.from("page_assets").upsert(
    { page, slot, media_type: mediaType, public_id: publicId },
    { onConflict: "page,slot" }
  );

  if (error) {
    return { error: error.message };
  }

  if (prev?.public_id && prev.public_id !== publicId) {
    await cleanupOrphanedAssets(supabase, [
      { id: prev.public_id, type: prev.media_type === "video" ? "video" : "image" },
    ]);
  }

  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}/${page}`, "page");
    revalidatePath(`/${locale}`, "page");
  }

  return {};
}
