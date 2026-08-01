import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import Image from "next/image";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { unsplash } from "@/lib/assets";
import { managedProperties, getManagedProperty } from "@/data/managed-properties";
import { Reveal } from "@/components/reveal";

export function generateStaticParams() {
  return managedProperties.map((property) => ({ slug: property.slug }));
}

export default async function ManagedPropertyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const property = getManagedProperty(slug);
  if (!property) notFound();

  const loc = locale as Locale;
  const t = await getTranslations("management.showroom");

  return (
    <>
      <section className="relative flex h-[70vh] min-h-[480px] flex-col justify-end overflow-hidden">
        <Image
          src={unsplash(property.heroImage)}
          alt={property.name[loc]}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/50" />
        <div className="relative z-10 px-6 pb-10 text-white lg:px-24 lg:pb-14">
          <h1 className="mb-4 font-serif text-[clamp(2rem,6vw,4.5rem)] font-light leading-[1.05]">
            {property.name[loc]}
          </h1>
          <div className="flex flex-wrap gap-x-10 gap-y-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/80">
            <span>{property.location}</span>
            <span>{property.tags.map((tag) => tag[loc]).join(" · ")}</span>
          </div>
        </div>
      </section>

      <div className="border-b border-gold/15 bg-white px-6 py-6 lg:px-24">
        <Link
          href="/management"
          className="text-[0.6rem] uppercase tracking-[0.2em] text-black/50 hover:text-gold-dark"
        >
          ← {t("back")}
        </Link>
      </div>

      <section className="border-b border-gold/15 bg-white px-6 py-16 lg:px-24 lg:py-24">
        <Reveal className="mx-auto flex max-w-3xl flex-col gap-5">
          {property.description.map((paragraph, i) => (
            <p key={i} className="text-[0.9rem] leading-[1.9] text-black/70 lg:text-base">
              {paragraph[loc]}
            </p>
          ))}
        </Reveal>
      </section>

      <div className="grid grid-cols-2">
        {property.gallery.map((img, i) => (
          <Reveal key={i} delay={i * 80} className="relative aspect-square lg:aspect-[4/3]">
            <Image src={unsplash(img)} alt="" fill className="object-cover" />
          </Reveal>
        ))}
      </div>

      <section className="grid gap-6 bg-white px-6 py-16 lg:grid-cols-[1fr_2.5fr] lg:px-24 lg:py-24">
        <Reveal>
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-gold-dark">
            {t("amenitiesLabel")}
          </span>
        </Reveal>
        <Reveal delay={100}>
          <ul className="max-w-2xl">
            {property.amenities.map((amenity) => (
              <li
                key={amenity[loc]}
                className="flex items-center gap-2 border-b border-black/[0.07] py-3 text-[0.85rem] text-black/70"
              >
                <span className="shrink-0 text-gold-dark">—</span>
                {amenity[loc]}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="bg-white px-6 pb-24 text-center lg:px-24">
        <Link
          href="/contact"
          className="inline-block border border-gold-dark/50 px-8 py-3.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold-dark"
        >
          {t("propertyCta")}
        </Link>
      </section>
    </>
  );
}
