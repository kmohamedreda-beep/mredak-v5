"use client";

import {
  Megaphone,
  Building2,
  GraduationCap,
  Heart,
  Film,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const ICONS: LucideIcon[] = [
  Megaphone,
  Building2,
  GraduationCap,
  Heart,
  Film,
  Gamepad2,
];

export function Services() {
  const { t } = useLanguage();
  const s = t.services;

  return (
    <section
      id="services"
      className="scroll-mt-20 border-t border-gold/10 bg-navy py-24 md:py-32"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-gold">
            {s.label}
          </p>
          <h2
            id="services-heading"
            className="mt-4 font-serif text-3xl font-medium tracking-tight text-cream md:text-4xl"
          >
            {s.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-cream/60 md:text-base">
            {s.description}
          </p>
        </header>

        <ul className="mt-16 grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <li
                key={item.title}
                className="group flex flex-col gap-5 rounded-xl border border-white/8 bg-midnight p-7 transition-all duration-300 hover:border-gold/25 hover:bg-midnight-soft hover:shadow-[var(--shadow-gold-glow)]"
              >
                <div className="flex size-11 items-center justify-center rounded-lg border border-gold/20 bg-gold/8 text-gold transition-colors group-hover:border-gold/40 group-hover:bg-gold/12">
                  <Icon className="size-5" strokeWidth={1.5} aria-hidden />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-cream">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/60">
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
