import type { VeicoloPubblico } from "@/types/veicolo";
import {
  getLocalFleetImageFallback,
  resolveVeicoloCoverUrl,
} from "@/lib/fleet-image-url";
import {
  getPromozioniDurataAttive,
  resolvePrezzoConPromo,
  type PrezzoConPromo,
} from "@/lib/promozioni-durata";
import {
  getNotaKmInclusi,
  getTariffaPerVeicolo,
} from "@/lib/tariffe-categoria";
import { getVeicoloFotoAlt } from "@/lib/veicolo-seo";
import type { FotoPubblica } from "@/types/veicolo";

export interface PrezzoGiornaliero {
  importo: number;
  valuta: string;
}

export function getPrezzoGiornaliero(veicolo: VeicoloPubblico): PrezzoGiornaliero | null {
  const tariffa = getTariffaPerVeicolo(veicolo);
  if (tariffa) {
    return { importo: tariffa.prezzoGiornaliero, valuta: "EUR" };
  }

  const prezzo = veicolo.prezzi.find((p) => p.tipo_tariffa === "giornaliero");
  if (!prezzo) return null;
  return { importo: prezzo.importo, valuta: prezzo.valuta };
}

/** Listino giornaliero; lo sconto durata resta informativo sotto il prezzo. */
export async function getPrezzoConPromoForVeicolo(
  veicolo: VeicoloPubblico,
): Promise<PrezzoConPromo | null> {
  const base = getPrezzoGiornaliero(veicolo);
  if (!base) return null;
  const regole =
    veicolo.promo_durata_attiva === false ? [] : await getPromozioniDurataAttive();
  return resolvePrezzoConPromo(
    base.importo,
    base.valuta,
    veicolo.promo_durata_attiva !== false,
    regole,
  );
}

const NOTA_TARIFFA_GENERICA = /tariffa\s+giornaliera/i;

/** Dettaglio commerciale sotto il prezzo giornaliero (km inclusi, assicurazione, ecc.). */
export function getPrezzoCommercialNote(veicolo: VeicoloPubblico): string | null {
  const tariffa = getTariffaPerVeicolo(veicolo);
  if (tariffa) return getNotaKmInclusi(tariffa);

  const prezzo = veicolo.prezzi.find((p) => p.tipo_tariffa === "giornaliero");
  if (!prezzo) return null;

  const descrizione = prezzo.descrizione?.trim();
  if (
    descrizione &&
    !NOTA_TARIFFA_GENERICA.test(descrizione) &&
    /km|assicuraz|inclus|ottimizzat/i.test(descrizione)
  ) {
    return descrizione;
  }

  return null;
}

export function getVeicoloFormTitle(veicolo: VeicoloPubblico): string {
  return `${veicolo.marca} ${veicolo.modello}${veicolo.versione ? ` ${veicolo.versione}` : ""}`.trim();
}

export function getDisplayName(veicolo: VeicoloPubblico): string {
  return (
    veicolo.titolo_pubblico ??
    `${veicolo.marca} ${veicolo.modello}${veicolo.versione ? ` ${veicolo.versione}` : ""}`
  );
}

export function getCoverImage(veicolo: VeicoloPubblico): string | null {
  return resolveVeicoloCoverUrl(veicolo);
}

const M3_PATTERN = /\d+([,.]\d+)?\s*m[³3]|metri cubi/i;

export function getVeicoloCardSpec(veicolo: VeicoloPubblico): string {
  const volume =
    veicolo.specifiche_tecniche.volume_metri_cubi ?? veicolo.specifiche_tecniche.volume_carico_mc;
  if (volume != null) {
    const formatted = Number.isInteger(volume)
      ? String(volume)
      : volume.toFixed(2).replace(/\.?0+$/, "").replace(".", ",");
    return `${formatted} m³`;
  }

  const volumeHighlight = veicolo.ai_highlights.find((h) => M3_PATTERN.test(h));
  if (volumeHighlight) return volumeHighlight;

  const catLabel = veicolo.categoria?.nome?.toLowerCase() ?? "";
  const isFurgone = /furgon/i.test(catLabel) || /furgon/i.test(veicolo.categoria?.slug ?? "");

  if (veicolo.posti && veicolo.posti >= 5 && !isFurgone) {
    return `${veicolo.posti} posti`;
  }

  if (isFurgone) {
    const parts = [veicolo.alimentazione, veicolo.cambio].filter(Boolean);
    if (parts.length > 0) return parts.join(" · ");
  }

  if (veicolo.posti) return `${veicolo.posti} posti`;
  if (veicolo.alimentazione) return veicolo.alimentazione;

  return veicolo.descrizione_breve?.slice(0, 80) ?? "";
}

export type VeicoloPlaceholderVariant = "auto" | "pulmino" | "furgone";

export function getVeicoloImageVariant(veicolo: VeicoloPubblico): VeicoloPlaceholderVariant {
  const slug = veicolo.categoria?.slug ?? "";
  const nome = veicolo.categoria?.nome?.toLowerCase() ?? "";
  if (slug === "auto" || nome === "auto") return "auto";
  if (slug.includes("pulmin") || nome.includes("pulmin")) return "pulmino";
  return "furgone";
}

export function getVeicoloCoverUrl(veicolo: VeicoloPubblico): string | null {
  return resolveVeicoloCoverUrl(veicolo);
}

export function getVeicoloCoverFallbackUrl(veicolo: VeicoloPubblico): string | null {
  return getLocalFleetImageFallback(veicolo.slug, veicolo.categoria?.slug);
}

export function getVeicoloImageAlt(veicolo: VeicoloPubblico, foto?: FotoPubblica | null): string {
  const cover =
    foto ??
    veicolo.foto.find((f) => f.is_copertina) ??
    veicolo.foto[0] ??
    null;
  return getVeicoloFotoAlt(veicolo, cover);
}

/** @deprecated Usare getVeicoloImageAlt */
export function getVeicoloCoverAlt(veicolo: VeicoloPubblico): string {
  return getVeicoloImageAlt(veicolo);
}

/** Badge unità flotta (solo se > 1). */
export function getUnitaDisponibiliLabel(veicolo: VeicoloPubblico): string | null {
  const n = veicolo.unita_disponibili ?? 1;
  if (n <= 1) return null;
  return `${n} unità disponibili`;
}

/** Badge sintetici in stile siti noleggio: carburante, cambio, patente se presente. */
export function getVeicoloCardBadges(veicolo: VeicoloPubblico): string[] {
  const badges: string[] = [];
  if (veicolo.alimentazione) badges.push(veicolo.alimentazione);
  if (veicolo.cambio) badges.push(veicolo.cambio);

  const patente = veicolo.ai_highlights.find((h) => /patente/i.test(h));
  if (patente) badges.push(patente);

  return badges.slice(0, 3);
}
