import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { cldUrl } from "@/lib/cloudinary";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";
import { HorizontalScrollGallery } from "@/components/horizontal-scroll-gallery";
import type { Project } from "@/lib/projects";
import type { Locale } from "@/i18n/routing";

export function DigitalPortfolio({ projects }: { projects: Project[] }) {
  const t = useTranslations("digital.portfolio");
  const locale = useLocale() as Locale;

  return (
    <section id="portfolio" className="bg-white px-6 pt-16 pb-0 lg:px-24 lg:pt-32">
      <Reveal className="mb-6 lg:mb-8">
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-light">
          {t("title")}
        </h2>
      </Reveal>

      <HorizontalScrollGallery
        slides={projects.map((project) => (
          <Link
            key={project.slug}
            href={`/digital/${project.slug}`}
            className="group block"
          >
            <div className="relative h-[90vh] w-full overflow-hidden bg-black/5 lg:h-auto lg:aspect-[21/9]">
              <Image
                src={cldUrl(project.heroImage, { w: 1400 })}
                alt={project.name[locale]}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent lg:h-40" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-12">
                <div>
                  <h3 className="font-serif text-2xl font-light text-white lg:text-4xl">
                    {project.name[locale]}
                  </h3>
                  <p className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-gold">
                    {project.location} · {project.services[locale]}
                  </p>
                </div>
                <span className="inline-block w-fit border border-white/40 px-6 py-3 text-[0.58rem] font-medium uppercase tracking-[0.2em] text-white transition-colors group-hover:border-gold group-hover:text-gold-light">
                  {t("caseStudy")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      />
    </section>
  );
}
