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
      className="scroll-mt-20 border-t border-luxury-gold/10 bg-luxury-bg py-24 md:py-32"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-luxury-gold">
            {s.label}
          </p>
          <h2
            id="services-heading"
            className="mt-4 font-serif text-3xl font-medium tracking-tight text-luxury-text md:text-4xl"
          >
            {s.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-luxury-text/55 md:text-base">
            {s.description}
          </p>
        </header>

        <ul className="mt-16 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <li
                key={item.title}
                className="group flex flex-col gap-5 rounded-2xl border border-white/[0.06] bg-midnight/80 p-7 shadow-[inset_0_1px_0_rgba(240,246,255,0.04)] transition-all duration-300 hover:border-luxury-gold/20 hover:bg-midnight-soft hover:shadow-gold-glow"
              >
                <div className="flex size-11 items-center justify-center rounded-lg border border-[#B8922A]/20 bg-[#B8922A]/8 transition-colors group-hover:border-[#B8922A]/35 group-hover:bg-[#B8922A]/12">
                  <Icon
                    className="size-5 text-[#B8922A]"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-luxury-text">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-luxury-text/55">
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
