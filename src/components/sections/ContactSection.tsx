import { ContactForm } from "@/components/sections/ContactForm";
import { Send } from "lucide-react";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-gold/10 bg-navy py-24 md:py-32"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.35em] text-gold">
              <Send className="size-3.5" strokeWidth={1.5} aria-hidden />
              Contact
            </p>
            <h2
              id="contact-heading"
              className="font-serif text-3xl font-semibold text-cream md:text-4xl"
            >
              Parlons de votre projet
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-cream/70">
              Brief, délais, ton souhaité : décrivez votre besoin et je vous réponds rapidement
              avec une proposition adaptée.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
