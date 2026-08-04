import { getDisplayName, getPrezzoGiornaliero } from "@/lib/veicolo-utils";
import type { CategoriaPubblica, VeicoloPubblico } from "@/types/veicolo";

export interface VoceListino {
  nome: string;
  slug: string;
  importo: number;
  valuta: string;
}

export interface SezioneListino {
  categoria: CategoriaPubblica;
  prezzoMinimo: number | null;
  valuta: string;
  voci: VoceListino[];
}

export function buildListinoPrezzi(
  veicoli: VeicoloPubblico[],
  categorie: CategoriaPubblica[],
): SezioneListino[] {
  const categorieOrdinate = [...categorie].sort(
    (a, b) => (a.ordine ?? 0) - (b.ordine ?? 0),
  );

  return categorieOrdinate
    .map((categoria) => {
      const voci = veicoli
        .filter((veicolo) => veicolo.categoria?.slug === categoria.slug)
        .map((veicolo) => {
          const prezzo = getPrezzoGiornaliero(veicolo);
          if (!prezzo) return null;
          return {
            nome: getDisplayName(veicolo),
            slug: veicolo.slug,
            importo: prezzo.importo,
            valuta: prezzo.valuta,
          };
        })
        .filter((voce): voce is VoceListino => voce !== null)
        .sort((a, b) => a.importo - b.importo);

      const importi = voci.map((voce) => voce.importo);

      return {
        categoria,
        prezzoMinimo: importi.length ? Math.min(...importi) : null,
        valuta: voci[0]?.valuta ?? "EUR",
        voci,
      };
    })
    .filter((sezione) => sezione.voci.length > 0);
}

export function formatEuro(importo: number, valuta = "EUR"): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: valuta,
    maximumFractionDigits: 0,
  }).format(importo);
}
