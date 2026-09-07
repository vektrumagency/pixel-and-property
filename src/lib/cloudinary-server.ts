import { v2 as cloudinary } from "cloudinary";
import { normalizeGallery, type GalleryItem } from "@/lib/projects";
import type { createClient } from "@/lib/supabase/server";

/**
 * Server-only Cloudinary asset cleanup. Deletes an asset from Cloudinary ONLY
 * when no project (hero image or gallery item) and no page_asset still points
 * at it — a reference-checked "safe delete". Never throws: a failed Cloudinary
 * call is logged, never blocks the admin action that triggered it.
 *
 * Call this AFTER the DB mutation has committed, so the row that used to
 * reference the removed asset no longer does when we count references.
 */

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/** True for ids Cloudinary owns; legacy rows store absolute external URLs we must not touch. */
function isCloudinaryOwned(publicId: string): boolean {
  return Boolean(publicId) && !publicId.startsWith("http://") && !publicId.startsWith("https://");
}

function configCloudinary() {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/** Every public_id currently referenced anywhere in the catalogue. */
async function collectInUseAssetIds(supabase: SupabaseServerClient): Promise<Set<string>> {
  const inUse = new Set<string>();

  const { data: projects } = await supabase.from("projects").select("hero_image, gallery");
  for (const row of (projects ?? []) as { hero_image?: string; gallery?: unknown }[]) {
    if (row.hero_image) inUse.add(row.hero_image);
    for (const item of normalizeGallery(row.gallery)) inUse.add(item.id);
  }

  const { data: assets } = await supabase.from("page_assets").select("public_id");
  for (const row of (assets ?? []) as { public_id?: string }[]) {
    if (row.public_id) inUse.add(row.public_id);
  }

  return inUse;
}

/**
 * Destroy each candidate asset that is Cloudinary-owned and no longer
 * referenced by any project or page_asset.
 */
export async function cleanupOrphanedAssets(
  supabase: SupabaseServerClient,
  candidates: GalleryItem[]
): Promise<void> {
  // Keep only Cloudinary-owned, de-duplicated candidates.
  const seen = new Set<string>();
  const owned = candidates.filter((c) => {
    if (!isCloudinaryOwned(c.id) || seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
  if (owned.length === 0) return;

  const inUse = await collectInUseAssetIds(supabase);
  const orphans = owned.filter((c) => !inUse.has(c.id));
  if (orphans.length === 0) return;

  configCloudinary();
  for (const orphan of orphans) {
    try {
      await cloudinary.uploader.destroy(orphan.id, {
        resource_type: orphan.type === "video" ? "video" : "image",
        invalidate: true,
      });
    } catch (err) {
      console.error(`[cloudinary] failed to delete orphaned asset "${orphan.id}":`, err);
    }
  }
}
