"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import locales from "@/i18n/locales.json";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Lang = "fr" | "ar" | "en";

type Locale = (typeof locales)["fr"];

export interface LangOption {
  code: Lang;
  /** Short badge shown in the switcher button */
  short: string;
  /** Full label in the switcher tooltip / aria */
  label: string;
}

// "Algerian Arabic" highlights Reda's local specificity in the UI,
// while Classical Arabic is used separately for the audio demo filters.
export const LANG_OPTIONS: LangOption[] = [
  { code: "fr", short: "FR", label: "Français" },
  { code: "ar", short: "AR", label: "Algerian Arabic" },
  { code: "en", short: "EN", label: "English" },
];

// ── Context ───────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Locale;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  const isRTL = lang === "ar";
  const t = locales[lang] as Locale;

  const setLang = (l: Lang) => setLangState(l);

  // Sync <html dir> and <html lang> with active language
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = isRTL ? "rtl" : "ltr";
  }, [lang, isRTL]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
