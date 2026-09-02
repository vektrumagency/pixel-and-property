"use client";

import { useState } from "react";
import Image from "next/image";
import { cldUrl } from "@/lib/cloudinary";
import { MediaCarousel } from "@/components/media-carousel";
import type { ProjectFormData } from "@/app/admin/(dashboard)/projects/actions";

/**
 * Mirrors the public /[locale]/digital|management/[slug] page layout, but
 * reads straight from the in-memory form state so the operator can check the
 * result before saving (or publishing) anything.
 */
export function ProjectPreview({
  data,
  onClose,
}: {
  data: ProjectFormData;
  onClose: () => void;
}) {
  const [locale, setLocale] = useState<"pt" | "en">("pt");

  const name = locale === "pt" ? data.name_pt : data.name_en;
  const services = locale === "pt" ? data.services_pt : data.services_en;
  const description = data.description.map((p) => p[locale]).filter(Boolean);
  const gallery = data.gallery.filter((item) => item.id);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 py-8"
      onClick={onClose}
    >
      <div
        className="mx-auto max-w-4xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-3">
          <div className="flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.15em] text-neutral-500">
            Preview
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[0.6rem] normal-case tracking-normal text-neutral-500">
              unsaved changes, live site not affected
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex overflow-hidden rounded border border-neutral-300 text-[0.65rem] font-medium">
              <button
                type="button"
                onClick={() => setLocale("pt")}
                className={`px-2.5 py-1 ${locale === "pt" ? "bg-black text-white" : "text-neutral-600 hover:bg-neutral-50"}`}
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`px-2.5 py-1 ${locale === "en" ? "bg-black text-white" : "text-neutral-600 hover:bg-neutral-50"}`}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[0.72rem] text-neutral-500 hover:text-black"
            >
              Close ✕
            </button>
          </div>
        </div>

        <section className="relative flex h-[50vh] min-h-[320px] flex-col justify-end overflow-hidden bg-neutral-200">
          {data.hero_image ? (
            <Image
              src={cldUrl(data.hero_image, { w: 1600 })}
              alt={name || "Project"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[0.72rem] text-neutral-400">
              No hero image uploaded yet
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/50" />
          <div className="relative z-10 px-6 pb-8 text-white lg:px-16">
            <h1 className="mb-4 font-serif text-[clamp(1.6rem,5vw,3.2rem)] font-light leading-[1.05]">
              {name || "Untitled project"}
            </h1>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/80">
              {data.category === "digital" && <span>Year: {data.year || "—"}</span>}
              <span>Location: {data.location || "—"}</span>
              <span>Services: {services || "—"}</span>
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-white px-6 py-10 lg:px-16">
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {description.length > 0 ? (
              description.map((paragraph, i) => (
                <p key={i} className="text-[0.85rem] leading-[1.8] text-black/70">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-[0.8rem] text-neutral-400">No description yet.</p>
            )}
          </div>
        </section>

        {gallery.length > 0 && (
          <div className="pb-10">
            <MediaCarousel items={gallery} alt={name || "Project"} />
          </div>
        )}
      </div>
    </div>
  );
}
