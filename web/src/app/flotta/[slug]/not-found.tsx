import type { Metadata } from "next";
import Link from "next/link";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";

export const metadata: Metadata = {
  title: "Veicolo non trovato",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const impostazioni = await loadImpostazioni();

  return (
    <SitePageWrapper impostazioni={impostazioni}>
      <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Veicolo non trovato
        </h1>
        <p className="mt-3 text-slate-600">
          Il mezzo richiesto non è disponibile o non è più in flotta.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/flotta"
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Torna alla flotta
          </Link>
          <Link
            href="/contatti"
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Contatti
          </Link>
        </div>
      </main>
    </SitePageWrapper>
  );
}
