import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";

export function InvestmentsPillars() {
  const t = useTranslations("investments");
  const pillars = t.raw("pillars") as { title: string; desc: string }[];

  return (
    <section className="grid gap-10 bg-white px-6 pt-16 pb-0 lg:grid-cols-3 lg:gap-12 lg:px-24 lg:pt-24">
      {pillars.map((pillar, i) => (
        <Reveal key={pillar.title} delay={i * 100}>
          <div className="mb-4 font-serif text-5xl font-light text-gold/30">
            {String(i + 1).padStart(2, "0")}
          </div>
          <h3 className="mb-3 font-serif text-xl font-normal">{pillar.title}</h3>
          <p className="text-[0.78rem] leading-[1.9] text-black/55">{pillar.desc}</p>
        </Reveal>
      ))}
    </section>
  );
}
