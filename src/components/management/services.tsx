import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";

export function ManagementServices() {
  const t = useTranslations("management.services");
  const items = t.raw("items") as { name: string; desc: string }[];

  return (
    <section id="services" className="bg-white px-6 py-16 lg:px-24 lg:py-32">
      <Reveal className="mb-12 lg:mb-16">
        <h2 className="max-w-2xl font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-light">
          {t("title")}
        </h2>
      </Reveal>

      <div className="grid gap-x-12 gap-y-12 lg:grid-cols-3 lg:gap-y-16">
        {items.map((item, i) => (
          <Reveal key={item.name} delay={(i % 3) * 100} className="relative">
            <span className="mb-4 block h-px w-8 bg-gold-dark/60" />
            <h3 className="mb-3 font-serif text-xl font-normal">{item.name}</h3>
            <p className="text-[0.75rem] leading-[1.9] text-black/50">{item.desc}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12 text-center lg:mt-16">
        <Link
          href="/contact"
          className="inline-block border border-gold-dark/50 px-8 py-3.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold-dark"
        >
          {t("cta")}
        </Link>
      </Reveal>
    </section>
  );
}
