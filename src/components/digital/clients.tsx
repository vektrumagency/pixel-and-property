import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";


const logos = [
  { file: "vendo.svg", alt: "Vendo" },
  { file: "coldwell-banker.png", alt: "Coldwell Banker" },
  { file: "era.png", alt: "ERA" },
  { file: "jll.png", alt: "JLL" },
];

export function DigitalClients() {
  const t = useTranslations("digital.clients");
  // Repeat the set enough times that the track is always wider than the
  // viewport (only 4 logos otherwise fit on screen with no room to scroll).
  const track = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

  return (
    <section className="overflow-hidden bg-white py-8 lg:py-12">
      <Reveal className="mb-6 text-center text-[0.5rem] uppercase tracking-[0.3em] text-black/50 lg:mb-8 lg:text-[0.62rem] lg:tracking-[0.38em]">
        {t("label")}
      </Reveal>
      <div className="overflow-hidden">
        <div className="flex w-max animate-[scroll-logos_30s_linear_infinite] gap-16 lg:gap-24">
          {track.map((logo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${logo.file}-${i}`}
              src={`/images/logos/${logo.file}`}
              alt={logo.alt}
              className="h-7 w-auto shrink-0 object-contain opacity-55 brightness-0 lg:h-10"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
