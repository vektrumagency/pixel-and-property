import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { InvestmentsHero } from "@/components/investments/hero";
import { InvestmentsVision } from "@/components/investments/vision";
import { InvestmentsPillars } from "@/components/investments/pillars";
import { InvestmentsPartner } from "@/components/investments/partner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "investments" });

  const title = t("vision.title");
  const description = t("vision.text1");

  return {
    title,
    description,
    alternates: localeAlternates(loc, "/investments"),
    openGraph: { title, description },
  };
}

export default async function InvestmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <InvestmentsHero />
      <InvestmentsVision />
      <InvestmentsPillars />
      <InvestmentsPartner />
    </>
  );
}
