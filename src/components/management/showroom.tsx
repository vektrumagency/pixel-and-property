import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { unsplash } from "@/lib/assets";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";
import { HorizontalScrollGallery } from "@/components/horizontal-scroll-gallery";
import { managedProperties } from "@/data/managed-properties";
import type { Locale } from "@/i18n/routing";

export function ManagementShowroom() {
  const t = useTranslations("management.showroom");
  const locale = useLocale() as Locale;

  return (
    <section className="bg-white px-6 pt-16 pb-0 lg:px-24 lg:pt-32">
      <Reveal className="mb-12 lg:mb-16">
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-light">
          {t("title")}
        </h2>
        <p className="mt-4 text-[0.78rem] text-black/50">{t("subtitle")}</p>
      </Reveal>

      <HorizontalScrollGallery
        slides={managedProperties.map((property) => (
          <Link
            key={property.slug}
            href={`/management/${property.slug}`}
            className="group block"
          >
            <div className="relative h-[90vh] w-full overflow-hidden bg-black/5 lg:h-auto lg:aspect-[21/9]">
              <Image
                src={unsplash(property.heroImage)}
                alt={property.name[locale]}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent lg:h-40" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-12">
                <div>
                  <h3 className="font-serif text-2xl font-light text-white lg:text-4xl">
                    {property.name[locale]}
                  </h3>
                  <p className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-gold">
                    {property.location} ·{" "}
                    {property.tags.map((tag) => tag[locale]).join(" · ")}
                  </p>
                </div>
                <span className="inline-block w-fit border border-white/40 px-6 py-3 text-[0.58rem] font-medium uppercase tracking-[0.2em] text-white transition-colors group-hover:border-gold group-hover:text-gold-light">
                  {t("viewDetails")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      />
    </section>
  );
}
