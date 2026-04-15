// ── Categories ────────────────────────────────────────────────────────────────
export const AUDIO_CATEGORIES = [
  "medical",
  "corporate",
  "elearning",
  "gaming",
  "luxury",
  "documentary",
  "narration",
  "ads",
  "international",
] as const;

export type AudioCategory = (typeof AUDIO_CATEGORIES)[number];

// ── Languages ─────────────────────────────────────────────────────────────────
export const LANGUAGES = ["fr", "ar", "en", "algerian_ar"] as const;

export type Language = (typeof LANGUAGES)[number];

/** Short badge shown on filter pills — language-neutral, no translation needed */
export const LANGUAGE_BADGES: Record<Language, string> = {
  fr: "FR",
  ar: "AR",
  en: "EN",
  algerian_ar: "DZ",
};

// ── Track ─────────────────────────────────────────────────────────────────────
export type PlaylistTrack = {
  id: string;
  name: string;
  path: string;
  category: AudioCategory;
  language: Language;
};
