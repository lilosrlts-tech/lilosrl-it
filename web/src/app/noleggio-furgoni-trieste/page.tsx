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
  type TariffaCategoriaSlug,
} from "@/lib/tariffe-categoria";
import { flottaCategoriaHref } from "@/lib/nav-config";
import type { AiFaqItem } from "@/types/veicolo";

export const revalidate = 3600;

const META_TITLE = "Noleggio Furgoni a Trieste | LILO S.r.l.";
const META_DESCRIPTION = `Noleggio furgoni a Trieste con LILO: piccoli, medi, grandi, uso città e XL. Tariffe da €${TARIFFE_CATEGORIA["furgoni-piccoli"].prezzoGiornaliero}/giorno ${PREZZO_IVA_DICITURA}. Ritiro in ${NAP_NOLEGGIO_STREET}.`;

const CATEGORIE_FURGONI: Array<{
  slug: TariffaCategoriaSlug;
  uso: string;
}> = [
  { slug: "furgoni-piccoli", uso: "Consegne urbane, scatoloni, trasporti leggeri" },
  { slug: "furgoni-medi", uso: "Elettrodomestici, piccoli traslochi, lavori" },
  { slug: "furgoni-grandi-citta", uso: "Buon volume con tariffa uso città" },
  { slug: "furgoni-grandi", uso: "Traslochi e carichi voluminosi" },
  { slug: "furgoni-xl", uso: "Massima capacità per grandi volumi" },
];

const FAQ: AiFaqItem[] = [
  {
    q: "Dove ritiro il furgone a Trieste?",
    a: `In sede LILO, ${NAP_NOLEGGIO_STREET}. Orari e contatti sono sulla pagina Contatti.`,
  },
  {
    q: "I prezzi includono l’IVA?",
    a: `Le tariffe di listino sul sito sono ${PREZZO_IVA_DICITURA}. Il totale dipende da durata, km e categoria.`,
  },
  {
    q: "Come scelgo la categoria giusta?",
    a: "Usa il wizard Cosa trasporti? oppure le guide LILO. In dubbio, confronta i m³ in scheda o chiamaci.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const canonical = canonicalUrl("/noleggio-furgoni-trieste");
  return {
    title: resolveMetadataTitle(META_TITLE),
    description: META_DESCRIPTION,
    keywords: [
      "noleggio furgoni trieste",
      "affitto furgone trieste",
      "furgone a noleggio trieste",
      "LILO furgoni",
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

function buildPilastroJsonLd() {
  const url = canonicalUrl("/noleggio-furgoni-trieste");
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
        name: "Noleggio furgoni a Trieste",
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
            name: "Noleggio furgoni Trieste",
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

export default async function NoleggioFurgoniTriestePage() {
  const impostazioni = await loadImpostazioni();
  const jsonLd = buildPilastroJsonLd();
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
                Noleggio furgoni Trieste
              </li>
            </ol>
          </nav>

          <header className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Noleggio furgoni a Trieste
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              {COMPANY.name} offre furgoni a noleggio per privati e aziende a Trieste: ritiro in{" "}
              {NAP_NOLEGGIO_STREET}, tariffe chiare e flotta suddivisa per volume di carico.
            </p>
          </header>

          <section
            className="mt-8 max-w-3xl rounded-2xl border border-brand-100 bg-brand-50/60 p-5 sm:p-6"
            aria-labelledby="in-breve-furgoni"
          >
            <h2 id="in-breve-furgoni" className="text-sm font-bold uppercase tracking-wide text-brand-800">
              In breve
            </h2>
            <p className="mt-2 text-base leading-relaxed text-slate-800">
              Noleggio furgoni a Trieste: LILO propone categorie da piccolo a XL per traslochi,
              trasporto mobili, elettrodomestici, moto e consegne. La scelta dipende da volume,
              peso e dimensioni del carico. I prezzi di listino partono da €
              {TARIFFE_CATEGORIA["furgoni-piccoli"].prezzoGiornaliero}/giorno (
              {PREZZO_IVA_DICITURA}); il totale va confermato su date e modello.
            </p>
          </section>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/flotta"
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Scopri la flotta
            </Link>
            <Link
              href="/cosa-trasporti"
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Cosa trasporti?
            </Link>
            <WhatsAppCtaLink phone={tel} message="Ciao, vorrei info sul noleggio furgoni a Trieste.">
              WhatsApp
            </WhatsAppCtaLink>
            <PhoneLink
              phone={tel}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Chiama {tel}
            </PhoneLink>
          </div>

          <section className="mt-14" aria-labelledby="categorie-heading">
            <h2 id="categorie-heading" className="text-2xl font-bold text-slate-900">
              Categorie in catalogo
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Ogni categoria ha una pagina flotta con modelli, foto e dati di scheda. Qui trovi solo
              l’orientamento e il prezzo di listino a partire da.
            </p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Categoria</th>
                    <th className="px-4 py-3 font-semibold">Uso tipico</th>
                    <th className="px-4 py-3 font-semibold">Da (€/giorno)</th>
                    <th className="px-4 py-3 font-semibold"> </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CATEGORIE_FURGONI.map(({ slug, uso }) => {
                    const t = TARIFFE_CATEGORIA[slug];
                    return (
                      <tr key={slug}>
                        <td className="px-4 py-3 font-medium text-slate-900">{t.label}</td>
                        <td className="px-4 py-3 text-slate-600">{uso}</td>
                        <td className="px-4 py-3 text-slate-900">
                          €{t.prezzoGiornaliero}
                          <span className="mt-0.5 block text-xs font-normal text-slate-500">
                            {PREZZO_IVA_DICITURA}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={flottaCategoriaHref(slug)}
                            className="font-semibold text-brand-700 hover:underline"
                          >
                            Vedi mezzi
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Prezzi di categoria a partire da — conferma sempre in scheda veicolo o in sede.
            </p>
          </section>

          <section className="mt-14 max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900">Come scegliere</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-700">
              <li>
                Indica cosa trasporti con il{" "}
                <Link href="/cosa-trasporti" className="font-medium text-brand-700 hover:underline">
                  wizard Cosa trasporti?
                </Link>
                .
              </li>
              <li>
                Confronta i modelli nella{" "}
                <Link href="/flotta" className="font-medium text-brand-700 hover:underline">
                  flotta
                </Link>{" "}
                (volume e altezza vano quando pubblicati).
              </li>
              <li>
                Controlla il{" "}
                <Link
                  href="/tariffe-noleggio-furgoni-trieste"
                  className="font-medium text-brand-700 hover:underline"
                >
                  listino
                </Link>{" "}
                e richiedi preventivo dalla scheda o via WhatsApp/telefono.
              </li>
            </ol>
            <p className="mt-4 text-slate-700">
              Approfondimenti:{" "}
              <Link href="/guide" className="font-medium text-brand-700 hover:underline">
                guide al noleggio
              </Link>
              .
            </p>
          </section>

          <div className="mt-12 max-w-3xl">
            <VeicoloFaq items={FAQ} />
          </div>

          <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Prenota o chiedi info</h2>
            <p className="mt-2 text-sm text-slate-600">
              Scegli un veicolo in flotta per il form preventivo, oppure contattaci direttamente.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/flotta/furgoni-medi"
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Parti dai furgoni medi
              </Link>
              <Link
                href="/contatti"
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Contatti e mappa
              </Link>
            </div>
          </section>
        </main>
      </SitePageWrapper>
    </>
  );
}
