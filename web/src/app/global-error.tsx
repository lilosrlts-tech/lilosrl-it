"use client";

import { useEffect } from "react";
import { COMPANY } from "@/lib/constants";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="it">
      <body className="font-sans">
        <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">Errore</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Servizio temporaneamente non disponibile</h1>
          <p className="mt-3 text-slate-600">
            {COMPANY.name} — riprova tra poco oppure chiama {COMPANY.phone}.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Riprova
          </button>
        </main>
      </body>
    </html>
  );
}
