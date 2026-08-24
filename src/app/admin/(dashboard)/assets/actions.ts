"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

  const { error } = await supabase.from("page_assets").upsert(
    { page, slot, media_type: mediaType, public_id: publicId },
    { onConflict: "page,slot" }
  );

  if (error) {
    return { error: error.message };
  }

  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}/${page}`, "page");
    revalidatePath(`/${locale}`, "page");
  }

  return {};
}
