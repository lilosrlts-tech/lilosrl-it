import type { Metadata } from "next";
import Link from "next/link";
import { TariffeList } from "@/components/tariffe/TariffeList";
import { buildListinoPrezzi } from "@/lib/listino-prezzi";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import { getPageMetadata } from "@/lib/seo-settings";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { getActiveCategorie, getPublishedVeicoli } from "@/lib/veicoli";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("tariffe");
}

export default async function TariffePage() {
  const [impostazioni, veicoli, categorie] = await Promise.all([
    loadImpostazioni(),
    getPublishedVeicoli(),
    getActiveCategorie(),
  ]);

  const sezioni = buildListinoPrezzi(veicoli, categorie);

  return (
    <SitePageWrapper impostazioni={impostazioni}>
      <main className="mx-auto max-w-4xl px-4 py-12">
        <header className="max-w-3xl">
          <h1 className="text-3xl font-bold text-slate-900">Prezzi e Tariffe</h1>
          <p className="mt-4 leading-relaxed text-slate-600">
            Listino generato automaticamente dalle tariffe giornaliere dei veicoli presenti in
            flotta. Tutti i prezzi sono IVA inclusa. Quando aggiorni un prezzo in gestione, questa
            pagina si aggiorna da sola.
          </p>
        </header>

        <div className="mt-8">
          <TariffeList sezioni={sezioni} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/flotta"
            className="rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-slate-900 hover:opacity-90"
          >
            Vedi la flotta
          </Link>
          <Link
            href="/contatti"
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Richiedi preventivo
          </Link>
          <PhoneLink
            phone={impostazioni.telefono_noleggio}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Chiama {impostazioni.telefono_noleggio}
          </PhoneLink>
        </div>
      </main>
    </SitePageWrapper>
  );
}
