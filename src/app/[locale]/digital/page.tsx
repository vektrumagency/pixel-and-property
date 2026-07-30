import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { DigitalHero } from "@/components/digital/hero";
import { DigitalAbout } from "@/components/digital/about";
import { DigitalStats } from "@/components/digital/stats";
import { DigitalServices } from "@/components/digital/services";
import { DigitalPortfolio } from "@/components/digital/portfolio";
import { DigitalPricing } from "@/components/digital/pricing";
import { DigitalTestimonials } from "@/components/digital/testimonials";
import { DigitalHow } from "@/components/digital/how-it-works";
import { DigitalFaq } from "@/components/digital/faq";

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
      <DigitalTestimonials />
      <DigitalHow />
      <DigitalFaq />
    </>
  );
}
