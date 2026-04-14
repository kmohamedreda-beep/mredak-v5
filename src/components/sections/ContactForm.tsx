"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gold/20 bg-navy-dark/40 p-8 shadow-[inset_0_1px_0_rgba(197,160,89,0.06)] backdrop-blur-md md:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-widest text-cream/55">
            Nom
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full border border-gold/15 bg-navy/60 px-4 py-3 text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-cream/55">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full border border-gold/15 bg-navy/60 px-4 py-3 text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-2 block text-xs uppercase tracking-widest text-cream/55">
          Type de projet
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full border border-gold/15 bg-navy/60 px-4 py-3 text-cream outline-none transition-colors focus:border-gold"
          defaultValue=""
        >
          <option value="" disabled>
            Choisir…
          </option>
          <option value="publicite">Publicité</option>
          <option value="documentaire">Documentaire / narration</option>
          <option value="institutionnel">Institutionnel / corporate</option>
          <option value="autre">Autre</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-widest text-cream/55">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full resize-y border border-gold/15 bg-navy/60 px-4 py-3 text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 border border-gold bg-gold px-8 py-3.5 text-sm font-medium uppercase tracking-[0.15em] text-navy transition-opacity hover:bg-gold-light hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Envoi…
            </>
          ) : (
            "Envoyer"
          )}
        </button>
        {status === "success" && (
          <p className="inline-flex items-center gap-2 text-sm text-gold">
            <CheckCircle2 className="size-4" aria-hidden />
            Message reçu. Je vous recontacte bientôt.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-400">Impossible d&apos;envoyer pour le moment.</p>
        )}
      </div>
    </form>
  );
}
