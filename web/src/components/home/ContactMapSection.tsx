import Link from "next/link";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { COMPANY } from "@/lib/constants";
import type { ImpostazioniSito } from "@/types/impostazioni";

const PHONE = "040 2471720";

interface ContactMapSectionProps {
  impostazioni: ImpostazioniSito;
}

const CARD =
  "flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7";

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function WashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 3c-2.8 3.6-6 6.2-6 10.2A6 6 0 0 0 18 13.2C18 9.2 14.8 6.6 12 3z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 14.5c.8 1.2 2 2 3.5 2s2.7-.8 3.5-2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SedeBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
      {children}
    </span>
  );
}

export function ContactMapSection({ impostazioni: _impostazioni }: ContactMapSectionProps) {
  return (
    <section
      id="contatti"
      className="scroll-mt-20 border-y border-slate-200 bg-[#f8f9fa] py-16"
      aria-labelledby="sedi-home-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="sedi-home-heading" className="text-2xl font-bold text-slate-900">
              Le nostre sedi
            </h2>
            <p className="mt-1 text-slate-600">{COMPANY.marketingName}</p>
          </div>
          <Link href="/contatti" className="text-sm font-semibold text-brand-600 hover:underline">
            Contatti e mappe →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className={CARD}>
            <div className="flex items-center gap-3">
              <SedeBadge>
                <PinIcon />
              </SedeBadge>
              <h3 className="text-lg font-bold text-brand-700 sm:text-xl">Sede noleggio</h3>
            </div>
            <p className="mt-3 text-slate-900">Viale Campi Elisi 38/b, Trieste</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Lun–Ven 8:30–12:30 / 15:00–17:30
              <span className="mx-1.5 text-slate-300" aria-hidden="true">
                |
              </span>
              Sab 8:30–12:30
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Servizi
            </p>
            <p className="mt-1 text-sm text-slate-700">Furgoni (S–XL), Auto, Pulmini 9 Posti</p>

            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <PhoneLink
                phone={PHONE}
                aria-label={`Chiama sede noleggio al ${PHONE}`}
                className="inline-flex rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Chiama {PHONE}
              </PhoneLink>
              <Link
                href="/flotta"
                className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Vedi Flotta →
              </Link>
            </div>
          </article>

          <article className={CARD}>
            <div className="flex items-center gap-3">
              <SedeBadge>
                <WashIcon />
              </SedeBadge>
              <h3 className="text-lg font-bold text-brand-700 sm:text-xl">Sede autolavaggio</h3>
            </div>
            <p className="mt-3 text-slate-900">Via G. Schiaparelli 21/a, Trieste</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Lun–Sab 9:00–13:00 / 14:00–18:30
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Servizi
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Lavaggio Interni/Esterni, Sanificazione, Tappezzeria
            </p>

            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <PhoneLink
                phone={PHONE}
                aria-label={`Chiama sede autolavaggio al ${PHONE}`}
                className="inline-flex rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Chiama {PHONE}
              </PhoneLink>
              <Link
                href="/autolavaggio"
                className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Scopri i Servizi →
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
