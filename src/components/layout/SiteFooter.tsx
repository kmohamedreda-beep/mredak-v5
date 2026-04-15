"use client";

import { Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** Pied de page — Bleu Abyssal */
export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-luxury-gold/10 bg-abyssal py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-start">
        <p className="text-sm text-luxury-text/50">
          © {new Date().getFullYear()} Mohamed Reda Khiar — {t.footer.tagline}
        </p>
        <a
          href="mailto:contact@example.com"
          className="inline-flex items-center gap-2 text-sm text-luxury-text/80 transition-colors hover:text-luxury-gold"
        >
          <Mail className="size-4 text-luxury-gold/90" strokeWidth={1.5} aria-hidden />
          contact@example.com
        </a>
      </div>
    </footer>
  );
}
