import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";

export function DigitalAbout() {
  const t = useTranslations("digital.about");

  return (
    <section className="border-b border-gold/15 bg-white px-6 py-20 lg:px-24 lg:py-28">
      <Reveal className="mx-auto max-w-4xl">
        <span className="mb-6 block text-[0.52rem] uppercase tracking-[0.45em] text-gold-dark">
          {t("label")}
        </span>
        <p className="font-sans text-xl font-normal leading-[1.6] text-black lg:text-2xl">
          {t("text1")}
        </p>
        <p className="mt-6 max-w-2xl text-[0.85rem] leading-[1.9] text-black/55">
          {t("text2")}
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block border border-gold-dark/50 px-8 py-3.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold-dark"
        >
          {t("cta")}
        </Link>
      </Reveal>
    </section>
  );
}
