import Link from "next/link";
import type { SezioneListino } from "@/lib/listino-prezzi";
import { formatEuro } from "@/lib/listino-prezzi";
import { flottaCategoriaHref } from "@/lib/nav-config";

interface TariffeListProps {
  sezioni: SezioneListino[];
}

export function TariffeList({ sezioni }: TariffeListProps) {
  if (!sezioni.length) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
        Nessuna tariffa pubblicata al momento. Contattaci per un preventivo personalizzato.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {sezioni.map((sezione) => (
        <section
          key={sezione.categoria.id}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{sezione.categoria.nome}</h2>
              {sezione.prezzoMinimo != null && (
                <p className="mt-1 text-sm text-slate-600">
                  A partire da{" "}
                  <span className="font-semibold text-[#D4AF37]">
                    {formatEuro(sezione.prezzoMinimo, sezione.valuta)}
                  </span>{" "}
                  / giorno
                </p>
              )}
            </div>
            <Link
              href={flottaCategoriaHref(sezione.categoria.slug)}
              className="text-sm font-semibold text-brand-600 hover:underline"
            >
              Vedi veicoli
            </Link>
          </div>

          <ul className="divide-y divide-slate-100">
            {sezione.voci.map((voce) => (
              <li
                key={voce.slug}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <Link
                    href={`/flotta/${voce.slug}`}
                    className="font-medium text-slate-900 hover:text-brand-600"
                  >
                    {voce.nome}
                  </Link>
                  <p className="text-sm text-slate-500">Tariffa giornaliera di partenza</p>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {formatEuro(voce.importo, voce.valuta)}
                  <span className="ml-1 text-sm font-normal text-slate-500">/ giorno</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-sm leading-relaxed text-slate-500">
        I prezzi sono aggiornati automaticamente dalla flotta pubblicata. Weekend, settimane
        lunghe e periodi speciali possono avere tariffe diverse: contattaci per un preventivo
        preciso.
      </p>
    </div>
  );
}
