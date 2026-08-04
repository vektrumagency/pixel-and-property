import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { DigitalHero } from "@/components/digital/hero";
import { DigitalAbout } from "@/components/digital/about";
import { DigitalStats } from "@/components/digital/stats";
import { DigitalServices } from "@/components/digital/services";
import { DigitalPortfolio } from "@/components/digital/portfolio";
import { DigitalPricing } from "@/components/digital/pricing";
import { DigitalHow } from "@/components/digital/how-it-works";
import { DigitalFaq } from "@/components/digital/faq";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "digital" });

  const title = t("services.title");
  const description = t("about.text1");

  return {
    title,
    description,
    alternates: localeAlternates(loc, "/digital"),
    openGraph: { title, description },
  };
}

export default async function DigitalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <DigitalHero />
      <DigitalAbout />
      <DigitalStats />
      <DigitalServices />
      <DigitalPortfolio />
      <DigitalPricing />
      <DigitalHow />
      <DigitalFaq />
    </>
  );
}
