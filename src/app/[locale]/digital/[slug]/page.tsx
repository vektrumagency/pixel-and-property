import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import Image from "next/image";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { unsplash } from "@/lib/assets";
import { projects, getProject } from "@/data/projects";
import { Reveal } from "@/components/reveal";
import { MediaCarousel } from "@/components/media-carousel";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const project = getProject(slug);
  if (!project) notFound();

  const loc = locale as Locale;
  const t = await getTranslations("digital.portfolio");

  return (
    <>
      <section className="relative flex h-[70vh] min-h-[480px] flex-col justify-end overflow-hidden">
        <Image
          src={unsplash(project.heroImage)}
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

      <section className="border-b border-gold/15 bg-white px-6 pt-16 pb-16 lg:px-24 lg:pt-24 lg:pb-24">
        <Reveal className="mx-auto flex max-w-3xl flex-col gap-5">
          {project.description.map((paragraph, i) => (
            <p key={i} className="text-[0.9rem] leading-[1.9] text-black/70 lg:text-base">
              {paragraph[loc]}
            </p>
          ))}
        </Reveal>
      </section>

      <div className="mb-16 lg:mb-32">
        <MediaCarousel images={project.gallery} alt={project.name[loc]} />
      </div>
    </>
  );
}
