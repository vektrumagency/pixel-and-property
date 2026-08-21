import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";

const sectors = [
  {
    key: "digital",
    href: "/digital",
    enabled: true,
    image: "/images/covers/digital-card.jpg",
  },
  {
    key: "management",
    href: "/management",
    enabled: true,
    image: "/images/covers/management-card.jpg",
  },
  {
    key: "investments",
    href: "/investments",
    enabled: true,
    image: "/images/covers/investments-card.jpg",
  },
] as const;

type About = { title: string; text1: string; text2: string };

export function SectorsShowcase() {
  const t = useTranslations("home.sectors");
  const tDigitalAbout = useTranslations("digital.about");
  const tManagementAbout = useTranslations("management.about");
  const tInvestmentsVision = useTranslations("investments.vision");

  const aboutByKey: Partial<Record<(typeof sectors)[number]["key"], About>> = {
    digital: {
      title: tDigitalAbout("title"),
      text1: tDigitalAbout("text1"),
      text2: tDigitalAbout("text2"),
    },
    management: {
      title: tManagementAbout("title"),
      text1: tManagementAbout("text1"),
      text2: tManagementAbout("text2"),
    },
    investments: {
      title: tInvestmentsVision("title"),
      text1: tInvestmentsVision("text1"),
      text2: tInvestmentsVision("text2"),
    },
  };

  return (
    <section className="bg-white px-6 pt-16 pb-0 lg:px-24 lg:pt-32">
      <Reveal className="mb-12 flex items-end justify-between lg:mb-16">
        <div>
          <span className="mb-4 block text-[0.52rem] uppercase tracking-[0.45em] text-gold-dark">
            {t("label")}
          </span>
          <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-light">
            {t("title")}
          </h2>
        </div>
      </Reveal>

      <div className="flex flex-col gap-6 lg:gap-24">
        {sectors.map((sector, i) => {
          const name = t(`items.${sector.key}.name`);
          const tags = t(`items.${sector.key}.tags`);
          const cta = t(`items.${sector.key}.cta`);
          const about = aboutByKey[sector.key];

          const card = (
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5 lg:aspect-[21/9]">
              <Image
                src={sector.image}
                alt={name}
                fill
                className={`object-cover transition-transform duration-700 ${
                  sector.enabled ? "group-hover:scale-105" : "grayscale"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-colors duration-500 lg:from-black/70 lg:via-black/10 lg:group-hover:from-black/95 lg:group-hover:via-black/65 lg:group-hover:to-black/15" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-12">
                <div className="lg:max-w-lg">
                  <h3 className="font-serif text-2xl font-light text-white lg:text-4xl">
                    {name}
                  </h3>
                  <p className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-gold">
                    {tags}
                  </p>
                  {about && (
                    <div className="hidden lg:block lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-all lg:duration-500 lg:group-hover:mt-4 lg:group-hover:max-h-80 lg:group-hover:opacity-100">
                      <p className="text-[0.8rem] leading-[1.7] text-white/85">
                        {about.text1}
                      </p>
                      <p className="mt-2 text-[0.8rem] leading-[1.7] text-white/70">
                        {about.text2}
                      </p>
                    </div>
                  )}
                </div>
                <span
                  className={`inline-block w-fit border px-6 py-3 text-[0.58rem] font-medium uppercase tracking-[0.2em] transition-colors ${
                    sector.enabled
                      ? "border-white/40 text-white group-hover:border-gold group-hover:text-gold-light"
                      : "border-white/20 text-white/50"
                  }`}
                >
                  {cta}
                </span>
              </div>
            </div>
          );

          return (
            <Reveal key={sector.key} delay={i * 120}>
              {sector.enabled ? (
                <Link href={sector.href} className="group">
                  {card}
                </Link>
              ) : (
                <div className="group cursor-default">{card}</div>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
