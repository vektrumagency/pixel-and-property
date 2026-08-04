import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SITE_URL, absoluteUrl, localeAlternates, OG_LOCALE } from "@/lib/seo";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800"],
  style: ["normal", "italic"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const loc = locale as Locale;

  const t = await getTranslations({ locale, namespace: "home" });
  const description = t("aboutText");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Pixel & Property",
      template: "%s · Pixel & Property",
    },
    description,
    alternates: localeAlternates(loc, "/"),
    openGraph: {
      siteName: "Pixel & Property",
      type: "website",
      locale: OG_LOCALE[loc],
      url: absoluteUrl(`/${loc}`),
      title: "Pixel & Property",
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: "Pixel & Property",
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Pixel & Property",
    url: SITE_URL,
    description:
      locale === "pt"
        ? "Grupo imobiliário com base em Estoril, Portugal — media, gestão de propriedades e investimento."
        : "Real estate group based in Estoril, Portugal — media, property management and investment.",
    areaServed: "PT",
  };

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${montserrat.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white font-sans font-light text-black">
        <NextIntlClientProvider>
          <SmoothScroll>
            <Nav />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
