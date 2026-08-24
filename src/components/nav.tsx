"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { socials } from "@/components/social-links";

const sectors = [
  { key: "digital", href: "/digital", enabled: true },
  { key: "management", href: "/management", enabled: true },
  { key: "investments", href: "/investments", enabled: true },
] as const;

export function Nav() {
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function switchLocale(next: "pt" | "en") {
    router.replace(pathname, { locale: next });
  }

  return (
    <nav className="absolute inset-x-0 top-0 z-50 flex items-center justify-between bg-transparent px-6 py-6 lg:px-20 lg:py-7">
      <Link
        href="/"
        className={`relative z-50 font-serif text-base uppercase tracking-[0.2em] transition-colors ${open ? "text-black" : "text-white"}`}
        onClick={() => setOpen(false)}
      >
        Pixel <span className="text-gold">&</span> Property
      </Link>

      <ul className="absolute left-1/2 hidden -translate-x-1/2 gap-14 lg:flex">
        {sectors.map((sector) => (
          <li key={sector.key}>
            {sector.enabled ? (
              <Link
                href={sector.href}
                className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                  pathname === sector.href
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {t(sector.key)}
              </Link>
            ) : (
              <span className="pointer-events-none text-xs font-medium uppercase tracking-[0.2em] text-white/25">
                {t(sector.key)}
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-6">
        <Link
          href="/contact"
          className={`hidden text-xs font-medium uppercase tracking-[0.2em] transition-colors lg:block ${
            pathname === "/contact" ? "text-white" : "text-white/60 hover:text-white"
          }`}
        >
          {t("contact")}
        </Link>

        <div className="hidden text-xs tracking-[0.1em] text-white/70 lg:block">
          <button
            className={locale === "pt" ? "text-gold" : ""}
            onClick={() => switchLocale("pt")}
          >
            PT
          </button>
          &nbsp;|&nbsp;
          <button
            className={locale === "en" ? "text-gold" : ""}
            onClick={() => switchLocale("en")}
          >
            EN
          </button>
        </div>

        <button
          aria-label="Menu"
          className={`relative z-50 flex flex-col items-center justify-center gap-1.5 rounded-full p-3 transition-colors lg:hidden ${open ? "bg-black/5" : ""}`}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-[1.5px] w-[20px] transition-transform ${open ? "translate-y-[6px] rotate-45 bg-black" : "bg-white"}`}
          />
          <span
            className={`block h-[1.5px] w-[20px] transition-opacity ${open ? "opacity-0" : "bg-white"}`}
          />
          <span
            className={`block h-[1.5px] w-[20px] transition-transform ${open ? "-translate-y-[6px] -rotate-45 bg-black" : "bg-white"}`}
          />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 flex flex-col overflow-y-auto bg-white px-6 pb-10 pt-28 transition-transform duration-400 lg:hidden ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-1 flex-col justify-center gap-1">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-serif text-4xl font-light tracking-wide text-black/70 transition-colors hover:text-gold-dark"
          >
            {t("home")}
          </Link>
          {sectors.map((sector) =>
            sector.enabled ? (
              <Link
                key={sector.key}
                href={sector.href}
                onClick={() => setOpen(false)}
                className="font-serif text-4xl font-light tracking-wide text-black/70 transition-colors hover:text-gold-dark"
              >
                {t(sector.key)}
              </Link>
            ) : (
              <span
                key={sector.key}
                className="font-serif text-4xl font-light tracking-wide text-black/25"
              >
                {t(sector.key)}
              </span>
            ),
          )}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="font-serif text-4xl font-light tracking-wide text-black/70 transition-colors hover:text-gold-dark"
          >
            {t("contact")}
          </Link>
        </div>

        <div className="flex flex-col gap-6 border-t border-black/10 pt-8">
          <div>
            <h3 className="mb-3 text-[0.6rem] uppercase tracking-[0.3em] text-gold-dark">
              {tFooter("connect")}
            </h3>
            <a
              href="mailto:geral@pixelandproperty.com"
              className="block text-sm text-black/70 hover:text-black"
            >
              geral@pixelandproperty.com
            </a>
            <a
              href="tel:+351918881199"
              className="block text-sm text-black/70 hover:text-black"
            >
              +351 918 881 199
            </a>
            <span className="block text-[0.68rem] text-black/35">
              {tFooter("phoneNote")}
            </span>
            <span className="block text-sm text-black/40">
              {tFooter("location")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gold-dark"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="text-[0.7rem] tracking-[0.15em] text-text-muted">
            <button
              className={locale === "pt" ? "text-gold" : ""}
              onClick={() => switchLocale("pt")}
            >
              PT
            </button>
            &nbsp;|&nbsp;
            <button
              className={locale === "en" ? "text-gold" : ""}
              onClick={() => switchLocale("en")}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
