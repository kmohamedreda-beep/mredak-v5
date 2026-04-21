"use client";

import Link from "next/link";

import { LANG_OPTIONS, useLanguage, type Lang } from "@/context/LanguageContext";

/** Barre de navigation — fond Bleu Abyssal (#020814) */
export function SiteHeader() {
  const { lang, setLang, t } = useLanguage();

  const nav = [
    { href: "#services", label: t.nav.services },
    { href: "#demos", label: t.nav.demos },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-luxury-gold/12 bg-abyssal/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-4 no-underline">
          {/* Monogramme MRK — Serif fin, kerning généreux, couleur Or */}
          <span className="font-serif text-xl font-light tracking-[0.48em] text-luxury-gold transition-colors duration-200 group-hover:text-luxury-gold-light pr-1 sm:text-2xl">
            MRK
          </span>
          {/* Séparateur vertical */}
          <span className="hidden h-6 w-px bg-luxury-gold/18 sm:block" aria-hidden />
          {/* Nom + tagline empilés */}
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-sans text-[11px] font-light tracking-[0.18em] text-luxury-text/58 uppercase transition-colors duration-200 group-hover:text-luxury-text/80">
              Mohammed Reda Khiar
            </span>
            <span className="mt-0.5 font-sans text-[9px] tracking-[0.25em] text-luxury-text/32 uppercase">
              {t.hero.tagline}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-5 md:gap-8">
          <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium tracking-[0.2em] text-luxury-text/65 uppercase transition-colors hover:text-luxury-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div
            className="flex items-center gap-1 border-s border-luxury-gold/15 ps-4"
            role="group"
            aria-label="Choisir la langue"
          >
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => setLang(opt.code as Lang)}
                aria-label={opt.label}
                aria-pressed={lang === opt.code}
                className={`rounded px-2.5 py-1 font-mono text-[10px] font-semibold tracking-widest uppercase transition-all duration-200 ${
                  lang === opt.code
                    ? "bg-luxury-gold/15 text-luxury-gold ring-1 ring-luxury-gold/30"
                    : "text-luxury-text/40 hover:text-luxury-text/70"
                }`}
              >
                {opt.short}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
