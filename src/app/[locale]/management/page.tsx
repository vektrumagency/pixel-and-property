import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getPageAssets } from "@/lib/projects";
import { localeAlternates } from "@/lib/seo";
import { ManagementHero } from "@/components/management/hero";
import { ManagementPillars } from "@/components/management/pillars";
import { ManagementServices } from "@/components/management/services";
import { ManagementShowroom } from "@/components/management/showroom";
import { ManagementHow } from "@/components/management/how";
import { ManagementPricing } from "@/components/management/pricing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "management" });

  const title = t("services.title");
  const description = t("about.text1");

  return {
    title,
    description,
    alternates: localeAlternates(loc, "/management"),
    openGraph: { title, description },
  };
}

export default async function ManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const assets = await getPageAssets("management");

  return (
    <>
      <ManagementHero src={assets.hero_image?.publicId} />
      <ManagementPillars />
      <ManagementServices />
      <ManagementShowroom />
      <ManagementHow />
      <ManagementPricing />
    </>
  );
}
