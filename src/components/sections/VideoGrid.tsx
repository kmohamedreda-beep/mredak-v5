"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import videosData from "@/data/videos.json";
import { useLanguage } from "@/context/LanguageContext";

// react-player chargé uniquement côté navigateur, au clic
// Cast nécessaire : Next.js dynamic + react-player v3 ont des types incompatibles
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

// ── Types ─────────────────────────────────────────────────────────────────────

type Video = (typeof videosData)[number];

const CATEGORIES = ["corporate", "luxury", "ads", "documentary", "medical"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_LABELS: Record<Category, Record<"fr" | "en" | "ar", string>> = {
  corporate:   { fr: "Corporate",    en: "Corporate",    ar: "مؤسسي"  },
  luxury:      { fr: "Luxe",         en: "Luxury",       ar: "فخامة"  },
  ads:         { fr: "Publicité",    en: "Advertising",  ar: "إعلان"  },
  documentary: { fr: "Documentaire", en: "Documentary",  ar: "وثائقي" },
  medical:     { fr: "Médical",      en: "Medical",      ar: "طبي"    },
};

// Dispatch custom event → Demos.tsx écoute et met le lecteur audio en pause
function notifyVideoPlay() {
  if (typeof document !== "undefined") {
    document.dispatchEvent(new CustomEvent("mrk:videoplay"));
  }
}

// ── VideoCard ─────────────────────────────────────────────────────────────────

function VideoCard({
  video,
  catLabel,
  onPlay,
}: {
  video: Video;
  catLabel: string;
  onPlay: (v: Video) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl bg-midnight"
      aria-label={`Regarder : ${video.title}`}
    >
      {/* Poster */}
      <Image
        src={video.poster}
        alt={video.title}
        fill
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        draggable={false}
      />

      {/* Dégradé de fond — s'intensifie au survol */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-bg/85 via-luxury-bg/10 to-transparent opacity-55 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Bouton Play — glisse vers le bas à l'entrée, revient au centre au survol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-11 translate-y-1 items-center justify-center rounded-full border border-luxury-gold/45 bg-luxury-bg/60 text-luxury-gold opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Play className="size-4 translate-x-0.5" strokeWidth={1.5} aria-hidden />
        </div>
      </div>

      {/* Titre en Serif Or — surgit depuis le bas */}
      <div className="absolute right-0 bottom-0 left-0 translate-y-2 px-4 pb-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="mb-1 font-sans text-[9px] uppercase tracking-[0.28em] text-luxury-gold/70">
          {catLabel}
        </p>
        <h3 className="font-serif text-sm font-light leading-snug text-luxury-text/92">
          {video.title}
        </h3>
      </div>

      {/* Badge provider discret — disparaît au survol */}
      <div className="absolute top-3 right-3 rounded border border-white/[0.10] bg-luxury-bg/55 px-1.5 py-px font-mono text-[8px] uppercase tracking-widest text-luxury-text/32 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0">
        {video.provider === "youtube" ? "YT" : "VM"}
      </div>
    </button>
  );
}

// ── VideoLightbox ─────────────────────────────────────────────────────────────

function VideoLightbox({
  video,
  catLabel,
  onClose,
}: {
  video: Video;
  catLabel: string;
  onClose: () => void;
}) {
  const [ready, setReady] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // 1. Arrêt immédiat du lecteur audio
    notifyVideoPlay();

    // 2. Verrouillage du scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 3. Focus accessibilité sur le bouton Fermer
    closeBtnRef.current?.focus();

    // 4. ESC pour fermer
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    /* Backdrop — clic pour fermer */
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-luxury-bg/92 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      {/* Contenu modal — clic ne remonte pas */}
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête : titre + bouton fermer */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-luxury-gold/65">
              {catLabel}
            </p>
            <h3 className="mt-0.5 font-serif text-lg font-light text-luxury-text/88">
              {video.title}
            </h3>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="mt-0.5 shrink-0 text-luxury-text/38 transition-colors hover:text-luxury-text/80"
            aria-label="Fermer la vidéo"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Conteneur 16:9 */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-midnight shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
          {/* Spinner tant que le player n'est pas prêt */}
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-9 animate-spin rounded-full border border-luxury-gold/18 border-t-luxury-gold/55" />
            </div>
          )}

          <ReactPlayer
            url={video.url}
            playing
            controls
            width="100%"
            height="100%"
            onReady={() => setReady(true)}
            style={{ position: "absolute", top: 0, left: 0 }}
            config={{
              youtube: { playerVars: { rel: 0, modestbranding: 1 } },
              vimeo:   { playerOptions: { byline: false, portrait: false, title: false } },
            }}
          />
        </div>

        {/* Hint fermeture */}
        <p className="mt-3 text-center font-sans text-[10px] uppercase tracking-[0.18em] text-luxury-text/20">
          Échap · clic en dehors pour fermer
        </p>
      </div>
    </div>
  );
}

// ── Section principale VideoGrid ───────────────────────────────────────────────

export function VideoGrid() {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const visible =
    activeCategory === "all"
      ? videosData
      : videosData.filter((v) => v.category === activeCategory);

  const getCatLabel = (cat: string) =>
    CATEGORY_LABELS[cat as Category]?.[lang] ?? cat;

  return (
    <section
      id="showreel"
      className="scroll-mt-20 border-t border-white/[0.06] bg-luxury-bg py-24 text-luxury-text md:py-32"
      aria-labelledby="showreel-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* En-tête */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-luxury-gold">
            {lang === "ar" ? "شريل العرض" : "Showreel"}
          </p>
          <h2
            id="showreel-heading"
            className="mt-4 font-serif text-3xl font-light tracking-tight text-luxury-text md:text-4xl"
          >
            {lang === "ar"
              ? "المشاريع بالصوت والصورة"
              : lang === "en"
                ? "Projects on screen"
                : "Projets en images"}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-luxury-text/50 md:text-base">
            {lang === "ar"
              ? `${videosData.length} إنتاجاً · اختر التصنيف`
              : lang === "en"
                ? `${videosData.length} productions · filter by category`
                : `${videosData.length} productions · filtrez par catégorie`}
          </p>
        </header>

        {/* Filtres */}
        <div
          className="mt-10 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label={
            lang === "ar" ? "التصنيفات" : "Filtrer par catégorie"
          }
        >
          {/* Pill "Tout" */}
          {(
            [
              { key: "all" as const, label: lang === "ar" ? "الكل" : lang === "en" ? "All" : "Toutes", count: videosData.length },
              ...CATEGORIES.map((cat) => ({
                key: cat,
                label: getCatLabel(cat),
                count: videosData.filter((v) => v.category === cat).length,
              })),
            ] as { key: Category | "all"; label: string; count: number }[]
          ).map(({ key, label, count }) => {
            const active = activeCategory === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-xs tracking-[0.12em] uppercase transition-all duration-200 ${
                  active
                    ? "border-luxury-gold/40 bg-luxury-gold/10 text-luxury-gold"
                    : "border-white/[0.08] text-luxury-text/45 hover:border-luxury-gold/25 hover:text-luxury-text/75"
                }`}
              >
                {label}
                <span
                  className={`rounded-full px-1.5 py-px font-mono text-[9px] tabular-nums ${
                    active
                      ? "bg-luxury-gold/15 text-luxury-gold"
                      : "bg-white/[0.06] text-luxury-text/30"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grille de posters */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              catLabel={getCatLabel(video.category)}
              onPlay={setActiveVideo}
            />
          ))}
        </div>

        {/* Compteur de résultats */}
        <p className="mt-6 text-center font-sans text-[10px] text-luxury-text/25">
          {lang === "ar"
            ? `${visible.length} مشروع`
            : lang === "en"
              ? `${visible.length} project${visible.length !== 1 ? "s" : ""}`
              : `${visible.length} projet${visible.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Lightbox vidéo */}
      {activeVideo && (
        <VideoLightbox
          video={activeVideo}
          catLabel={getCatLabel(activeVideo.category)}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </section>
  );
}
