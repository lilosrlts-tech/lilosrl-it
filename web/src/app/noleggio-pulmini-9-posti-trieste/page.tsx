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

const META_TITLE = "Noleggio Pulmini 9 Posti a Trieste | LILO S.r.l.";
const prezzoDa = TARIFFE_CATEGORIA["pulmini-9-posti"].prezzoGiornaliero;
const META_DESCRIPTION = `Noleggio pulmini 9 posti a Trieste con LILO: gruppi, eventi e trasferimenti. Tariffe da €${prezzoDa}/giorno ${PREZZO_IVA_DICITURA}. Ritiro in ${NAP_NOLEGGIO_STREET}.`;

const FAQ: AiFaqItem[] = [
  {
    q: "Quante persone entrano?",
    a: "Fino a 9 posti (conducente incluso). Verifica sempre la scheda del singolo pulmino per la configurazione esatta.",
  },
  {
    q: "Che patente serve?",
    a: "Per i pulmini 9 posti della flotta LILO è sufficiente la patente B, salvo diverse indicazioni di legge o del contratto. In dubbio, chiedi conferma in sede.",
  },
  {
    q: "Quanto costa?",
    a: `Il listino categoria parte da €${prezzoDa}/giorno (${PREZZO_IVA_DICITURA}). Cauzione e km inclusi sono indicati in scheda/categoria.`,
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const canonical = canonicalUrl("/noleggio-pulmini-9-posti-trieste");
  return {
    title: resolveMetadataTitle(META_TITLE),
    description: META_DESCRIPTION,
    keywords: [
      "noleggio pulmini 9 posti trieste",
      "noleggio minibus trieste",
      "LILO pulmini",
    ],
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
  const url = canonicalUrl("/noleggio-pulmini-9-posti-trieste");
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
        name: "Noleggio pulmini 9 posti a Trieste",
        provider: { "@type": "AutoRental", name: COMPANY.name, url: SITE_URL },
        areaServed: { "@type": "City", name: "Trieste" },
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inizio", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Noleggio pulmini 9 posti Trieste",
            item: url,
          },
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

export default async function NoleggioPulminiTriestePage() {
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
                Noleggio pulmini 9 posti Trieste
              </li>
            </ol>
          </nav>

          <header className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Noleggio pulmini 9 posti a Trieste
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              {COMPANY.name} offre pulmini fino a 9 posti per gruppi, eventi, transfer e
              trasferimenti aziendali a Trieste. Ritiro in {NAP_NOLEGGIO_STREET}.
            </p>
          </header>

          <section
            className="mt-8 max-w-3xl rounded-2xl border border-brand-100 bg-brand-50/60 p-5 sm:p-6"
            aria-labelledby="in-breve-pulmini"
          >
            <h2
              id="in-breve-pulmini"
              className="text-sm font-bold uppercase tracking-wide text-brand-800"
            >
              In breve
            </h2>
            <p className="mt-2 text-base leading-relaxed text-slate-800">
              Un pulmino 9 posti riduce costi e coordinamento rispetto a più auto. Confronta i
              modelli nella categoria flotta dedicata: listino da €{prezzoDa}/giorno (
              {PREZZO_IVA_DICITURA}). Per bagagli molto voluminosi valuta invece un furgone.
            </p>
          </section>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/flotta/pulmini-9-posti"
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Vedi i pulmini in flotta
            </Link>
            <Link
              href="/guide/che-patente-serve-per-furgone"
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Guida patente
            </Link>
            <WhatsAppCtaLink
              phone={tel}
              message="Ciao, vorrei info sul noleggio pulmini 9 posti a Trieste."
            >
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
            <h2 className="text-2xl font-bold text-slate-900">Quando conviene un pulmino</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
              <li>Gruppi fino a 9 persone (conducente incluso)</li>
              <li>Eventi, gite, transfer e spostamenti aziendali</li>
              <li>Un solo mezzo invece di più auto</li>
            </ul>
            <p className="mt-4 text-slate-700">
              Dotazioni e bagagli variano per modello: i dati sono in scheda. Questa landing non
              sostituisce la griglia flotta.
            </p>
          </section>

          <section className="mt-14 max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900">Come procedere</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-700">
              <li>
                Apri{" "}
                <Link
                  href="/flotta/pulmini-9-posti"
                  className="font-medium text-brand-700 hover:underline"
                >
                  /flotta/pulmini-9-posti
                </Link>
                .
              </li>
              <li>Verifica posti, tariffa e cauzione in scheda.</li>
              <li>Richiedi preventivo con le date di ritiro.</li>
            </ol>
          </section>

          <div className="mt-12 max-w-3xl">
            <VeicoloFaq items={FAQ} />
          </div>

          <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Prenota o chiedi info</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/flotta/pulmini-9-posti"
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Scegli un pulmino
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
