import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { ServicesCatalog } from "@/components/services/catalog";
import { getServices } from "@/lib/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "servicesCatalog" });

  const title = t("title");
  const description = t("subtitle");

  return {
    title,
    description,
    alternates: localeAlternates(loc, "/services"),
    openGraph: { title, description },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("servicesCatalog");
  const services = await getServices();

  return (
    <>
      <div className="h-40 bg-black lg:h-56" />
      <div className="bg-white px-6 pt-16 pb-0 lg:px-24 lg:pt-24">
        <Reveal>
          <span className="mb-4 block text-[0.52rem] uppercase tracking-[0.45em] text-gold-dark">
            {t("eyebrow")}
          </span>
          <h1 className="max-w-2xl font-serif text-[clamp(2rem,5vw,3.2rem)] font-light leading-[1.15]">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-xl text-[0.8rem] leading-[1.9] text-black/50">
            {t("subtitle")}
          </p>
        </Reveal>
      </div>
      <ServicesCatalog items={services} />
    </>
  );
}
