import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getPageAssets, getAllPageAssets, getTestimonials } from "@/lib/projects";
import { cldUrl, cldVideoUrl, cldVideoThumb } from "@/lib/cloudinary";
import { DigitalClients } from "@/components/digital/clients";
import { SectorsShowcase } from "@/components/sectors-showcase";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { Reveal } from "@/components/reveal";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "home" });

  const title = `Pixel & Property — ${t("headline")}`;
  const description = t("aboutText");

  return {
    title,
    description,
    alternates: localeAlternates(loc, "/"),
    openGraph: { title, description },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const [assets, allAssets, testimonials] = await Promise.all([
    getPageAssets("home"),
    getAllPageAssets(),
    getTestimonials(),
  ]);
  const sectorHeroImages = {
    digital: allAssets.digital?.hero_image?.publicId,
    management: allAssets.management?.hero_image?.publicId,
    investments: allAssets.investments?.hero_image?.publicId,
  };

  // Every cld* helper passes absolute URLs through untouched, so the stock
  // fallbacks below still work while uploaded assets get a real Cloudinary URL.
  const STOCK_VIDEO =
    "https://videos.pexels.com/video-files/4407791/4407791-uhd_2732_1440_25fps.mp4";
  const STOCK_POSTER =
    "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1600&q=80&auto=format&fit=crop";

  const heroVideoId = assets.hero_video?.publicId ?? STOCK_VIDEO;
  const heroVideo = cldVideoUrl(heroVideoId);

  // The poster stands in until the first frame decodes, and stays for good when
  // autoplay is refused (iOS Low Power Mode, data saver). Taking it from the
  // video's own first frame keeps the two in step and needs no second upload.
  // Only a Cloudinary id can be transformed into a still, so the stock video —
  // an absolute URL — keeps the stock poster instead.
  const uploadedPoster = assets.hero_poster?.publicId;
  const heroPoster = uploadedPoster
    ? cldUrl(uploadedPoster, { w: 1600 })
    : heroVideoId === STOCK_VIDEO
      ? STOCK_POSTER
      : cldVideoThumb(heroVideoId, { w: 1600 });

  return (
    <>
      <section className="relative flex h-[100svh] min-h-[600px] flex-col justify-end overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroPoster}
          className="absolute inset-0 h-full w-full object-cover object-[center_60%]"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <Reveal className="relative z-10 px-6 pb-16 text-white lg:px-24 lg:pb-24">
          <div className="mb-5 flex items-center gap-4">
            <span className="whitespace-nowrap text-[0.6rem] font-medium uppercase tracking-[0.3em] text-white/90">
              {t("eyebrow")}
            </span>
            <span className="h-px w-16 bg-white/40" />
          </div>
          <h1 className="max-w-3xl font-serif text-[clamp(2.2rem,7vw,5rem)] font-light leading-[1.05]">
            {t("headline")}
          </h1>
        </Reveal>
      </section>

      <DigitalClients />

      <section className="grid gap-10 bg-white px-6 pt-16 pb-0 lg:grid-cols-2 lg:items-stretch lg:gap-16 lg:px-24 lg:pt-32">
        <Reveal className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[480px]">
          <Image
            src="/images/covers/digital-hero.jpg"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 border border-gold/20" />
        </Reveal>

        <div className="flex flex-col justify-center">
          <Reveal delay={100}>
            <span className="mb-4 block text-[0.52rem] uppercase tracking-[0.45em] text-gold-dark">
              {t("aboutLabel")}
            </span>
            <h2 className="mb-6 font-serif text-[clamp(1.8rem,6vw,3.2rem)] font-light leading-[1.18]">
              {t("aboutTitleLine1")}
              <br />
              <em className="text-gold-dark">{t("aboutTitleEm")}</em>
              <br />
              {t("aboutTitleLine2")}
            </h2>
            <p className="text-[0.78rem] leading-[2.1] text-black/60">
              {t("aboutText")}
            </p>
          </Reveal>

          <Reveal
            delay={200}
            className="mt-10 grid grid-cols-2 gap-8 border-t border-gold/15 pt-8 lg:mt-12 lg:grid-cols-4 lg:pt-10"
          >
            <Stat value="8+" label={t("statYears")} />
            <Stat value="3" label={t("statSectors")} />
            <Stat value="PT" label={t("statPT")} />
            <Stat value="EN" label={t("statEN")} />
          </Reveal>
        </div>
      </section>

      <SectorsShowcase heroImages={sectorHeroImages} />

      <TestimonialsCarousel testimonials={testimonials} />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="mb-1.5 font-serif text-[2.8rem] font-light leading-none text-gold-dark lg:text-[3.8rem]">
        {value}
      </div>
      <div className="text-[0.52rem] uppercase leading-relaxed tracking-[0.15em] text-text-muted lg:text-[0.57rem]">
        {label}
      </div>
    </div>
  );
}
