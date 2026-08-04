import type { Metadata } from "next";
import Link from "next/link";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import { getPageMetadata } from "@/lib/seo-settings";
import { COMPANY } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("cookie-policy");
}

export default async function CookiePolicyPage() {
  const impostazioni = await loadImpostazioni();

  return (
    <SitePageWrapper impostazioni={impostazioni}>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Note legali</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Cookie Policy</h1>
        <p className="mt-4 leading-relaxed text-slate-600">
          Questo sito utilizza cookie tecnici e, previo consenso, cookie analitici o di profilazione
          per migliorare l&apos;esperienza di navigazione su {COMPANY.name}.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Cosa sono i cookie</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              I cookie sono piccoli file di testo salvati sul dispositivo dell&apos;utente quando visita
              un sito web. Possono essere di sessione o persistenti.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Cookie utilizzati</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Utilizziamo cookie tecnici necessari al funzionamento del sito e, se accettati tramite
              il banner di consenso, cookie di terze parti per statistiche o marketing (es. Google
              Analytics, mappe, widget social).
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Gestione del consenso</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Al primo accesso viene mostrato un banner per scegliere il livello di privacy
              (Privato, Equilibrato o Personalizzato). Puoi modificare le preferenze in qualsiasi
              momento dal link &quot;Preferenze cookie&quot; in fondo alla pagina, oppure
              contattando {impostazioni.email_contatto}.
            </p>
          </section>
        </div>

        <p className="mt-10 text-sm text-slate-500">
          Per il trattamento dei dati personali consulta la{" "}
          <Link href="/privacy" className="text-brand-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </main>
    </SitePageWrapper>
  );
}
