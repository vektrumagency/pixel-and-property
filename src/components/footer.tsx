import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-gold/20 bg-white px-6 py-16 lg:px-24 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr] lg:gap-8">
        <div>
          <h2 className="mb-8 max-w-md font-serif text-2xl font-light leading-[1.3] lg:text-3xl">
            {t("cta")}
          </h2>
          <Link
            href="/contact"
            className="inline-block border border-gold-dark/50 px-8 py-3.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold-dark"
          >
            {t("ctaButton")}
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/" className="text-sm text-black/70 hover:text-black">
            Home
          </Link>
          <Link href="/digital" className="text-sm text-black/70 hover:text-black">
            {nav("digital")}
          </Link>
          <Link href="/management" className="text-sm text-black/70 hover:text-black">
            {nav("management")}
          </Link>
          <span className="text-sm text-black/25">{nav("investments")}</span>
          <Link href="/contact" className="text-sm text-black/70 hover:text-black">
            {t("connect")}
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-lg font-normal">{t("connect")}</h3>
          <a
            href="mailto:pixelandproperty.contact@gmail.com"
            className="text-sm text-black/70 hover:text-black"
          >
            pixelandproperty.contact@gmail.com
          </a>
          <a href="tel:+351918881199" className="text-sm text-black/70 hover:text-black">
            +351 918 881 199
          </a>
          <span className="text-sm text-black/40">{t("location")}</span>
        </div>
      </div>

      <p className="mt-16 text-[0.6rem] tracking-[0.1em] text-text-muted lg:mt-20">
        {t("copy")}
      </p>
    </footer>
  );
}
