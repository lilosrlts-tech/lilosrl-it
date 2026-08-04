import {
  hasPromoDurataSconto,
  labelPromoDurataSecondario,
} from "@/lib/promozioni-durata";
import { getPrezzoCommercialNote, getPrezzoGiornaliero } from "@/lib/veicolo-utils";
import type { VeicoloPubblico } from "@/types/veicolo";

interface VeicoloPrezzoBlockProps {
  veicolo: VeicoloPubblico;
  /** "card" = card flotta; "compact" = anteprima home */
  variant?: "card" | "compact";
}

export function VeicoloPrezzoBlock({ veicolo, variant = "card" }: VeicoloPrezzoBlockProps) {
  const listino = getPrezzoGiornaliero(veicolo);
  const promo = veicolo.prezzo_promo;
  const nota = getPrezzoCommercialNote(veicolo);

  if (!listino && !promo) {
    return (
      <p className="text-sm font-medium text-slate-500">Prezzo su richiesta</p>
    );
  }

  const giornaliero = promo?.giornaliero ?? listino!.importo;
  const promoLine = promo ? labelPromoDurataSecondario(promo) : null;
  const showPromo = promo ? hasPromoDurataSconto(promo) : false;

  const importo = String(Math.round(giornaliero));

  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Tariffa giornaliera
      </p>
      <p
        className={
          variant === "card"
            ? "text-3xl font-extrabold leading-none tracking-tight text-brand-700"
            : "text-2xl font-extrabold leading-none tracking-tight text-slate-900"
        }
      >
        € {importo}
        <span className="text-base font-semibold text-slate-600"> / giorno</span>
      </p>
      {showPromo && promoLine && (
        <p className="mt-1 text-xs text-emerald-700">{promoLine}</p>
      )}
      {nota && (
        <p className="mt-1.5 max-w-[16rem] text-xs leading-snug text-slate-500">{nota}</p>
      )}
    </div>
  );
}
