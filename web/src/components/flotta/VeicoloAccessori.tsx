import { formatAccessorioPrezzo } from "@/lib/accessori";
import type { AccessorioPubblico } from "@/types/veicolo";

interface VeicoloAccessoriProps {
  accessori: AccessorioPubblico[];
}

export function VeicoloAccessori({ accessori }: VeicoloAccessoriProps) {
  if (!accessori.length) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Opzioni noleggio / Extra</h2>
      <p className="mt-1 text-sm text-slate-500">
        Accessori disponibili su richiesta. Prezzi al giorno, IVA esclusa.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-3 font-semibold">Extra</th>
              <th className="py-2 pr-3 font-semibold">Totale</th>
              <th className="py-2 font-semibold">Deposito</th>
            </tr>
          </thead>
          <tbody>
            {accessori.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 last:border-0">
                <td className="py-3 pr-3">
                  <p className="font-medium text-slate-900">{item.nome}</p>
                  {item.descrizione && (
                    <p className="text-xs text-slate-500">{item.descrizione}</p>
                  )}
                </td>
                <td className="py-3 pr-3 whitespace-nowrap text-slate-800">
                  {formatAccessorioPrezzo(item.prezzo_giornaliero)}
                </td>
                <td className="py-3 text-slate-600">
                  {item.deposito_richiesto && item.deposito != null
                    ? formatAccessorioPrezzo(item.deposito)
                    : "Non richiesto"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
