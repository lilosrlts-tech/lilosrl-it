import type { Metadata } from "next";
import Link from "next/link";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import { getAllGuides } from "@/lib/guide";
import { resolveMetadataTitle } from "@/lib/metadata-title";
import { canonicalUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { pruneJsonLd } from "@/lib/json-ld";

export const revalidate = 3600;

const META_TITLE = "Guide noleggio furgoni e traslochi | LILO Trieste";
const META_DESCRIPTION =
  "Guide pratiche LILO: quale furgone scegliere, costi a Trieste, patente, metri cubi e trasporto elettrodomestici. Risposte chiare e link alla flotta.";

export async function generateMetadata(): Promise<Metadata> {
  const canonical = canonicalUrl("/guide");
  return {
    title: resolveMetadataTitle(META_TITLE),
    description: META_DESCRIPTION,
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

function buildGuideHubJsonLd(guides: ReturnType<typeof getAllGuides>) {
  return pruneJsonLd({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: META_TITLE,
    description: META_DESCRIPTION,
    url: canonicalUrl("/guide"),
    isPartOf: { "@type": "WebSite", name: "LILO S.r.l.", url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: guides.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: g.title,
        url: canonicalUrl(`/guide/${g.slug}`),
      })),
    },
  });
}

export default async function GuideHubPage() {
  const [impostazioni, guides] = await Promise.all([
    loadImpostazioni(),
    Promise.resolve(getAllGuides()),
  ]);
  const jsonLd = buildGuideHubJsonLd(guides);

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
                Guide
              </li>
            </ol>
          </nav>

          <header className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Guide al noleggio
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-slate-600">
              Risposte dirette su traslochi, costi, patente e scelta del furgone a Trieste — con
              collegamenti alla flotta e al preventivo LILO.
            </p>
          </header>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guide/${g.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                >
                  <h2 className="text-lg font-semibold text-slate-900">{g.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {g.inBreve}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-brand-700">Leggi la guida →</span>
                </Link>
              </li>
            ))}
          </ul>

          <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Pronto a scegliere il mezzo?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Usa il wizard carico, esplora le categorie o richiedi un preventivo.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/cosa-trasporti"
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Cosa trasporti?
              </Link>
              <Link
                href="/noleggio-furgoni-trieste"
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Noleggio furgoni Trieste
              </Link>
              <Link
                href="/flotta"
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Flotta
              </Link>
            </div>
          </section>
        </main>
      </SitePageWrapper>
    </>
  );
}
