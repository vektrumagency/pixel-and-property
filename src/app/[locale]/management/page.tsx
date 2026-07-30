import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ManagementHero } from "@/components/management/hero";
import { ManagementPillars } from "@/components/management/pillars";
import { ManagementServices } from "@/components/management/services";
import { ManagementShowroom } from "@/components/management/showroom";
import { ManagementHow } from "@/components/management/how";
import { ManagementPricing } from "@/components/management/pricing";

export default async function ManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <ManagementHero />
      <ManagementPillars />
      <ManagementServices />
      <ManagementShowroom />
      <ManagementHow />
      <ManagementPricing />
    </>
  );
}
