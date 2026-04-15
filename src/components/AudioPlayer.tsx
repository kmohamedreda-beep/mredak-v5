"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import {
  AUDIO_CATEGORIES,
  LANGUAGE_BADGES,
  LANGUAGES,
  type AudioCategory,
  type Language,
  type PlaylistTrack,
} from "@/config/demos";
import { useLanguage } from "@/context/LanguageContext";
import rawPlaylist from "@/data/playlist.json";

const allTracks = rawPlaylist as PlaylistTrack[];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/** Replace {n} placeholder in a translated string */
function interp(str: string, n: number) {
  return str.replace("{n}", String(n));
}

function countFor(cat: AudioCategory | "all", lang: Language | "all") {
  return allTracks.filter(
    (t) =>
      (cat === "all" || t.category === cat) &&
      (lang === "all" || t.language === lang),
  ).length;
}

// ── Filter pill ───────────────────────────────────────────────────────────────

function FilterPill({
  label,
  badge,
  count,
  active,
  onClick,
}: {
  label: string;
  badge?: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  if (count === 0 && !active) return null;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      disabled={count === 0}
      className={`shrink-0 flex items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-xs tracking-[0.12em] uppercase transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
        active
          ? "border-gold bg-gold/15 text-gold"
          : "border-white/12 text-cream/50 hover:border-gold/30 hover:text-cream/80"
      }`}
    >
      {badge && (
        <span
          className={`font-mono text-[10px] font-semibold tracking-widest ${active ? "text-gold" : "text-cream/40"}`}
        >
          {badge}
        </span>
      )}
      {label}
      <span
        className={`rounded-full px-1.5 py-px font-mono text-[9px] tabular-nums ${
          active ? "bg-gold/20 text-gold" : "bg-white/8 text-cream/35"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ── Track card ────────────────────────────────────────────────────────────────

function TrackCard({
  track,
  active,
  isPlaying,
  progress,
  duration,
  onPlayPause,
  onSeek,
  categoryLabel,
  playingLabel,
  pausedLabel,
}: {
  track: PlaylistTrack;
  active: boolean;
  isPlaying: boolean;
  progress: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (ratio: number) => void;
  categoryLabel: string;
  playingLabel: string;
  pausedLabel: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  const handleSeek = (clientX: number) => {
    if (!active || !duration) return;
    const el = barRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onSeek(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
  };

  return (
    <article
      className={`group flex flex-col gap-4 rounded-xl border p-5 transition-all duration-300 ${
        active
          ? "border-gold/55 bg-midnight-soft shadow-[var(--shadow-gold-glow)]"
          : "border-white/8 bg-midnight hover:border-gold/22 hover:bg-midnight-soft"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onPlayPause}
          className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-200 hover:scale-105 active:scale-95 ${
            active
              ? "border-gold bg-gold/15 text-gold hover:bg-gold/25"
              : "border-white/18 text-cream/55 hover:border-gold/45 hover:text-gold"
          }`}
          aria-label={isPlaying ? pausedLabel : playingLabel}
        >
          {isPlaying ? (
            <Pause className="size-3.5" strokeWidth={2} aria-hidden />
          ) : (
            <Play className="size-3.5 translate-x-px" strokeWidth={2} aria-hidden />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-sm font-medium leading-snug text-cream/90">
            {track.name}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-[9px] font-semibold tracking-widest text-cream/30 uppercase">
              {LANGUAGE_BADGES[track.language]}
            </span>
            <span className="text-cream/15">·</span>
            <span className="font-sans text-[9px] tracking-wider text-cream/30 uppercase">
              {categoryLabel}
            </span>
          </div>
        </div>

        {active && isPlaying && (
          <Volume2
            className="size-3.5 shrink-0 text-gold/50 animate-pulse"
            strokeWidth={1.5}
            aria-hidden
          />
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div
          ref={barRef}
          role="slider"
          tabIndex={active ? 0 : -1}
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-disabled={!active}
          className={`relative h-px w-full rounded-full bg-white/8 outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-midnight ${
            active ? "cursor-pointer" : "cursor-default opacity-25"
          }`}
          onClick={(e) => active && handleSeek(e.clientX)}
          onKeyDown={(e) => {
            if (!active) return;
            if (e.key === "ArrowRight") onSeek(Math.min(1, progress + 0.05));
            if (e.key === "ArrowLeft") onSeek(Math.max(0, progress - 0.05));
          }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gold/75 transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
          {active && duration > 0 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-2 rounded-full bg-gold shadow-[0_0_6px_rgba(197,160,89,0.7)]"
              style={{ left: `${progress * 100}%` }}
            />
          )}
        </div>
        <div className="flex justify-between font-mono text-[10px] tabular-nums text-cream/25">
          <span>{formatTime(progress * duration)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </article>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AudioPlayer() {
  const { t } = useLanguage();
  const a = t.audio;

  const [activeCategory, setActiveCategory] = useState<AudioCategory | "all">("all");
  const [activeLanguage, setActiveLanguage]  = useState<Language | "all">("all");
  const [activeId,       setActiveId]        = useState<string | null>(null);
  const [isPlaying,      setIsPlaying]       = useState(false);
  const [progress,       setProgress]        = useState(0);
  const [duration,       setDuration]        = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const visible = allTracks.filter(
    (t) =>
      (activeCategory === "all" || t.category === activeCategory) &&
      (activeLanguage  === "all" || t.language  === activeLanguage),
  );

  // Audio event wiring
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime   = () => { if (el.duration) setProgress(el.currentTime / el.duration); };
    const onLoaded = () => { if (el.duration) setDuration(el.duration); };
    const onEnded  = () => { setIsPlaying(false); setProgress(0); };
    el.addEventListener("timeupdate",    onTime);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("ended",         onEnded);
    el.addEventListener("play",          () => setIsPlaying(true));
    el.addEventListener("pause",         () => setIsPlaying(false));
    return () => {
      el.removeEventListener("timeupdate",    onTime);
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("ended",         onEnded);
      el.removeEventListener("play",          () => setIsPlaying(true));
      el.removeEventListener("pause",         () => setIsPlaying(false));
    };
  }, []);

  // Stop playback if active track leaves the filtered view
  useEffect(() => {
    if (activeId && !visible.some((t) => t.id === activeId)) {
      audioRef.current?.pause();
      setActiveId(null);
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
    }
  }, [visible, activeId]);

  const toggle = (track: PlaylistTrack) => {
    const el = audioRef.current;
    if (!el) return;
    if (activeId === track.id) {
      if (el.paused) void el.play();
      else el.pause();
      return;
    }
    setActiveId(track.id);
    setProgress(0);
    setDuration(0);
    el.src = track.path;
    void el.play().catch(() => { setActiveId(null); setIsPlaying(false); });
  };

  const seek = (ratio: number) => {
    const el = audioRef.current;
    if (!el || !activeId || !el.duration) return;
    el.currentTime = ratio * el.duration;
    setProgress(ratio);
  };

  const resetFilters = () => {
    setActiveCategory("all");
    setActiveLanguage("all");
  };

  return (
    <section
      id="demos"
      className="scroll-mt-20 border-t border-white/8 bg-midnight py-24 text-cream md:py-32"
      aria-labelledby="audio-heading"
    >
      <audio ref={audioRef} preload="metadata" className="hidden" />

      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-gold">
            {a.section_label}
          </p>
          <h2
            id="audio-heading"
            className="mt-4 font-serif text-3xl font-medium tracking-tight text-cream md:text-4xl"
          >
            {a.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-cream/55 md:text-base">
            {interp(a.subtitle, allTracks.length)}
          </p>
        </header>

        {/* Barre 1 — Langue */}
        <div className="mt-12 space-y-2">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-cream/30">
            {a.language_label}
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label={a.language_label}
          >
            <FilterPill
              label={a.all}
              count={countFor(activeCategory, "all")}
              active={activeLanguage === "all"}
              onClick={() => setActiveLanguage("all")}
            />
            {LANGUAGES.map((lang) => (
              <FilterPill
                key={lang}
                label={a.languages[lang]}
                badge={LANGUAGE_BADGES[lang]}
                count={countFor(activeCategory, lang)}
                active={activeLanguage === lang}
                onClick={() => setActiveLanguage(lang)}
              />
            ))}
          </div>
        </div>

        {/* Barre 2 — Catégorie */}
        <div className="mt-6 space-y-2">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-cream/30">
            {a.category_label}
          </p>
          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
            role="tablist"
            aria-label={a.category_label}
          >
            <FilterPill
              label={a.all}
              count={countFor("all", activeLanguage)}
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            />
            {AUDIO_CATEGORIES.map((cat) => (
              <FilterPill
                key={cat}
                label={a.categories[cat]}
                count={countFor(cat, activeLanguage)}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>
        </div>

        {/* Compteur */}
        <p className="mt-6 font-sans text-xs text-cream/30">
          {interp(a.results, visible.length)}
        </p>

        {/* Grille */}
        {visible.length > 0 ? (
          <ul className="mt-6 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((track) => {
              const active = activeId === track.id;
              return (
                <li key={track.id}>
                  <TrackCard
                    track={track}
                    active={active}
                    isPlaying={active && isPlaying}
                    progress={active ? progress : 0}
                    duration={active ? duration : 0}
                    onPlayPause={() => toggle(track)}
                    onSeek={seek}
                    categoryLabel={a.categories[track.category]}
                    playingLabel={a.playing}
                    pausedLabel={a.paused}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <p className="text-2xl opacity-20">♪</p>
            <p className="text-sm text-cream/40">{a.empty}</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 text-xs text-gold/60 underline underline-offset-4 hover:text-gold transition-colors"
            >
              {a.reset}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
