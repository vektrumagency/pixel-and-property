"use client";

import { useState } from "react";
import { saveAsset } from "./actions";
import { MediaUploader } from "@/components/admin/media-uploader";

export function AssetForm({
  page,
  slot,
  mediaType,
  currentValue,
}: {
  page: string;
  slot: string;
  mediaType: "image" | "video";
  currentValue: string;
}) {
  const [value, setValue] = useState(currentValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await saveAsset({ page, slot, mediaType, publicId: value });
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSave} className="space-y-3">
      <MediaUploader
        value={value}
        onChange={setValue}
        folder={`pixel/pages/${page}/${slot}`}
        mediaType={mediaType}
      />
      {error && <p className="text-[0.72rem] text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={saving || value === currentValue}
        className="rounded bg-black px-4 py-2 text-[0.72rem] font-medium text-white hover:opacity-80 disabled:opacity-50"
      >
        {saved ? "Saved!" : saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
