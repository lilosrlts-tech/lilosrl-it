import { SedeCard } from "@/components/shared/SedeCard";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { AUTOLAVAGGIO_URL } from "@/lib/nav-config";
import { SEDE_AUTOLAVAGGIO } from "@/lib/sedi";
import type { ImpostazioniSito } from "@/types/impostazioni";

interface AutolavaggioContentProps {
  impostazioni: ImpostazioniSito;
}

/**
 * Ponte anti-cannibalismo: NAP + CTA verso il sito dedicato autolavaggiolilo.it.
 * I contenuti commerciali del lavaggio vivono sul sito gemello, non qui.
 */
export function AutolavaggioContent({ impostazioni }: AutolavaggioContentProps) {
  const telefono =
    impostazioni.telefono_autolavaggio || SEDE_AUTOLAVAGGIO.telefono;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
        Servizi LILO
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Autolavaggio a Trieste</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-700">
        LILO S.r.l. gestisce anche un autolavaggio professionale a Trieste (sede distinta dal
        noleggio). Servizi, listino e prenotazioni sono sul sito dedicato{" "}
        <a
          href={AUTOLAVAGGIO_URL}
          className="font-semibold text-brand-700 underline-offset-2 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          autolavaggiolilo.it
        </a>
        .
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={AUTOLAVAGGIO_URL}
          className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          rel="noopener noreferrer"
          target="_blank"
        >
          Vai al sito Autolavaggio
          <span className="ml-2" aria-hidden="true">
            →
          </span>
        </a>
        <PhoneLink
          phone={telefono}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          Chiama {telefono}
        </PhoneLink>
      </div>

      <div className="mt-10">
        <SedeCard
          sede={{
            ...SEDE_AUTOLAVAGGIO,
            ctaHref: AUTOLAVAGGIO_URL,
            ctaLabel: "Apri autolavaggiolilo.it",
          }}
          mapHeightClass="h-[360px] lg:h-full lg:min-h-[440px]"
          showCta
        />
      </div>

      <section className="mt-8 rounded-2xl border border-brand-100 bg-brand-50 p-6">
        <h2 className="font-semibold text-brand-900">Contatti sede lavaggio</h2>
        <p className="mt-2 text-slate-700">{SEDE_AUTOLAVAGGIO.indirizzo}</p>
        {SEDE_AUTOLAVAGGIO.indirizzoNota ? (
          <p className="mt-1 text-sm text-slate-600">{SEDE_AUTOLAVAGGIO.indirizzoNota}</p>
        ) : null}
        <p className="mt-3">
          <PhoneLink
            phone={telefono}
            className="text-xl font-bold text-brand-700 hover:underline"
          >
            {telefono}
          </PhoneLink>
        </p>
        <p className="mt-2">
          <a
            href={`mailto:${impostazioni.email_contatto}`}
            className="text-brand-600 hover:underline"
          >
            {impostazioni.email_contatto}
          </a>
        </p>
        <p className="mt-4 text-sm text-slate-600">
          Per listino servizi e dettagli operativi usa il sito{" "}
          <a
            href={AUTOLAVAGGIO_URL}
            className="font-medium text-brand-700 underline-offset-2 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            www.autolavaggiolilo.it
          </a>
          . Questo sito (lilosrl.it) è dedicato al noleggio auto e furgoni.
        </p>
      </section>
    </div>
  );
}
