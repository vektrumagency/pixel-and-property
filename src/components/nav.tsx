"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 2h-3.2v13.6a2.9 2.9 0 1 1-2.06-2.78V9.6a6.1 6.1 0 1 0 5.26 6.04V8.9a8.3 8.3 0 0 0 4.6 1.4V7.1a5.1 5.1 0 0 1-4.6-5.1Z" />
    </svg>
  );
}

const sectors = [
  { key: "digital", href: "/digital", enabled: true },
  { key: "management", href: "/management", enabled: true },
  { key: "investments", href: "/investments", enabled: true },
] as const;

const socials = [
  { name: "Facebook", href: "#", icon: FacebookIcon },
  { name: "Instagram", href: "#", icon: InstagramIcon },
  { name: "TikTok", href: "#", icon: TikTokIcon },
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
              href="mailto:pixelandproperty.contact@gmail.com"
              className="block text-sm text-black/70 hover:text-black"
            >
              pixelandproperty.contact@gmail.com
            </a>
            <a
              href="tel:+351918881199"
              className="block text-sm text-black/70 hover:text-black"
            >
              +351 918 881 199
            </a>
            <span className="block text-sm text-black/40">
              {tFooter("location")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
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
