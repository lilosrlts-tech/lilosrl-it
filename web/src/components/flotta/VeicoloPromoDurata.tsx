import type { PrezzoConPromo } from "@/lib/promozioni-durata";

interface VeicoloPromoDurataProps {
  prezzo: Pick<PrezzoConPromo, "giornaliero" | "daGiorno" | "promoAttiva" | "regole">;
}

/** Elenco regole sconto durata attive sulla scheda. */
export function VeicoloPromoDurata({ prezzo }: VeicoloPromoDurataProps) {
  if (!prezzo.promoAttiva || prezzo.regole.length === 0) return null;

  return (
    <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
      <h2 className="text-lg font-semibold text-slate-900">Promozioni durata</h2>
      <p className="mt-1 text-sm text-slate-600">
        Su questo veicolo si applicano le agevolazioni per noleggi più lunghi. La tariffa
        giornaliera resta quella di listino; sotto trovi l’equivalente giornaliero con lo sconto
        durata (es. noleggio mensile).
      </p>
      <ul className="mt-4 space-y-2">
        {prezzo.regole.map((r) => {
          const factor =
            r.tipo === "paga_giorni" && r.giorni_a_pagamento
              ? r.giorni_a_pagamento / r.giorni_minimo
              : r.tipo === "percentuale" && r.sconto_percentuale
                ? 1 - Number(r.sconto_percentuale) / 100
                : 1;
          const eq = Math.round(prezzo.giornaliero * factor * 100) / 100;
          return (
            <li
              key={r.id}
              className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm"
            >
              <p className="font-semibold text-slate-900">
                {r.descrizione_pubblica || r.nome}
              </p>
              <p className="mt-0.5 text-slate-600">
                Equivalente circa €{eq.toFixed(2)}/giorno
                {r.giorni_minimo ? ` (da ${r.giorni_minimo} giorni)` : ""}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
