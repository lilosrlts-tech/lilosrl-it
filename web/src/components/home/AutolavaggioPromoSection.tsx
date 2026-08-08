import Link from "next/link";
import { GOLD_TEXT } from "@/lib/nav-config";

const AUTOLAVAGGIO_IMAGE = "/images/staff-autolavaggio-lilo-trieste.webp";
const AUTOLAVAGGIO_IMAGE_WIDTH = 1024;
const AUTOLAVAGGIO_IMAGE_HEIGHT = 576;

const SERVIZI = [
  "Tunnel di ultima generazione",
  "Specialità lavaggio Full Tappezzeria",
  "Igienizzazione profonda con Ozono e Vapore",
  "Sistema a riciclo d'acqua ecologico",
] as const;

export function AutolavaggioPromoSection() {
  return (
    <section
      className="border-y border-slate-200 bg-gradient-to-br from-white via-slate-50/80 to-brand-50/30 py-16 sm:py-20"
      aria-labelledby="autolavaggio-promo-heading"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2 lg:gap-14">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm"
            style={{ color: GOLD_TEXT }}
          >
            Servizi LILO
          </p>
          <h2
            id="autolavaggio-promo-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Autolavaggio professionale a Trieste
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Oltre al noleggio, LILO S.r.l. offre un autolavaggio completo con tecnologie
            all&apos;avanguardia: cura del veicolo, igiene certificata e rispetto per
            l&apos;ambiente.
          </p>

          <ul className="mt-6 space-y-3">
            {SERVIZI.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-700">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium leading-relaxed sm:text-base">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/autolavaggio"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Scopri i Servizi di Lavaggio
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 ring-1 ring-slate-100">
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AUTOLAVAGGIO_IMAGE}
                alt="Team e Staff Autolavaggio Professionale Lilo SRL Trieste"
                width={AUTOLAVAGGIO_IMAGE_WIDTH}
                height={AUTOLAVAGGIO_IMAGE_HEIGHT}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                  LILO Autolavaggio
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  Via Schiaparelli 21/A — Trieste
                </p>
              </div>
            </div>
          </div>
          <div
            className="pointer-events-none absolute -right-3 -top-3 hidden h-24 w-24 rounded-full border-2 border-[#D4AF37]/30 sm:block"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
