import { Headphones, Radio, Volume2 } from "lucide-react";

const demos = [
  {
    id: "pub",
    title: "Publicité & marque",
    description: "Énergie maîtrisée, impact immédiat.",
    src: "/demos/demo-pub.mp3",
    icon: Volume2,
  },
  {
    id: "doc",
    title: "Documentaire & narration",
    description: "Clarté, présence, respiration.",
    src: "/demos/demo-doc.mp3",
    icon: Radio,
  },
  {
    id: "inst",
    title: "Institutionnel & corporate",
    description: "Autorité bienveillante, crédibilité.",
    src: "/demos/demo-inst.mp3",
    icon: Headphones,
  },
] as const;

export function AudioDemos() {
  return (
    <section
      id="demos"
      className="scroll-mt-20 border-t border-white/5 bg-midnight-soft py-24 md:py-32"
      aria-labelledby="demos-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="demos-heading"
            className="font-serif text-3xl font-medium text-paper md:text-4xl"
          >
            Trois univers, une même voix
          </h2>
          <p className="mt-4 text-muted">
            Sélectionnez une démo pour écouter. Placez vos fichiers MP3 dans{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-sm text-paper/90">
              public/demos/
            </code>{" "}
            avec les noms indiqués ci-dessous.
          </p>
        </div>
        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {demos.map((demo) => {
            const Icon = demo.icon;
            return (
              <li
                key={demo.id}
                className="flex flex-col border border-white/10 bg-ink/40 p-6 transition-colors hover:border-accent/30"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full border border-accent/40 text-accent">
                    <Icon className="size-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <h3 className="font-serif text-xl text-paper">{demo.title}</h3>
                </div>
                <p className="mb-6 flex-1 text-sm text-muted">{demo.description}</p>
                <audio controls className="w-full accent-accent" preload="metadata">
                  <source src={demo.src} type="audio/mpeg" />
                  Votre navigateur ne prend pas en charge la lecture audio.
                </audio>
                <p className="mt-2 truncate text-xs text-muted/80" title={demo.src}>
                  {demo.src}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
