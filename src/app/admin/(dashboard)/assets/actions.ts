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
}) {
  const supabase = await createClient();

  await supabase.from("page_assets").upsert(
    { page, slot, media_type: mediaType, public_id: publicId },
    { onConflict: "page,slot" }
  );

  for (const locale of ["pt", "en"]) {
    revalidatePath(`/${locale}/${page}`, "page");
    revalidatePath(`/${locale}`, "page");
  }
}
