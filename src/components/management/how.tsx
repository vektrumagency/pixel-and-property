import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";

export function ManagementHow() {
  const t = useTranslations("management.how");
  const steps = t.raw("steps") as { name: string; desc: string }[];

  return (
    <section className="bg-white px-6 py-16 lg:px-24 lg:py-32">
      <Reveal>
        <span className="mb-4 block text-[0.52rem] uppercase tracking-[0.45em] text-gold-dark">
          {t("label")}
        </span>
        <h2 className="mb-12 max-w-2xl font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-light lg:mb-16">
          {t("title")}
        </h2>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-4 lg:gap-12">
        {steps.map((step, i) => (
          <Reveal key={step.name} delay={i * 100}>
            <div className="mb-4 font-serif text-6xl font-light leading-none text-gold/30">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="mb-3 font-serif text-xl font-normal">{step.name}</h3>
            <p className="text-[0.72rem] leading-[1.9] text-black/55">{step.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
