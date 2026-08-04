"use client";

import Link from "next/link";
import {
  Banknote,
  Clock,
  CreditCard,
  Flame,
  Navigation,
  Phone,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { PromoWeekendGallery } from "@/components/offerte/PromoWeekendGallery";
import {
  OFFERTA_PROMO_CATEGORIA_HREF,
  OFFERTA_PROMO_CATEGORIA_LABEL,
} from "@/lib/offerta-promo";

const LIME = "#84CC16";

const BULLETS: {
  Icon: LucideIcon;
  title: string;
  text: string;
}[] = [
  {
    Icon: Truck,
    title: "Solo Furgoni grandi uso città (L2H2)",
    text: "Promo riservata alla categoria Furgoni grandi (uso città): circa 10–11,5 m³, ideale per traslochi urbani a Trieste.",
  },
  {
    Icon: Clock,
    title: "Formula 48 Ore Reali",
    text: "Ritiro Sabato ore 08:30 → Riconsegna Lunedì ore 08:30 (pagamento effettivo di sole 36h tariffarie!).",
  },
  {
    Icon: Banknote,
    title: "Prezzo Trasparente",
    text: "83€ compresa IVA al 22% (nessun costo nascosto al rientro).",
  },
  {
    Icon: Navigation,
    title: "75 KM inclusi",
    text: "Perfetti per fare più viaggi in città e provincia di Trieste (Politica Carburante: Pieno su Pieno).",
  },
  {
    Icon: CreditCard,
    title: "Nessuna Carta di Credito richiesta",
    text: "Noleggi anche con carta di debito o deposito in contanti.",
  },
];

interface PromoWeekendCardProps {
  phone: string;
}

export function PromoWeekendCard({ phone }: PromoWeekendCardProps) {
  return (
    <article
      className="relative overflow-hidden rounded-3xl border-2 border-lime-400/50 bg-slate-900 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.65)] ring-1 ring-white/10"
      aria-labelledby="promo-weekend-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 14% 16%, #84CC16 0%, transparent 40%), radial-gradient(circle at 90% 6%, #ffffff 0%, transparent 26%)",
        }}
        aria-hidden="true"
      />

      <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <div className="relative min-h-[420px] overflow-hidden sm:min-h-[520px] lg:min-h-0">
          <PromoWeekendGallery />
        </div>

        <div className="relative flex flex-col gap-5 p-5 pb-8 sm:p-7 sm:pb-10 lg:p-8 lg:pb-10">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-lime-400">
              <Flame className="h-3.5 w-3.5 shrink-0" aria-hidden="true" strokeWidth={2.25} />
              Offerta del mese · Solo {OFFERTA_PROMO_CATEGORIA_LABEL}
            </p>
            <h2
              id="promo-weekend-heading"
              className="mt-3 text-balance text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl"
            >
              Devi traslocare o fare lavori nel weekend? Paghi 1 giorno e mezzo e tieni il
              furgone 48 ore!
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-200 sm:text-lg">
              Promo valida esclusivamente sui{" "}
              <strong className="font-semibold text-white">{OFFERTA_PROMO_CATEGORIA_LABEL}</strong>{" "}
              (configurazione L2H2) dalle{" "}
              <strong className="font-semibold text-white">08:30 di Sabato</strong> alle{" "}
              <strong className="font-semibold text-white">08:30 di Lunedì</strong>: tutto a soli{" "}
              <span
                className="inline-block rounded-md px-2 py-0.5 font-bold text-slate-950"
                style={{ backgroundColor: LIME }}
              >
                83€ IVA inclusa
              </span>
            </p>
          </div>

          <ul className="space-y-3">
            {BULLETS.map(({ Icon, title, text }) => (
              <li
                key={title}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
              >
                <span
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-lime-500/20 bg-lime-500/10 text-lime-400"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-lime-400 sm:text-base">{title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-300">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-3 pt-1">
            <PhoneLink
              phone={phone}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-center text-sm font-extrabold uppercase tracking-wide text-slate-950 shadow-lg transition hover:brightness-110 sm:text-base"
              style={{ backgroundColor: LIME }}
            >
              <Phone className="h-5 w-5 shrink-0" aria-hidden="true" strokeWidth={2.25} />
              Prenota ora la Promo Weekend
            </PhoneLink>
            <Link
              href={OFFERTA_PROMO_CATEGORIA_HREF}
              className="inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Vedi i {OFFERTA_PROMO_CATEGORIA_LABEL} →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
