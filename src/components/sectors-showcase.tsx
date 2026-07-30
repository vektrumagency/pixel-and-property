import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { unsplash, PLACEHOLDER_IMAGES } from "@/lib/assets";
import { Reveal } from "@/components/reveal";

const sectors = [
  {
    key: "digital",
    href: "/digital",
    enabled: true,
    image: unsplash(PLACEHOLDER_IMAGES.portfolio[0]),
  },
  {
    key: "management",
    href: "/management",
    enabled: true,
    image: unsplash(PLACEHOLDER_IMAGES.about),
  },
  {
    key: "investments",
    href: "/investments",
    enabled: false,
    image: unsplash(PLACEHOLDER_IMAGES.portfolio[7]),
  },
] as const;

export function SectorsShowcase() {
  const t = useTranslations("home.sectors");

  return (
    <section className="bg-white px-6 py-16 lg:px-24 lg:py-32">
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

      <div className="flex flex-col gap-16 lg:gap-24">
        {sectors.map((sector, i) => {
          const name = t(`items.${sector.key}.name`);
          const tags = t(`items.${sector.key}.tags`);
          const cta = t(`items.${sector.key}.cta`);

          const card = (
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5 lg:aspect-[21/9]">
              <Image
                src={sector.image}
                alt={name}
                fill
                className={`object-cover transition-transform duration-700 ${
                  sector.enabled ? "group-hover:scale-105" : "grayscale"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-12">
                <div>
                  <h3 className="font-serif text-2xl font-light text-white lg:text-4xl">
                    {name}
                  </h3>
                  <p className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-gold">
                    {tags}
                  </p>
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
