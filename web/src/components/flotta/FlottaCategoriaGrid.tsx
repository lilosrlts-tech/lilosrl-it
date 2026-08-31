import { VeicoloCard } from "@/components/flotta/VeicoloCard";
import type { VeicoloPubblico } from "@/types/veicolo";

interface FlottaCategoriaGridProps {
  veicoli: VeicoloPubblico[];
}

/** Larghezze card: 1 / 2 / 3 colonne, ultima riga centrata. */
const CARD_SHELL =
  "flex w-full max-w-md sm:max-w-none sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]";

export function FlottaCategoriaGrid({ veicoli }: FlottaCategoriaGridProps) {
  if (veicoli.length === 0) {
    return (
      <p className="mt-10 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
        Nessun modello in catalogo in questa categoria al momento. Contattaci per informazioni
        su alternative e date di noleggio.
      </p>
    );
  }

  return (
    <>
      <p className="mt-6 text-sm text-slate-500" aria-live="polite">
        {veicoli.length === 1
          ? "1 modello in catalogo"
          : `${veicoli.length} modelli in catalogo`}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-6">
        {veicoli.map((veicolo) => (
          <div key={veicolo.id} className={CARD_SHELL}>
            <div className="w-full">
              <VeicoloCard veicolo={veicolo} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
