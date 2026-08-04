import type { Metadata } from "next";
import Link from "next/link";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import { getPageMetadata } from "@/lib/seo-settings";
import { COMPANY } from "@/lib/constants";
import { PhoneLink } from "@/components/shared/PhoneLink";
import {
  CAUZIONE_USO_CITTA_NOTA,
  getElencoCauzioniLegale,
} from "@/lib/tariffe-categoria";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("termini-condizioni");
}

export default async function TerminiPage() {
  const impostazioni = await loadImpostazioni();
  const elencoCauzioni = getElencoCauzioniLegale();

  return (
    <SitePageWrapper impostazioni={impostazioni}>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Note legali</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Termini e Condizioni</h1>
        <p className="mt-4 leading-relaxed text-slate-600">
          Le presenti condizioni regolano l&apos;utilizzo del sito web e i servizi di noleggio veicoli
          offerti da {COMPANY.legalName} a Trieste e provincia.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Servizi di noleggio</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Il noleggio è soggetto a disponibilità del veicolo, verifica documenti e firma del
              contratto in sede. Le tariffe pubblicate sono indicative e possono variare per periodi
              speciali, weekend o lunghi noleggi.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Preventivi online</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Le richieste inviate dal sito non costituiscono prenotazione vincolante. {COMPANY.name}{" "}
              confermerà disponibilità, condizioni e importo finale via email o telefono (
              <PhoneLink
                phone={impostazioni.telefono_noleggio}
                className="font-semibold text-brand-600 hover:underline"
              >
                {impostazioni.telefono_noleggio}
              </PhoneLink>
              ).
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Cauzione e modalità di pagamento</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Al ritiro del veicolo è richiesta una cauzione, restituita a fine noleggio salvo danni,
              multe o altri addebiti previsti dal contratto. Le modalità accettate dipendono dalla
              categoria del mezzo e dall&apos;ambito del noleggio.
            </p>
            <ul className="mt-4 space-y-3">
              {elencoCauzioni.map((item) => (
                <li key={item.categoria} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="font-medium text-slate-900">{item.categoria}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.nota}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">{CAUZIONE_USO_CITTA_NOTA}</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Responsabilità</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Il cliente è responsabile del veicolo per tutta la durata del noleggio secondo quanto
              previsto dal contratto. È vietato l&apos;uso del sito per scopi illeciti o per invio di
              contenuti offensivi tramite i form di contatto.
            </p>
          </section>
        </div>

        <p className="mt-10 text-sm text-slate-500">
          <Link href="/privacy" className="text-brand-600 hover:underline">
            Privacy Policy
          </Link>{" "}
          ·{" "}
          <Link href="/cookie-policy" className="text-brand-600 hover:underline">
            Cookie Policy
          </Link>
        </p>
      </main>
    </SitePageWrapper>
  );
}
