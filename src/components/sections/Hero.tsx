import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-navy pt-16"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgba(197,160,89,0.12),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.35em] text-gold">
          <Sparkles className="size-3.5" strokeWidth={1.5} aria-hidden />
          Voix off professionnelle
        </p>
        <h1
          id="hero-heading"
          className="font-serif text-4xl font-semibold leading-[1.12] tracking-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Mohamed Reda Khiar
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-cream/75 md:text-xl">
          Une voix posée, précise, qui habille vos images sans les écraser. Je donne à votre
          message le ton qu&apos;il mérite — publicité, narration, institutionnel — avec la même
          exigence qu&apos;au micro.
        </p>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#demos"
            className="border border-gold/40 bg-gold px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-navy transition-colors hover:border-gold-light hover:bg-gold-light"
          >
            Écouter les démos
          </a>
          <a
            href="#contact"
            className="border border-gold/35 px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:border-gold hover:text-gold"
          >
            Me contacter
          </a>
        </div>
      </div>
    </section>
  );
}
