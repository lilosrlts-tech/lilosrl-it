import { getCoverImage, getDisplayName } from "@/lib/veicoli";
import { labelPromoDurataSecondario } from "@/lib/promozioni-durata";
import type { VeicoloPubblico } from "@/types/veicolo";

export type CosaTrasportiId =
  | "scatole-consegne"
  | "elettrodomestico"
  | "frigorifero"
  | "divano"
  | "armadio"
  | "moto"
  | "trasloco-monolocale"
  | "trasloco-bilocale"
  | "trasloco-trilocale";

export interface CosaTrasportiUseCase {
  id: CosaTrasportiId;
  label: string;
  descrizione: string;
  /** Volume minimo m³ (se noto in scheda) */
  volumeMin: number;
  /** Altezza vano minima mm (opzionale) */
  altezzaMinMm?: number;
  /** Preferenza categorie (ordine) */
  categoriePreferite: string[];
  perché: string;
}

export interface CosaTrasportiCandidate {
  slug: string;
  name: string;
  categoriaSlug: string | null;
  categoriaNome: string | null;
  volumeMc: number | null;
  portataKg: number | null;
  altezzaVanoMm: number | null;
  coverUrl: string | null;
  prezzoDa: number | null;
  /** Riga secondaria sconto durata (es. «Da €28/giorno con noleggio mensile»). */
  prezzoPromoLine: string | null;
  score: number;
  motivo: string;
}

export const COSA_TRASPORTI_USE_CASES: CosaTrasportiUseCase[] = [
  {
    id: "scatole-consegne",
    label: "Scatole e consegne",
    descrizione: "Piccoli trasporti urbani, scatoloni, attrezzatura leggera",
    volumeMin: 3,
    categoriePreferite: ["furgoni-piccoli", "furgoni-medi"],
    perché: "Serve un furgone compatto, agile in città, con circa 3–4 m³ di carico.",
  },
  {
    id: "elettrodomestico",
    label: "Lavatrice / forno",
    descrizione: "Elettrodomestici medi da trasportare in piedi",
    volumeMin: 5,
    altezzaMinMm: 1300,
    categoriePreferite: ["furgoni-medi", "furgoni-grandi"],
    perché: "Serve spazio e altezza sufficienti per elettrodomestici medi senza forzature.",
  },
  {
    id: "frigorifero",
    label: "Frigorifero",
    descrizione: "Frigo o freezer in piedi",
    volumeMin: 6,
    altezzaMinMm: 1400,
    categoriePreferite: ["furgoni-medi", "furgoni-grandi", "furgoni-grandi-citta"],
    perché: "Il frigo richiede vano alto e volume generoso: meglio un medio/grande.",
  },
  {
    id: "divano",
    label: "Divano / mobili",
    descrizione: "Divano, tavolo, mobili di casa",
    volumeMin: 6,
    categoriePreferite: ["furgoni-medi", "furgoni-grandi"],
    perché: "Per divani e mobili serve almeno un furgone medio (~5–6 m³ o più).",
  },
  {
    id: "armadio",
    label: "Armadio",
    descrizione: "Armadio alto o smontato in pezzi grandi",
    volumeMin: 8,
    altezzaMinMm: 1600,
    categoriePreferite: ["furgoni-grandi", "furgoni-grandi-citta", "furgoni-xl"],
    perché: "Un armadio chiede lunghezza e altezza: conviene un furgone grande.",
  },
  {
    id: "moto",
    label: "Moto / scooter",
    descrizione: "Trasporto moto — Fiat Ducato con rampa dedicata",
    volumeMin: 6,
    categoriePreferite: ["furgoni-grandi", "furgoni-medi", "furgoni-grandi-citta"],
    perché:
      "Il Fiat Ducato in flotta ha la rampa moto dedicata (alluminio antiscivolo); sugli altri furgoni la rampa è un extra a noleggio.",
  },
  {
    id: "trasloco-monolocale",
    label: "Trasloco monolocale",
    descrizione: "Mini trasloco / stanza singola",
    volumeMin: 8,
    categoriePreferite: ["furgoni-grandi", "furgoni-grandi-citta"],
    perché: "Per un monolocale di solito bastano circa 8–11 m³ di vano.",
  },
  {
    id: "trasloco-bilocale",
    label: "Trasloco bilocale",
    descrizione: "Trasloco appartamento 2 locali",
    volumeMin: 11,
    categoriePreferite: ["furgoni-grandi-citta", "furgoni-grandi", "furgoni-xl"],
    perché: "Un bilocale richiede volume ampio: grandi / XL.",
  },
  {
    id: "trasloco-trilocale",
    label: "Trasloco 3+ locali",
    descrizione: "Trasloco più voluminoso",
    volumeMin: 13,
    categoriePreferite: ["furgoni-xl", "furgoni-grandi"],
    perché: "Per 3+ locali serve un furgone XL con massimo volume di carico.",
  },
];

function volumeOf(v: VeicoloPubblico): number | null {
  return (
    v.specifiche_tecniche.volume_metri_cubi ??
    v.specifiche_tecniche.volume_carico_mc ??
    null
  );
}

function portataOf(v: VeicoloPubblico): number | null {
  return (
    v.specifiche_tecniche.portata_utile_kg ?? v.specifiche_tecniche.portata_kg ?? null
  );
}

function altezzaOf(v: VeicoloPubblico): number | null {
  return (
    v.specifiche_tecniche.altezza_vano_mm ?? v.specifiche_tecniche.vano_altezza_mm ?? null
  );
}

function scoreVeicolo(v: VeicoloPubblico, useCase: CosaTrasportiUseCase): number {
  const cat = v.categoria?.slug ?? "";
  if (!cat.startsWith("furgon")) return -1000;

  const vol = volumeOf(v);
  const h = altezzaOf(v);
  let score = 0;

  const pref = useCase.categoriePreferite.indexOf(cat);
  if (pref >= 0) score += 40 - pref * 8;
  else score -= 5;

  if (vol != null) {
    if (vol >= useCase.volumeMin) score += 30 + Math.min(vol - useCase.volumeMin, 5) * 2;
    else score -= (useCase.volumeMin - vol) * 8;
  } else {
    score -= 15;
  }

  if (useCase.altezzaMinMm != null) {
    if (h != null && h >= useCase.altezzaMinMm) score += 20;
    else if (h != null) score -= 25;
    else score -= 5;
  }

  // Preferisci non sovradimensionare troppo per usi piccoli
  if (useCase.volumeMin <= 4 && vol != null && vol > 8) score -= 10;

  // Moto: il Fiat Ducato ha la rampa dedicata — deve stare in cima
  if (useCase.id === "moto") {
    const slug = v.slug.toLowerCase();
    if (slug.includes("ducato")) score += 100;
    else if (slug.includes("movano")) score -= 40;
  }

  return score;
}

function motivoFor(v: VeicoloPubblico, useCase: CosaTrasportiUseCase): string {
  const parts: string[] = [];
  const vol = volumeOf(v);
  const h = altezzaOf(v);
  const p = portataOf(v);
  if (vol != null) parts.push(`vano circa ${String(vol).replace(".", ",")} m³`);
  if (h != null) parts.push(`altezza ${h} mm`);
  if (p != null) parts.push(`portata ${p} kg`);

  let base = useCase.perché;
  if (useCase.id === "moto" && v.slug.toLowerCase().includes("ducato")) {
    base =
      "Questo Fiat Ducato ha la rampa di carico moto dedicata in alluminio antiscivolo: è il mezzo indicato per trasportare motocicli.";
  }

  return parts.length ? `${base} Consigliato: ${parts.join(", ")}.` : base;
}

export function matchCosaTrasporti(
  veicoli: VeicoloPubblico[],
  useCaseId: CosaTrasportiId,
  limit = 2,
): CosaTrasportiCandidate[] {
  const useCase = COSA_TRASPORTI_USE_CASES.find((u) => u.id === useCaseId);
  if (!useCase) return [];

  return veicoli
    .map((v) => {
      const score = scoreVeicolo(v, useCase);
      return {
        slug: v.slug,
        name: getDisplayName(v),
        categoriaSlug: v.categoria?.slug ?? null,
        categoriaNome: v.categoria?.nome ?? null,
        volumeMc: volumeOf(v),
        portataKg: portataOf(v),
        altezzaVanoMm: altezzaOf(v),
        coverUrl: getCoverImage(v),
        prezzoDa:
          v.prezzo_promo?.giornaliero ??
          v.prezzi.find((p) => p.tipo_tariffa === "giornaliero")?.importo ??
          null,
        prezzoPromoLine: v.prezzo_promo ? labelPromoDurataSecondario(v.prezzo_promo) : null,
        score,
        motivo: motivoFor(v, useCase),
      } satisfies CosaTrasportiCandidate;
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Use case in cui il veicolo risulta un buon match (per JSON-LD / scheda). */
export function useCasesForVeicolo(veicolo: VeicoloPubblico): CosaTrasportiUseCase[] {
  return COSA_TRASPORTI_USE_CASES.filter((useCase) => scoreVeicolo(veicolo, useCase) >= 45);
}

export const COSA_TRASPORTI_FAQ: { q: string; a: string }[] = [
  {
    q: "Come scelgo il furgone giusto per il mio carico?",
    a: "Indica cosa trasporti (frigo, armadio, trasloco, moto…). La guida confronta volume, altezza vano e portata dei veicoli in flotta a Trieste e ti propone 1–2 mezzi adatti.",
  },
  {
    q: "I consigli si basano su misure reali?",
    a: "Sì: usiamo i dati di scheda (m³, altezza vano, portata) dei veicoli pubblicati. Se un dato non è in scheda, il mezzo viene penalizzato nel ranking.",
  },
  {
    q: "Posso noleggiare anche la rampa per la moto?",
    a: "Il Fiat Ducato in flotta ha già la rampa moto dedicata. Sugli altri furgoni è disponibile l’extra «Rampa carico moto» (e il carrello manuale) selezionabile nel preventivo.",
  },
];
