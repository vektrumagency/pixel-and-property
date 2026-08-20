import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import Image from "next/image";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { cldUrl } from "@/lib/cloudinary";
import { getProjectSlugs, getProjectBySlug } from "@/lib/projects";
import { Reveal } from "@/components/reveal";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs("digital");
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const loc = locale as Locale;
  const t = await getTranslations("digital.portfolio");

  return (
    <>
      <section className="relative flex h-[70vh] min-h-[480px] flex-col justify-end overflow-hidden">
        <Image
          src={cldUrl(project.heroImage, { w: 1600 })}
          alt={project.name[loc]}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/50" />
        <div className="relative z-10 px-6 pb-10 text-white lg:px-24 lg:pb-14">
          <h1 className="mb-6 font-serif text-[clamp(2rem,6vw,4.5rem)] font-light leading-[1.05]">
            {project.name[loc]}
          </h1>
          <div className="flex flex-wrap gap-x-10 gap-y-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/80">
            <span>
              {t("year")}: {project.year}
            </span>
            <span>
              {t("location")}: {project.location}
            </span>
            <span>
              {t("services")}: {project.services[loc]}
            </span>
          </div>
        </div>
      </section>

      <div className="border-b border-gold/15 bg-white px-6 py-6 lg:px-24">
        <Link
          href="/digital"
          className="text-[0.6rem] uppercase tracking-[0.2em] text-black/50 hover:text-gold-dark"
        >
          ← {t("back")}
        </Link>
      </div>

      <section className="border-b border-gold/15 bg-white px-6 py-16 lg:px-24 lg:py-24">
        <Reveal className="mx-auto flex max-w-3xl flex-col gap-5">
          {project.description.map((paragraph, i) => (
            <p key={i} className="text-[0.9rem] leading-[1.9] text-black/70 lg:text-base">
              {paragraph[loc]}
            </p>
          ))}
        </Reveal>
      </section>

      <div className="grid grid-cols-2">
        {project.gallery.slice(0, 2).map((img, i) => (
          <Reveal key={i} delay={i * 100} className="relative aspect-[3/4] lg:aspect-[4/5]">
            <Image src={cldUrl(img, { w: 800 })} alt="" fill className="object-cover" />
          </Reveal>
        ))}
      </div>

      <section className="grid gap-6 bg-white px-6 py-16 lg:grid-cols-[1fr_2.5fr] lg:px-24 lg:py-24">
        <Reveal>
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-gold-dark">
            {t("strategyLabel")}
          </span>
        </Reveal>
        <Reveal delay={100}>
          <p className="max-w-2xl text-[0.9rem] leading-[1.9] text-black/70 lg:text-base">
            {project.strategy[loc]}
          </p>
        </Reveal>
      </section>

      <div className="grid grid-cols-2">
        {project.gallery.slice(2, 4).map((img, i) => (
          <Reveal key={i} delay={i * 100} className="relative aspect-[3/4] lg:aspect-[4/5]">
            <Image src={cldUrl(img, { w: 800 })} alt="" fill className="object-cover" />
          </Reveal>
        ))}
      </div>

      <section className="grid gap-6 bg-white px-6 py-16 lg:grid-cols-[1fr_2.5fr] lg:px-24 lg:py-24">
        <Reveal>
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-gold-dark">
            {t("whatWeDidLabel")}
          </span>
        </Reveal>
        <Reveal delay={100}>
          <p className="max-w-2xl text-[0.9rem] leading-[1.9] text-black/70 lg:text-base">
            {project.whatWeDid[loc]}
          </p>
        </Reveal>
      </section>

      <section className="bg-white px-6 py-16 lg:px-24 lg:py-24">
        <Reveal className="border-b border-gold/20 pb-4">
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-gold-dark">
            {t("resultsLabel")}
          </span>
        </Reveal>
        <div>
          {project.results.map((result, i) => (
            <Reveal
              key={i}
              delay={i * 100}
              className="grid gap-4 border-b border-gold/10 py-8 lg:grid-cols-[1fr_2.5fr] lg:items-center lg:gap-6"
            >
              <div className="font-serif text-5xl font-light text-black lg:text-6xl">
                {result.value}
              </div>
              <p className="max-w-xl text-[0.85rem] leading-[1.8] text-black/60">
                {result.label[loc]}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 pb-24 text-center lg:px-24">
        <Link
          href="/contact"
          className="inline-block border border-gold-dark/50 px-8 py-3.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold-dark"
        >
          {t("projectCta")}
        </Link>
      </section>
    </>
  );
}
