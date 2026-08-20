import { useTranslations } from "next-intl";
import Image from "next/image";
import { cldUrl } from "@/lib/cloudinary";

const FALLBACK = "https://images.unsplash.com/photo-1551524164-6bb6236c70fb?w=1600&q=80&auto=format&fit=crop";

export function ManagementHero({ src }: { src?: string }) {
  const t = useTranslations("management.hero");

  return (
    <section className="relative flex h-[100svh] min-h-[600px] flex-col justify-end overflow-hidden">
      <Image
        src={cldUrl(src ?? FALLBACK)}
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/70" />
      <div className="relative z-10 px-6 pb-16 text-white lg:px-24 lg:pb-24">
        <div className="mb-5 flex items-center gap-4">
          <span className="whitespace-nowrap text-[0.6rem] font-medium uppercase tracking-[0.3em] text-white/90">
            {t("eyebrow")}
          </span>
          <span className="h-px w-16 bg-white/40" />
        </div>
        <h1
          className="max-w-3xl font-serif text-[clamp(2.2rem,7vw,5rem)] font-light leading-[1.05] [&_em]:text-gold-light [&_em]:not-italic"
          dangerouslySetInnerHTML={{ __html: t.raw("headline") }}
        />
        <a
          href="#services"
          className="mt-8 inline-block border border-white/40 px-8 py-3.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold-light"
        >
          {t("cta")}
        </a>
      </div>
    </section>
  );
}
