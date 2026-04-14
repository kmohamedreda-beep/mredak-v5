import { Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-gold/10 bg-navy-dark py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-cream/55">
          © {new Date().getFullYear()} Mohamed Reda Khiar — Voix off professionnelle
        </p>
        <a
          href="mailto:contact@example.com"
          className="inline-flex items-center gap-2 text-sm text-cream/80 transition-colors hover:text-gold"
        >
          <Mail className="size-4 text-gold/90" strokeWidth={1.5} aria-hidden />
          contact@example.com
        </a>
      </div>
    </footer>
  );
}
