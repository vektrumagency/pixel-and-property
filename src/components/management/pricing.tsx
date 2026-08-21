import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";

type Tier = {
  name: string;
  tagline: string;
  popular?: boolean;
  features: string[];
};

export function ManagementPricing() {
  const t = useTranslations("management.pricing");
  const tiers = t.raw("tiers") as Tier[];

  return (
    <section className="bg-white px-6 pt-16 pb-16 lg:px-24 lg:pt-32 lg:pb-32">
      <Reveal>
        <span className="mb-4 block text-[0.52rem] uppercase tracking-[0.45em] text-gold-dark">
          {t("label")}
        </span>
        <h2
          className="mb-12 max-w-2xl font-serif text-[clamp(1.6rem,3.5vw,2.4rem)] font-light leading-[1.3] lg:mb-16"
          dangerouslySetInnerHTML={{ __html: t.raw("title") }}
        />
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-0.5">
        {tiers.map((tier, i) => (
          <Reveal
            key={tier.name}
            delay={i * 100}
            className={`relative flex flex-col border px-6 py-10 transition-colors lg:px-8 ${
              tier.popular
                ? "border-gold/50 bg-gold/[0.06]"
                : "border-gold/20 hover:border-gold/40"
            }`}
          >
            {tier.popular && (
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-gold px-4 py-1 text-[0.48rem] font-semibold uppercase tracking-[0.2em] text-black">
                Mais Popular
              </span>
            )}
            <p className="mb-3 font-serif text-xl font-normal">{tier.name}</p>
            <p className="mb-8 text-[0.75rem] leading-[1.6] text-black/55">{tier.tagline}</p>
            <ul className="mb-8 space-y-0">
              {tier.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 border-b border-black/[0.07] py-2.5 text-[0.7rem] text-black/65"
                >
                  <span className="shrink-0 text-gold-dark">—</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="mt-auto block w-full border border-gold-dark/40 py-3.5 text-center text-[0.58rem] font-medium uppercase tracking-[0.22em] transition-colors hover:bg-gold hover:border-gold hover:text-black"
            >
              {t("book")}
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal className="mx-auto mt-8 max-w-2xl text-center text-[0.64rem] leading-[1.9] text-black/40 lg:mt-12">
        {t("note")}
      </Reveal>
    </section>
  );
}
