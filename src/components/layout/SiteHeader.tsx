import Link from "next/link";
import { Mic2 } from "lucide-react";

const nav = [
  { href: "#demos", label: "Démos" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gold/15 bg-navy/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3 no-underline">
          <Mic2 className="size-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden />
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-base font-semibold tracking-wide text-gold transition-colors group-hover:text-gold-light sm:text-lg">
              MOHAMMED REDA KHIAR
            </span>
            <span className="text-[10px] font-sans tracking-[0.28em] text-cream/70 uppercase">
              Voix-off professionnelle
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-8" aria-label="Navigation principale">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium uppercase tracking-[0.2em] text-cream/70 transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
