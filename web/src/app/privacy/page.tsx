import type { Metadata } from "next";
import Link from "next/link";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import { getPageMetadata } from "@/lib/seo-settings";
import { COMPANY } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("privacy");
}

export default async function PrivacyPage() {
  const impostazioni = await loadImpostazioni();

  return (
    <SitePageWrapper impostazioni={impostazioni}>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Note legali</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-4 leading-relaxed text-slate-600">
          {COMPANY.legalName} (P.IVA {COMPANY.vatNumber}) tratta i dati personali nel rispetto del
          Regolamento UE 2016/679 (GDPR) e della normativa italiana vigente.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Titolare del trattamento</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              {COMPANY.legalName}, con sede in {impostazioni.indirizzo_noleggio}. Email:{" "}
              {impostazioni.email_contatto}.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Dati raccolti</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Raccogliamo dati forniti volontariamente tramite form di contatto e richiesta preventivo
              (nome, email, telefono, messaggio), oltre a dati tecnici di navigazione tramite cookie.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Finalità e base giuridica</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              I dati sono utilizzati per rispondere alle richieste, gestire i contratti di noleggio e
              migliorare i servizi. La base giuridica è l&apos;esecuzione di misure precontrattuali, il
              contratto o il legittimo interesse.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Diritti dell&apos;interessato</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Puoi richiedere accesso, rettifica, cancellazione, limitazione, portabilità e opposizione
              scrivendo a {impostazioni.email_contatto}. Hai diritto di proporre reclamo al Garante
              Privacy.
            </p>
          </section>
        </div>

        <p className="mt-10 text-sm text-slate-500">
          Vedi anche{" "}
          <Link href="/cookie-policy" className="text-brand-600 hover:underline">
            Cookie Policy
          </Link>{" "}
          e{" "}
          <Link href="/termini-condizioni" className="text-brand-600 hover:underline">
            Termini e Condizioni
          </Link>
          .
        </p>
      </main>
    </SitePageWrapper>
  );
}
