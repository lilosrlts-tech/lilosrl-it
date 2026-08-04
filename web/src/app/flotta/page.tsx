import type { Metadata } from "next";
import Link from "next/link";
import { FlottaHub } from "@/components/flotta/FlottaHub";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import { buildFlottaJsonLd } from "@/lib/json-ld";
import { getPageMetadata } from "@/lib/seo-settings";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { WhatsAppCtaLink } from "@/components/shared/WhatsAppCtaLink";
import { getPublishedVeicoli } from "@/lib/veicoli";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("flotta");
}

export default async function FlottaIndexPage() {
  const [veicoli, impostazioni] = await Promise.all([
    getPublishedVeicoli(),
    loadImpostazioni(),
  ]);
  const jsonLd = buildFlottaJsonLd(veicoli);

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
                Flotta
              </li>
            </ol>
          </nav>

          <header className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              La nostra flotta
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-slate-600">
              Scegli la categoria più adatta: auto, pulmini 9 posti e furgoni da piccoli a XL.
              Ritiro in sede a Trieste, tariffe trasparenti per ogni tipologia di mezzo.
            </p>
          </header>

          {veicoli.length === 0 ? (
            <p className="mt-10 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              Nessun veicolo disponibile al momento. Contattaci al{" "}
              <PhoneLink
                phone={impostazioni.telefono_noleggio}
                className="font-semibold text-brand-600"
              >
                {impostazioni.telefono_noleggio}
              </PhoneLink>{" "}
              per informazioni.
            </p>
          ) : (
            <FlottaHub veicoli={veicoli} />
          )}

          <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Non sai quale furgone ti serve?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Indica cosa trasporti (frigo, armadio, trasloco, moto…) e ti proponiamo i mezzi più
              adatti in base a volume, altezza vano e portata. Oppure scrivici su WhatsApp o chiama
              la sede in {impostazioni.indirizzo_noleggio}, Trieste.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <WhatsAppCtaLink
                phone={impostazioni.telefono_noleggio}
                message="Ciao, non so quale furgone mi serve — potete consigliarmi?"
              >
                WhatsApp
              </WhatsAppCtaLink>
              <Link
                href="/cosa-trasporti"
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Cosa trasporti?
              </Link>
              <PhoneLink
                phone={impostazioni.telefono_noleggio}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Chiama {impostazioni.telefono_noleggio}
              </PhoneLink>
            </div>
          </section>
        </main>
      </SitePageWrapper>
    </>
  );
}
