import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";

export function InvestmentsVision() {
  const t = useTranslations("investments.vision");

  return (
    <section className="border-b border-gold/15 bg-white px-6 pt-16 pb-10 lg:px-24 lg:pt-24">
      <Reveal className="mx-auto max-w-4xl">
        <span className="mb-6 block text-[0.52rem] uppercase tracking-[0.45em] text-gold-dark">
          {t("label")}
        </span>
        <h2 className="mb-6 font-serif text-[clamp(1.8rem,4vw,2.6rem)] font-light leading-[1.3]">
          {t("title")}
        </h2>
        <p className="text-[0.9rem] leading-[1.9] text-black/70 lg:text-base">
          {t("text1")}
        </p>
        <p className="mt-5 max-w-2xl text-[0.85rem] leading-[1.9] text-black/55">
          {t("text2")}
        </p>
      </Reveal>
    </section>
  );
}
