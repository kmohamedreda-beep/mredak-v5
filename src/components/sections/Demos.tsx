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

function formatTime(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

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
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-xs tracking-[0.12em] uppercase transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? "border-luxury-gold/40 bg-luxury-gold/10 text-luxury-gold"
          : "border-white/[0.08] text-luxury-text/45 hover:border-luxury-gold/25 hover:text-luxury-text/75"
      }`}
    >
      {badge && (
        <span
          className={`font-mono text-[10px] font-semibold tracking-widest ${active ? "text-luxury-gold" : "text-luxury-text/35"}`}
        >
          {badge}
        </span>
      )}
      {label}
      <span
        className={`rounded-full px-1.5 py-px font-mono text-[9px] tabular-nums ${
          active ? "bg-luxury-gold/15 text-luxury-gold" : "bg-white/[0.06] text-luxury-text/30"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

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
      className={`flex flex-col gap-4 rounded-lg border p-4 transition-colors duration-300 ${
        active
          ? "border-luxury-gold/35 bg-midnight-soft shadow-gold-glow"
          : "border-white/[0.06] bg-midnight hover:border-white/[0.1]"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPlayPause}
          className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
            active
              ? "border-luxury-gold/50 bg-luxury-gold/10 text-luxury-gold hover:bg-luxury-gold/18"
              : "border-white/[0.12] text-luxury-text/50 hover:border-luxury-gold/35 hover:text-luxury-gold"
          }`}
          aria-label={isPlaying ? pausedLabel : playingLabel}
        >
          {isPlaying ? (
            <Pause className="size-3" strokeWidth={2} aria-hidden />
          ) : (
            <Play className="size-3 translate-x-px" strokeWidth={2} aria-hidden />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-sm font-medium leading-snug text-luxury-text/90">
            {track.name}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="font-mono text-[9px] font-semibold tracking-widest text-luxury-text/25 uppercase">
              {LANGUAGE_BADGES[track.language]}
            </span>
            <span className="text-luxury-text/12">·</span>
            <span className="font-sans text-[9px] tracking-wider text-luxury-text/28 uppercase">
              {categoryLabel}
            </span>
          </div>
        </div>

        {active && isPlaying && (
          <Volume2
            className="size-3 shrink-0 text-luxury-gold/45 animate-pulse"
            strokeWidth={1.5}
            aria-hidden
          />
        )}
      </div>

      <div className="space-y-1">
        <div
          ref={barRef}
          role="slider"
          tabIndex={active ? 0 : -1}
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-disabled={!active}
          className={`relative h-px w-full rounded-full bg-white/[0.07] outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-luxury-bg ${
            active ? "cursor-pointer" : "cursor-default opacity-30"
          }`}
          onClick={(e) => active && handleSeek(e.clientX)}
          onKeyDown={(e) => {
            if (!active) return;
            if (e.key === "ArrowRight") onSeek(Math.min(1, progress + 0.05));
            if (e.key === "ArrowLeft") onSeek(Math.max(0, progress - 0.05));
          }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-luxury-gold transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
          {active && duration > 0 && (
            <div
              className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-luxury-gold shadow-[0_0_8px_rgba(184,146,42,0.55)]"
              style={{ left: `${progress * 100}%` }}
            />
          )}
        </div>
        <div className="flex justify-between font-mono text-[10px] tabular-nums text-luxury-text/28">
          <span>{formatTime(progress * duration)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </article>
  );
}

export function Demos() {
  const { t } = useLanguage();
  const a = t.audio;

  const [activeCategory, setActiveCategory] = useState<AudioCategory | "all">("all");
  const [activeLanguage, setActiveLanguage] = useState<Language | "all">("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const visible = allTracks.filter(
    (t) =>
      (activeCategory === "all" || t.category === activeCategory) &&
      (activeLanguage === "all" || t.language === activeLanguage),
  );

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      if (el.duration) setProgress(el.currentTime / el.duration);
    };
    const onLoaded = () => {
      if (el.duration) setDuration(el.duration);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("ended", onEnded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

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
    void el.play().catch(() => {
      setActiveId(null);
      setIsPlaying(false);
    });
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
      className="scroll-mt-20 border-t border-white/[0.06] bg-luxury-bg py-24 text-luxury-text md:py-32"
      aria-labelledby="audio-heading"
    >
      <audio ref={audioRef} preload="metadata" className="hidden" />

      <div className="mx-auto max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-luxury-gold">
            {a.section_label}
          </p>
          <h2
            id="audio-heading"
            className="mt-4 font-serif text-3xl font-medium tracking-tight text-luxury-text md:text-4xl"
          >
            {a.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-luxury-text/50 md:text-base">
            {interp(a.subtitle, allTracks.length)}
          </p>
        </header>

        <div className="mt-12 space-y-2">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-luxury-text/28">
            {a.language_label}
          </p>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={a.language_label}>
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

        <div className="mt-6 space-y-2">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-luxury-text/28">
            {a.category_label}
          </p>
          <div
            className="scrollbar-none flex gap-2 overflow-x-auto pb-1"
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

        <p className="mt-6 font-sans text-xs text-luxury-text/28">
          {interp(a.results, visible.length)}
        </p>

        {visible.length > 0 ? (
          <ul className="mt-6 grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            <p className="text-sm text-luxury-text/40">{a.empty}</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 text-xs text-luxury-gold/70 underline underline-offset-4 transition-colors hover:text-luxury-gold"
            >
              {a.reset}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
