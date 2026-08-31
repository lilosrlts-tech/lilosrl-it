import type { Metadata } from "next";
import Link from "next/link";
import { CosaTrasportiSection } from "@/components/wizard/CosaTrasportiSection";
import { CosaTrasportiScenariHub } from "@/components/wizard/CosaTrasportiScenariHub";
import { VeicoloFaq } from "@/components/flotta/VeicoloFaq";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import { COSA_TRASPORTI_FAQ } from "@/lib/cosa-trasporti";
import { buildCosaTrasportiJsonLd } from "@/lib/json-ld";
import { resolveMetadataTitle } from "@/lib/metadata-title";
import { canonicalUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import type { AiFaqItem } from "@/types/veicolo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const META_TITLE = "Cosa trasporti? Furgone giusto a Trieste | LILO";
const META_DESCRIPTION =
  "Frigo, armadio, trasloco o moto? Il wizard LILO confronta volume, altezza vano e portata della flotta a Trieste e ti propone i furgoni più adatti.";

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = `${SITE_URL}/images/veicoli/ford-transit-gg551rd-noleggio-furgoni-grandi-trieste.webp`;
  const canonical = canonicalUrl("/cosa-trasporti");
  return {
    title: resolveMetadataTitle(META_TITLE),
    description: META_DESCRIPTION,
    keywords: [
      "furgone per frigorifero trieste",
      "furgone per armadio noleggio",
      "furgone trasloco trieste",
      "furgone per moto noleggio trieste",
      "quale furgone noleggiare",
      "LILO Trieste",
    ],
    alternates: { canonical },
    openGraph: {
      title: META_TITLE,
      description: META_DESCRIPTION,
      url: canonical,
      type: "website",
      locale: "it_IT",
      siteName: "LILO S.r.l. — Autonoleggio Trieste",
      images: [{ url: ogImage, width: 1200, height: 630, alt: META_TITLE }],
    },
    twitter: {
      card: "summary_large_image",
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: [ogImage],
    },
  };
}

export default async function CosaTrasportiPage() {
  const impostazioni = await loadImpostazioni();
  const faq: AiFaqItem[] = COSA_TRASPORTI_FAQ;
  const jsonLd = buildCosaTrasportiJsonLd(faq);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SitePageWrapper impostazioni={impostazioni}>
        <main>
          <div className="mx-auto max-w-6xl px-4 pt-10 sm:pt-12">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-1">
                <li>
                  <Link href="/" className="hover:text-brand-600">
                    Inizio
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-medium text-slate-800" aria-current="page">
                  Cosa trasporti?
                </li>
              </ol>
            </nav>
          </div>

          <CosaTrasportiSection showPageLink={false} headingLevel="h1" />

          <CosaTrasportiScenariHub />

          <div className="mx-auto max-w-6xl px-4 pb-14">
            <VeicoloFaq items={faq} />

            <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Preferisci parlare con noi?</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Il wizard è una guida basata sui dati di scheda. Per carichi particolari (pianoforti,
                macchinari, più viaggi) ti consigliamo di chiamare la sede.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/flotta"
                  className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Vedi tutta la flotta
                </Link>
                <Link
                  href="/noleggio-furgoni-trieste"
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Noleggio furgoni Trieste
                </Link>
                <Link
                  href="/guide"
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Guide
                </Link>
                <Link
                  href="/contatti"
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Contatti
                </Link>
              </div>
            </section>
          </div>
        </main>
      </SitePageWrapper>
    </>
  );
}
