"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const LANGS = [
  { code: "fr" as const, label: "Français" },
  { code: "ar" as const, label: "Arabe" },
  { code: "dz" as const, label: "DZ" },
  { code: "en" as const, label: "Anglais" },
];

const TRACKS = [
  { id: "pub" as const, title: "Publicité", subtitle: "Impact, rythme, mémorisation" },
  { id: "inst" as const, title: "Corporate", subtitle: "Institutionnel, crédibilité" },
  { id: "doc" as const, title: "Médical", subtitle: "Clarté, précision, confiance" },
];

type Lang = (typeof LANGS)[number]["code"];
type TrackId = (typeof TRACKS)[number]["id"];

function formatTime(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function DemoCard({
  trackKey,
  cardKey,
  title,
  subtitle,
  isPlaying,
  progress,
  duration,
  pathLabel,
  onPlayPause,
  onSeek,
}: {
  trackKey: string | null;
  cardKey: string;
  title: string;
  subtitle: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
  pathLabel: string;
  onPlayPause: () => void;
  onSeek: (ratio: number) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const active = trackKey === cardKey;

  const handleBarPointer = (clientX: number) => {
    if (!active || !duration) return;
    const el = barRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onSeek(ratio);
  };

  return (
    <article className="group relative flex flex-col border border-gold/20 bg-black/25 p-6 shadow-[inset_0_1px_0_rgba(197,160,89,0.05)] transition-all duration-500 ease-out hover:border-gold/40 hover:shadow-gold-glow md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-xl font-semibold tracking-tight text-gold md:text-2xl">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-cream/70">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onPlayPause}
          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold text-gold transition-transform duration-200 hover:scale-105 active:scale-95"
          aria-label={isPlaying ? "Pause" : "Lecture"}
        >
          {isPlaying ? (
            <Pause className="size-5" strokeWidth={1.5} fill="none" aria-hidden />
          ) : (
            <Play className="size-5 translate-x-0.5" strokeWidth={1.5} fill="none" aria-hidden />
          )}
        </button>
      </div>

      <div className="mt-8 space-y-2">
        <div
          ref={barRef}
          role="slider"
          tabIndex={active ? 0 : -1}
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-disabled={!active}
          className={`relative h-0.5 w-full rounded-full bg-cream/15 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy ${active ? "cursor-pointer" : "cursor-default opacity-45"}`}
          onClick={(e) => active && handleBarPointer(e.clientX)}
          onKeyDown={(e) => {
            if (!active) return;
            if (e.key === "ArrowRight") onSeek(Math.min(1, progress + 0.05));
            if (e.key === "ArrowLeft") onSeek(Math.max(0, progress - 0.05));
          }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gold transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex justify-between font-sans text-[11px] uppercase tracking-[0.2em] text-cream/45">
          <span>{formatTime(progress * duration)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <p className="mt-4 truncate font-mono text-[10px] text-cream/25" title={pathLabel}>
        {pathLabel}
      </p>
    </article>
  );
}

export function AudioPortfolio() {
  const [activeLang, setActiveLang] = useState<Lang>("fr");
  const [trackKey, setTrackKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const srcFor = (lang: Lang, trackId: TrackId) => `/demos/${lang}/${trackId}.mp3`;

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      if (!a.duration) return;
      setProgress(a.currentTime / a.duration);
    };
    const onLoaded = () => {
      if (a.duration) setDuration(a.duration);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("ended", onEnded);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, []);

  const changeLang = (code: Lang) => {
    audioRef.current?.pause();
    setTrackKey(null);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setActiveLang(code);
  };

  const toggleTrack = (lang: Lang, trackId: TrackId) => {
    const key = `${lang}-${trackId}`;
    const a = audioRef.current;
    if (!a) return;

    if (trackKey === key) {
      if (a.paused) void a.play();
      else a.pause();
      return;
    }

    setTrackKey(key);
    a.src = srcFor(lang, trackId);
    setProgress(0);
    setDuration(0);
    void a.play().catch(() => {
      setTrackKey(null);
      setIsPlaying(false);
    });
  };

  const seek = (ratio: number) => {
    const a = audioRef.current;
    if (!a || !trackKey || !a.duration) return;
    a.currentTime = ratio * a.duration;
    setProgress(ratio);
  };

  return (
    <section
      id="demos"
      className="scroll-mt-20 border-t border-white/10 bg-navy py-24 text-cream md:py-32"
      aria-labelledby="portfolio-heading"
    >
      <audio ref={audioRef} preload="metadata" className="hidden" />

      <div className="mx-auto max-w-6xl px-6">
        <header className="mx-auto max-w-3xl text-center">
          <p className="font-sans text-sm font-medium tracking-[0.35em] text-gold uppercase">
            Portfolio audio
          </p>
          <h2
            id="portfolio-heading"
            className="mt-5 font-serif text-[1.75rem] font-semibold leading-tight tracking-tight text-gold md:text-4xl lg:text-[2.65rem]"
          >
            Une voix, quatre langues
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-cream/80 md:text-base">
            Choisissez une langue, puis explorez trois registres — publicité, corporate et médical.
          </p>

        </header>

        <div
          className="mx-auto mt-16 flex w-full max-w-3xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-gold/25 bg-navy/50 p-2 backdrop-blur-md sm:p-2.5"
          role="tablist"
          aria-label="Langue des démos"
        >
          {LANGS.map(({ code, label }) => {
            const active = activeLang === code;
            return (
              <button
                key={code}
                type="button"
                role="tab"
                aria-selected={active}
                id={`tab-${code}`}
                aria-controls="panel-demos"
                onClick={() => changeLang(code)}
                className={`min-h-[3.25rem] min-w-[7.5rem] rounded-full px-7 py-3.5 font-sans text-[0.95rem] tracking-[0.12em] transition-all duration-300 sm:min-w-[8.25rem] sm:px-9 sm:py-4 sm:text-base sm:tracking-[0.18em] ${active ? "bg-gold font-semibold text-navy shadow-gold-active" : "font-medium text-cream/65 hover:bg-white/5 hover:text-cream"}`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div
          id="panel-demos"
          role="tabpanel"
          aria-labelledby={`tab-${activeLang}`}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {TRACKS.map((track) => {
            const cardKey = `${activeLang}-${track.id}`;
            const pathLabel = `/demos/${activeLang}/${track.id}.mp3`;
            const cardIsPlaying = trackKey === cardKey && isPlaying;
            const showProgress = trackKey === cardKey;
            return (
              <DemoCard
                key={track.id}
                trackKey={trackKey}
                cardKey={cardKey}
                title={track.title}
                subtitle={track.subtitle}
                isPlaying={cardIsPlaying}
                progress={showProgress ? progress : 0}
                duration={showProgress ? duration : 0}
                pathLabel={pathLabel}
                onPlayPause={() => toggleTrack(activeLang, track.id)}
                onSeek={seek}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}


