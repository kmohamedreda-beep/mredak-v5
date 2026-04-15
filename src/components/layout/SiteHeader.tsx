"use client";

import Link from "next/link";
import { Mic2 } from "lucide-react";
import { LANG_OPTIONS, useLanguage, type Lang } from "@/context/LanguageContext";

export function SiteHeader() {
  const { lang, setLang, t } = useLanguage();

  const nav = [
    { href: "#services", label: t.nav.services },
    { href: "#demos",    label: t.nav.demos },
    { href: "#contact",  label: t.nav.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gold/15 bg-navy/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3 no-underline shrink-0">
          <Mic2 className="size-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden />
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-base font-semibold tracking-wide text-gold transition-colors group-hover:text-gold-light sm:text-lg">
              MOHAMMED REDA KHIAR
            </span>
            <span className="text-[10px] font-sans tracking-[0.28em] text-cream/70 uppercase">
              {t.hero.tagline}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-5 md:gap-8">
          {/* Main nav */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium uppercase tracking-[0.2em] text-cream/70 transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Language switcher */}
          <div
            className="flex items-center gap-1 border-s border-gold/15 ps-4"
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
                className={`rounded px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest transition-all duration-200 ${
                  lang === opt.code
                    ? "bg-gold/15 text-gold ring-1 ring-gold/30"
                    : "text-cream/40 hover:text-cream/70"
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
