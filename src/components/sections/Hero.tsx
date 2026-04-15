"use client";

import { Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** Dark Luxury — fond #060A10, accents or #B8922A, atmosphère Bleu Abyssal */
export function Hero() {
  const { t } = useLanguage();
  const h = t.hero;

  return (
    <section
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-luxury-bg pt-16"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-20%,rgba(2,8,20,0.85),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_80%_100%,rgba(2,8,20,0.65),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-abyssal/40 via-luxury-bg to-luxury-bg"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.35em] text-luxury-gold">
          <Sparkles className="size-3.5" strokeWidth={1.5} aria-hidden />
          {h.tagline}
        </p>

        <h1 className="font-serif text-[clamp(38px,6vw,56px)] font-bold leading-[1.08] tracking-[-1px] text-[#F0F6FF] mb-6">
  <span dir="ltr">Voice is an Asset.</span>
</h1>

        <p className="mt-4 font-serif text-xl text-luxury-text/90 sm:text-2xl md:text-3xl">
          {h.title}
        </p>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-luxury-text/70 md:text-xl">
          {h.description}
        </p>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#demos"
            className="inline-flex min-h-[3rem] min-w-[12rem] items-center justify-center bg-luxury-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-on-gold shadow-gold-active transition-[background-color,box-shadow] hover:bg-luxury-gold-light"
          >
            {h.cta_listen}
          </a>
          <a
            href="#contact"
            className="border border-luxury-gold/35 px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-luxury-text transition-colors hover:border-luxury-gold hover:text-luxury-gold"
          >
            {h.cta_contact}
          </a>
        </div>
      </div>
    </section>
  );
}
