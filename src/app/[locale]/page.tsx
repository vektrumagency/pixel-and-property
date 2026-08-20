import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getPageAssets } from "@/lib/projects";
import { DigitalClients } from "@/components/digital/clients";
import { SectorsShowcase } from "@/components/sectors-showcase";
import { Reveal } from "@/components/reveal";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const assets = await getPageAssets("home");

  const heroVideo = assets.hero_video?.publicId ?? "https://videos.pexels.com/video-files/4407791/4407791-uhd_2732_1440_25fps.mp4";
  const heroPoster = assets.hero_poster?.publicId ?? "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1600&q=80&auto=format&fit=crop";

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

      <section className="grid gap-12 bg-white px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-32 lg:px-24 lg:py-44">
        <Reveal>
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
        <Reveal delay={150} className="grid grid-cols-2 gap-8">
          <Stat value="8+" label={t("statYears")} />
          <Stat value="3" label={t("statSectors")} />
          <Stat value="PT" label={t("statPT")} />
          <Stat value="EN" label={t("statEN")} />
        </Reveal>
      </section>

      <SectorsShowcase />

      <DigitalClients />
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
