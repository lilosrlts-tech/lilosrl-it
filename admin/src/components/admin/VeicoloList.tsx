"use client";

import type { VeicoloDettaglio } from "@/types/database";

interface VeicoloListProps {
  veicoli: VeicoloDettaglio[];
  selectedId?: string | null;
  onSelect: (veicolo: VeicoloDettaglio) => void;
  onDeactivate: (veicolo: VeicoloDettaglio) => void;
  onDelete: (veicolo: VeicoloDettaglio) => void;
  onReactivate: (veicolo: VeicoloDettaglio) => void;
}

function prezzoGiornaliero(veicolo: VeicoloDettaglio): string {
  const prezzo = veicolo.prezzi?.find((p) => p.tipo_tariffa === "giornaliero" && p.attivo);
  return prezzo ? `€ ${Number(prezzo.importo).toFixed(2)}/giorno` : "—";
}

export function VeicoloList({
  veicoli,
  selectedId,
  onSelect,
  onDeactivate,
  onDelete,
  onReactivate,
}: VeicoloListProps) {
  if (veicoli.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Nessun veicolo in flotta. Aggiungi il primo automezzo dal form.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Veicolo</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Categoria</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Prezzo</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Stato</th>
            <th className="px-4 py-3 text-right font-medium text-slate-600">Azioni</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {veicoli.map((veicolo) => {
            const selected = veicolo.id === selectedId;
            return (
              <tr
                key={veicolo.id}
                className={selected ? "bg-brand-50" : "hover:bg-slate-50"}
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelect(veicolo)}
                    className="text-left"
                  >
                    <div className="font-medium text-slate-900">
                      {veicolo.marca} {veicolo.modello}
                    </div>
                    <div className="text-xs text-slate-500">
                      {veicolo.targa} · {veicolo.slug}
                    </div>
                  </button>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {veicolo.categoria?.nome ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">{prezzoGiornaliero(veicolo)}</td>
                <td className="px-4 py-3">
                  {!veicolo.attivo ? (
                    <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      Non disponibile
                    </span>
                  ) : veicolo.pubblicato ? (
                    <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Online
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Bozza
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onSelect(veicolo)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-50"
                    >
                      Modifica
                    </button>
                    {veicolo.attivo ? (
                      <button
                        type="button"
                        onClick={() => onDeactivate(veicolo)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50"
                      >
                        Non disp.
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onReactivate(veicolo)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-50"
                      >
                        Riattiva
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(veicolo)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      Elimina
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
