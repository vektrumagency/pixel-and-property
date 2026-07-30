import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";

type Testimonial = { text: string; author: string; role: string };

export function DigitalTestimonials() {
  const t = useTranslations("digital.testimonials");
  const items = t.raw("items") as Testimonial[];
  const track = [...items, ...items];

  return (
    <section className="overflow-hidden bg-white py-16 lg:py-32">
      <Reveal className="px-6 lg:px-24">
        <span className="mb-4 block text-[0.52rem] uppercase tracking-[0.45em] text-gold-dark">
          {t("label")}
        </span>
        <h2 className="max-w-2xl font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-[1.2]">
          {t("title")}
        </h2>
      </Reveal>

      <div className="mt-12 overflow-hidden lg:mt-16">
        <div className="flex w-max animate-[scroll-testimonials_45s_linear_infinite] gap-6 px-6 hover:[animation-play-state:paused] lg:gap-8 lg:px-24">
          {track.map((item, i) => (
            <div
              key={`${item.author}-${i}`}
              className="flex w-[320px] shrink-0 flex-col justify-between border border-gold/20 bg-gold/[0.04] p-8 lg:w-[440px] lg:p-10"
            >
              <span className="mb-4 font-serif text-6xl leading-none text-gold/50">
                &ldquo;
              </span>
              <p className="mb-8 font-serif text-lg font-light italic leading-[1.6] text-black/80 lg:text-xl">
                {item.text}
              </p>
              <div>
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.12em]">
                  {item.author}
                </p>
                <p className="text-[0.6rem] tracking-[0.1em] text-gold-dark">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
