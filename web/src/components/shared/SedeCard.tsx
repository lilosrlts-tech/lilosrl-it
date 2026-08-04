import Link from "next/link";
import type { SedeOperativa } from "@/lib/sedi";
import { googleMapsEmbedUrl, googleMapsLink } from "@/lib/maps";
import { OrariList } from "@/components/shared/OrariList";
import { PhoneLink } from "@/components/shared/PhoneLink";

interface SedeCardProps {
  sede: SedeOperativa;
  /** Altezza iframe mappa. */
  mapHeightClass?: string;
  /** Mostra CTA secondaria (flotta / autolavaggio). Default true. */
  showCta?: boolean;
}

/**
 * Card sede uniforme: info a sinistra, mappa Google a destra.
 * Stessa struttura per Noleggio e Autolavaggio.
 */
export function SedeCard({
  sede,
  mapHeightClass = "h-[320px] lg:h-full lg:min-h-[360px]",
  showCta = true,
}: SedeCardProps) {
  const mapsHref = googleMapsLink(sede.mapsQuery, sede.mapsLabel);
  const mapsEmbed = googleMapsEmbedUrl(sede.mapsQuery);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col p-6 sm:p-8">
          <h3 className="text-lg font-bold text-brand-700 sm:text-xl">{sede.titolo}</h3>

          <p className="mt-3 text-slate-900">{sede.indirizzo}</p>
          {sede.indirizzoNota ? (
            <p className="mt-1 text-sm text-slate-600">{sede.indirizzoNota}</p>
          ) : null}

          <p className="mt-3">
            <PhoneLink
              phone={sede.telefono}
              className="text-lg font-bold text-brand-700 hover:underline"
            >
              {sede.telefono}
            </PhoneLink>
          </p>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Servizi disponibili
          </p>
          <ul className="mt-2 space-y-2">
            {sede.servizi.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-700 sm:text-base">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Orari di apertura
          </p>
          <OrariList righe={[...sede.orariRighe]} />

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Apri in Google Maps
            </a>
            {showCta && sede.ctaHref && sede.ctaLabel ? (
              <Link
                href={sede.ctaHref}
                className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {sede.ctaLabel} →
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative min-h-[280px] border-t border-slate-200 lg:border-l lg:border-t-0">
          <iframe
            title={`Mappa ${sede.titolo}`}
            src={mapsEmbed}
            className={`w-full border-0 ${mapHeightClass}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </article>
  );
}
