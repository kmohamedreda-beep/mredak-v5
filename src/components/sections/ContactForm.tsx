"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { t } = useLanguage();
  const f = t.contact.form;

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
      if (!res.ok) throw new Error();
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
        <div>
          <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-widest text-cream/55">
            {f.name}
          </label>
          <input
            id="name" name="name" type="text" required autoComplete="name"
            className="w-full border border-gold/15 bg-navy/60 px-4 py-3 text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-cream/55">
            {f.email}
          </label>
          <input
            id="email" name="email" type="email" required autoComplete="email"
            className="w-full border border-gold/15 bg-navy/60 px-4 py-3 text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-xs uppercase tracking-widest text-cream/55">
          {f.project_type}
        </label>
        <select
          id="subject" name="subject" required defaultValue=""
          className="w-full border border-gold/15 bg-navy/60 px-4 py-3 text-cream outline-none transition-colors focus:border-gold"
        >
          <option value="" disabled>{f.project_placeholder}</option>
          <option value="publicite">{f.projects.ads}</option>
          <option value="documentaire">{f.projects.documentary}</option>
          <option value="institutionnel">{f.projects.corporate}</option>
          <option value="autre">{f.projects.other}</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-widest text-cream/55">
          {f.message}
        </label>
        <textarea
          id="message" name="message" required rows={5}
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
              {f.sending}
            </>
          ) : (
            f.submit
          )}
        </button>

        {status === "success" && (
          <p className="inline-flex items-center gap-2 text-sm text-gold">
            <CheckCircle2 className="size-4" aria-hidden />
            {f.success}
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-400">{f.error}</p>
        )}
      </div>
    </form>
  );
}
