import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { unsplash } from "@/lib/assets";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";
import { projects } from "@/data/projects";
import type { Locale } from "@/i18n/routing";

export function DigitalPortfolio() {
  const t = useTranslations("digital.portfolio");
  const locale = useLocale() as Locale;

  return (
    <section id="portfolio" className="bg-white px-6 py-16 lg:px-24 lg:py-32">
      <Reveal className="mb-12 flex items-end justify-between lg:mb-16">
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-light">
          {t("title")}
        </h2>
      </Reveal>

      <div className="flex flex-col gap-16 lg:gap-24">
        {projects.map((project) => (
          <Reveal key={project.slug} className="group">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5 lg:aspect-[21/9]">
              <Image
                src={unsplash(project.heroImage)}
                alt={project.name[locale]}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-12">
                <div>
                  <h3 className="font-serif text-2xl font-light text-white lg:text-4xl">
                    {project.name[locale]}
                  </h3>
                  <p className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-gold">
                    {project.location} · {project.services[locale]}
                  </p>
                </div>
                <Link
                  href={`/digital/${project.slug}`}
                  className="inline-block w-fit border border-white/40 px-6 py-3 text-[0.58rem] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:border-gold hover:text-gold-light"
                >
                  {t("caseStudy")}
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
