import type { Metadata } from "next";
import Link from "next/link";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { WhatsAppCtaLink } from "@/components/shared/WhatsAppCtaLink";
import { VeicoloFaq } from "@/components/flotta/VeicoloFaq";
import { resolveMetadataTitle } from "@/lib/metadata-title";
import { canonicalUrl } from "@/lib/seo";
import { COMPANY, SITE_URL } from "@/lib/constants";
import { NAP_NOLEGGIO_STREET } from "@/lib/nap";
import { pruneJsonLd } from "@/lib/json-ld";
import {
  PREZZO_IVA_DICITURA,
  TARIFFE_CATEGORIA,
} from "@/lib/tariffe-categoria";
import type { AiFaqItem } from "@/types/veicolo";

export const revalidate = 3600;

const META_TITLE = "Noleggio Auto a Trieste | LILO S.r.l.";
const prezzoDa = TARIFFE_CATEGORIA.auto.prezzoGiornaliero;
const META_DESCRIPTION = `Noleggio auto a Trieste con LILO: utilitarie e modelli per città e trasferta. Tariffe da €${prezzoDa}/giorno ${PREZZO_IVA_DICITURA}. Ritiro in ${NAP_NOLEGGIO_STREET}.`;

const FAQ: AiFaqItem[] = [
  {
    q: "Dove ritiro l’auto a Trieste?",
    a: `In sede LILO, ${NAP_NOLEGGIO_STREET}. Orari e mappa sulla pagina Contatti.`,
  },
  {
    q: "Quanto costa noleggiare un’auto?",
    a: `Il listino categoria auto parte da €${prezzoDa}/giorno (${PREZZO_IVA_DICITURA}). Il totale dipende da modello, durata e km: conferma in scheda o in sede.`,
  },
  {
    q: "Posso usare l’auto fuori Trieste?",
    a: "Sì, salvo diverse indicazioni in contratto. Ritiro e riconsegna restano in sede a Trieste.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const canonical = canonicalUrl("/noleggio-auto-trieste");
  return {
    title: resolveMetadataTitle(META_TITLE),
    description: META_DESCRIPTION,
    keywords: ["noleggio auto trieste", "affitto auto trieste", "LILO auto"],
    alternates: { canonical },
    openGraph: {
      title: META_TITLE,
      description: META_DESCRIPTION,
      url: canonical,
      type: "website",
      locale: "it_IT",
      siteName: "LILO S.r.l. — Autonoleggio Trieste",
      images: [{ url: `${SITE_URL}/logo-lilo.webp` }],
    },
    twitter: {
      card: "summary_large_image",
      title: META_TITLE,
      description: META_DESCRIPTION,
    },
  };
}

function buildJsonLd() {
  const url = canonicalUrl("/noleggio-auto-trieste");
  return pruneJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        name: META_TITLE,
        description: META_DESCRIPTION,
        url,
        isPartOf: { "@type": "WebSite", url: SITE_URL, name: COMPANY.name },
      },
      {
        "@type": "Service",
        name: "Noleggio auto a Trieste",
        provider: { "@type": "AutoRental", name: COMPANY.name, url: SITE_URL },
        areaServed: { "@type": "City", name: "Trieste" },
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inizio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Noleggio auto Trieste", item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  });
}

export default async function NoleggioAutoTriestePage() {
  const impostazioni = await loadImpostazioni();
  const jsonLd = buildJsonLd();
  const tel = impostazioni.telefono_noleggio;

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
              <li className="font-medium text-slate-800" aria-current="page">
                Noleggio auto Trieste
              </li>
            </ol>
          </nav>

          <header className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Noleggio auto a Trieste
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              {COMPANY.name} propone auto a noleggio per privati e professionisti a Trieste: ritiro
              in {NAP_NOLEGGIO_STREET}, tariffe giornaliere chiare e modelli adatti a città e
              trasferte.
            </p>
          </header>

          <section
            className="mt-8 max-w-3xl rounded-2xl border border-brand-100 bg-brand-50/60 p-5 sm:p-6"
            aria-labelledby="in-breve-auto"
          >
            <h2 id="in-breve-auto" className="text-sm font-bold uppercase tracking-wide text-brand-800">
              In breve
            </h2>
            <p className="mt-2 text-base leading-relaxed text-slate-800">
              Noleggio auto a Trieste con LILO: scegli il modello nella categoria Auto della flotta,
              confronta tariffa e km inclusi in scheda, poi richiedi preventivo. Listino da €
              {prezzoDa}/giorno ({PREZZO_IVA_DICITURA}); il prezzo definitivo dipende da durata e
              disponibilità.
            </p>
          </section>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/flotta/auto"
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Vedi le auto in flotta
            </Link>
            <Link
              href="/tariffe-noleggio-furgoni-trieste"
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Listino tariffe
            </Link>
            <WhatsAppCtaLink phone={tel} message="Ciao, vorrei info sul noleggio auto a Trieste.">
              WhatsApp
            </WhatsAppCtaLink>
            <PhoneLink
              phone={tel}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Chiama {tel}
            </PhoneLink>
          </div>

          <section className="mt-14 max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900">Perché noleggiare un’auto con LILO</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
              <li>Ritiro e riconsegna in sede a Trieste</li>
              <li>Tariffe di categoria pubblicate (a partire da €{prezzoDa}/giorno)</li>
              <li>Preventivo online dalla scheda veicolo o via telefono/WhatsApp</li>
            </ul>
            <p className="mt-4 text-slate-700">
              I dettagli di ogni modello (posti, alimentazione, prezzo) sono solo nelle schede flotta:
              questa pagina non duplica il catalogo.
            </p>
          </section>

          <section className="mt-14 max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900">Come procedere</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-700">
              <li>
                Apri{" "}
                <Link href="/flotta/auto" className="font-medium text-brand-700 hover:underline">
                  /flotta/auto
                </Link>{" "}
                e confronta i modelli in catalogo.
              </li>
              <li>Controlla cauzione e km inclusi nella scheda o nel listino.</li>
              <li>Richiedi preventivo con le date di ritiro e riconsegna.</li>
            </ol>
          </section>

          <div className="mt-12 max-w-3xl">
            <VeicoloFaq items={FAQ} />
          </div>

          <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Pronto a prenotare?</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/flotta/auto"
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Scegli un’auto
              </Link>
              <Link
                href="/contatti"
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Contatti
              </Link>
            </div>
          </section>
        </main>
      </SitePageWrapper>
    </>
  );
}
