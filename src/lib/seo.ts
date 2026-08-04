import type { Locale } from "@/i18n/routing";

/**
 * Placeholder production domain — update via NEXT_PUBLIC_SITE_URL once the
 * client's real domain is registered and the site is deployed.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.pixelandproperty.pt"
).replace(/\/$/, "");

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Builds `alternates.canonical` + `alternates.languages` for a given
 * locale-less path (e.g. "/digital/villa-moderna").
 */
export function localeAlternates(locale: Locale, path: string) {
  const clean = path === "/" ? "" : path;

  return {
    canonical: absoluteUrl(`/${locale}${clean}`),
    languages: {
      pt: absoluteUrl(`/pt${clean}`),
      en: absoluteUrl(`/en${clean}`),
    },
  };
}

export const OG_LOCALE: Record<Locale, string> = {
  pt: "pt_PT",
  en: "en_US",
};
