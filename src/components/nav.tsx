"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

const sectors = [
  { key: "digital", href: "/digital", enabled: true },
  { key: "management", href: "/management", enabled: true },
  { key: "investments", href: "/investments", enabled: false },
] as const;

export function Nav() {
  const t = useTranslations("nav");
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
        className="font-serif text-base uppercase tracking-[0.2em] text-white"
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
          className="relative z-50 flex flex-col gap-1.5 p-1 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-[1.5px] w-[22px] transition-transform ${open ? "translate-y-[6.5px] rotate-45 bg-black" : "bg-white"}`}
          />
          <span
            className={`block h-[1.5px] w-[22px] transition-opacity ${open ? "opacity-0" : "bg-white"}`}
          />
          <span
            className={`block h-[1.5px] w-[22px] transition-transform ${open ? "-translate-y-[6.5px] -rotate-45 bg-black" : "bg-white"}`}
          />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-white transition-transform duration-400 lg:hidden ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {sectors.map((sector) =>
          sector.enabled ? (
            <Link
              key={sector.key}
              href={sector.href}
              onClick={() => setOpen(false)}
              className="font-serif text-3xl font-light tracking-wide text-black/70 hover:text-black"
            >
              {t(sector.key)}
            </Link>
          ) : (
            <span
              key={sector.key}
              className="font-serif text-3xl font-light tracking-wide text-black/25"
            >
              {t(sector.key)}
            </span>
          ),
        )}
        <Link
          href="/contact"
          onClick={() => setOpen(false)}
          className="font-serif text-3xl font-light tracking-wide text-black/70 hover:text-black"
        >
          {t("contact")}
        </Link>
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
    </nav>
  );
}
