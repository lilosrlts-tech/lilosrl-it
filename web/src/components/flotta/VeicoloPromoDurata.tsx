import { fraseRegolaDurata, type PrezzoConPromo } from "@/lib/promozioni-durata";

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
        giornaliera resta quella di listino.
      </p>
      <ul className="mt-4 space-y-2">
        {prezzo.regole.map((r) => (
          <li
            key={r.id}
            className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm"
          >
            <p className="font-semibold text-slate-900">
              {r.descrizione_pubblica || fraseRegolaDurata(r) || r.nome}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
