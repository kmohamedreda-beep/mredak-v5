"use client";

import { Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** Design System V2 — Bleu Abyssal, accent Or, titre brand fixe. */
export function Hero() {
  const { t } = useLanguage();
  const h = t.hero;

  return (
    <section
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#020814] pt-16"
      aria-labelledby="hero-heading"
    >
      {/* Bleu Abyssal — couches de profondeur */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-20%,rgba(0,40,85,0.45),transparent_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_80%_100%,rgba(8,28,52,0.55),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030d18] via-[#020814] to-[#01060d]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.35em] text-gold">
          <Sparkles className="size-3.5" strokeWidth={1.5} aria-hidden />
          {h.tagline}
        </p>

        <h1
          id="hero-heading"
          className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Voice is an Asset.
        </h1>

        <p className="mt-4 font-serif text-xl text-cream/85 sm:text-2xl md:text-3xl">
          {h.title}
        </p>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-cream/70 md:text-xl">
          {h.description}
        </p>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          {/* Bouton Or — primaire */}
          <a
            href="#demos"
            className="inline-flex min-h-[3rem] min-w-[12rem] items-center justify-center bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-[#001026] shadow-[0_4px_24px_rgba(197,160,89,0.35)] transition-[color,background-color,box-shadow] hover:bg-gold-light hover:shadow-[0_6px_28px_rgba(197,160,89,0.45)]"
          >
            {h.cta_listen}
          </a>
          <a
            href="#contact"
            className="border border-gold/40 px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:border-gold hover:text-gold"
          >
            {h.cta_contact}
          </a>
        </div>
      </div>
    </section>
  );
}
