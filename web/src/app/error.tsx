"use client";

import { useEffect } from "react";
import Link from "next/link";
import { COMPANY } from "@/lib/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error.digest ?? error.message);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Errore</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Qualcosa è andato storto</h1>
      <p className="mt-3 text-slate-600">
        Si è verificato un problema temporaneo sul sito di {COMPANY.name}. Puoi riprovare o
        tornare alla flotta.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Riprova
        </button>
        <Link
          href="/flotta"
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Vedi la flotta
        </Link>
        <Link
          href="/contatti"
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Contatti
        </Link>
      </div>
    </main>
  );
}
