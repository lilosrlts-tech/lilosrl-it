import Link from "next/link";
import { FlottaCategoriaGrid } from "@/components/flotta/FlottaCategoriaGrid";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { WhatsAppCtaLink } from "@/components/shared/WhatsAppCtaLink";
import { SeoLongContentSections } from "@/components/shared/SeoLongContentSections";
import {
  FLOTTA_CATEGORIA_COPY,
  getFlottaCategoriaNavLabel,
  getFlottaCategoriaTariffaNote,
} from "@/lib/flotta-categoria-config";
import { FLOTTA_CATEGORIA_LONG_CONTENT } from "@/lib/seo-page-content";
import { buildFlottaCategoriaJsonLd } from "@/lib/json-ld";
import { isOffertaPromoCategoria } from "@/lib/offerta-promo";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import {
  PREZZO_IVA_DICITURA,
  type TariffaCategoriaSlug,
} from "@/lib/tariffe-categoria";
import { getPublishedVeicoli } from "@/lib/veicoli";

interface FlottaCategoriaPageProps {
  slug: TariffaCategoriaSlug;
}

export async function FlottaCategoriaPage({ slug }: FlottaCategoriaPageProps) {
  const [veicoli, impostazioni] = await Promise.all([getPublishedVeicoli(), loadImpostazioni()]);
  const filtrati = veicoli.filter((veicolo) => veicolo.categoria?.slug === slug);
  const copy = FLOTTA_CATEGORIA_COPY[slug];
  const label = getFlottaCategoriaNavLabel(slug);
  const tariffa = getFlottaCategoriaTariffaNote(slug);
  const jsonLd = buildFlottaCategoriaJsonLd(slug, filtrati);
  const isUsoCitta = slug === "furgoni-grandi-citta";
  const showOffertaPromo = isOffertaPromoCategoria(slug) && impostazioni.offerta_attiva;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SitePageWrapper impostazioni={impostazioni}>
        <main className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/" className="hover:text-brand-600">
                  Inizio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/flotta" className="hover:text-brand-600">
                  Flotta
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-slate-800" aria-current="page">
                {label}
              </li>
            </ol>
          </nav>

          <header className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {label}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-slate-600">{copy.pageIntro}</p>
          </header>

          {showOffertaPromo && (
            <aside className="mt-6 rounded-2xl border-2 border-lime-400/60 bg-slate-900 p-5 text-white shadow-sm sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
                Offerta del mese · Promo Weekend
              </p>
              <p className="mt-2 text-base font-semibold leading-snug sm:text-lg">
                Solo su questa categoria: dal sabato 08:30 al lunedì 08:30 a 83€ IVA inclusa
                (48 ore, 75 km).
              </p>
              <Link
                href="/offerte-noleggio-furgoni-trieste"
                className="mt-4 inline-flex rounded-full bg-[#84CC16] px-5 py-2.5 text-sm font-extrabold uppercase tracking-wide text-slate-950 hover:brightness-110"
              >
                Vedi l’offerta →
              </Link>
            </aside>
          )}

          <section
            className={`mt-8 rounded-2xl border p-5 shadow-sm ${
              isUsoCitta
                ? "border-brand-200 bg-brand-50/60"
                : "border-slate-200 bg-white"
            }`}
            aria-label="Tariffa di categoria"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tariffa di categoria
                </p>
                <p className="mt-1 text-3xl font-extrabold text-slate-900">
                  € {tariffa.prezzo}
                  <span className="text-lg font-semibold text-slate-600"> / giorno</span>
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {PREZZO_IVA_DICITURA}
                </p>
              </div>
              {isUsoCitta && (
                <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  Solo uso città Trieste
                </span>
              )}
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700">
              <li>{tariffa.km}</li>
              <li>{tariffa.cauzione}</li>
            </ul>
          </section>

          <FlottaCategoriaGrid veicoli={filtrati} />

          <SeoLongContentSections
            content={FLOTTA_CATEGORIA_LONG_CONTENT[slug]}
            idPrefix={`flotta-${slug}`}
          />

          <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Hai bisogno di aiuto nella scelta?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Il nostro team ti consiglia il mezzo più adatto. Ritiro in sede a{" "}
              {impostazioni.indirizzo_noleggio}, Trieste.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <WhatsAppCtaLink
                phone={impostazioni.telefono_noleggio}
                message={`Ciao, vorrei aiuto nella scelta: categoria ${label}.`}
              >
                WhatsApp
              </WhatsAppCtaLink>
              <PhoneLink
                phone={impostazioni.telefono_noleggio}
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Chiama {impostazioni.telefono_noleggio}
              </PhoneLink>
              <Link
                href="/flotta"
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Tutte le categorie
              </Link>
            </div>
          </section>
        </main>
      </SitePageWrapper>
    </>
  );
}
