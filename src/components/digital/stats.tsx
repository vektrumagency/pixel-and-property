import { useTranslations } from "next-intl";
import { CountUp } from "@/components/count-up";
import { Reveal } from "@/components/reveal";

export function DigitalStats() {
  const t = useTranslations("digital.stats");

  const stats = [
    { target: 6, suffix: "", label: t("team") },
    { target: 182, suffix: "+", label: t("projects") },
    { target: 270, suffix: "k+", label: t("views") },
    { target: 1, suffix: "B+", label: t("value") },
    { target: 8, suffix: "+", label: t("years") },
    { target: 48, suffix: "h", label: t("delivery") },
  ];

  return (
    <section className="bg-white px-6 py-16 lg:px-24 lg:py-32">
      <Reveal>
        <span className="mb-4 block text-[0.52rem] uppercase tracking-[0.45em] text-gold-dark">
          {t("label")}
        </span>
        <h2 className="mb-12 font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-light lg:mb-16">
          {t("title")}
        </h2>
      </Reveal>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
        {stats.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 80}
            className="bg-black/[0.03] px-6 py-8 lg:px-8 lg:py-10"
          >
            <div className="mb-3 font-sans text-4xl font-light text-black lg:text-5xl">
              <CountUp target={stat.target} suffix={stat.suffix} />
            </div>
            <div className="text-[0.72rem] text-black/55 lg:text-[0.8rem]">
              {stat.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
