import { FLEET_IDENTITY_SENTENCE, FLEET_SIZE_CLAIM_SHORT } from "@/lib/fleet-identity";

export interface PuntoForza {
  title: string;
  description: string;
}

const DEFAULT_PUNTI_FORZA: PuntoForza[] = [
  { title: "20+ Anni di Esperienza", description: "Dal 2003 leader nei trasporti e servizi a Trieste" },
  {
    title: "Noleggio Flessibile",
    description: `${FLEET_SIZE_CLAIM_SHORT} in flotta reale; cauzione in contanti per uso in città`,
  },
  { title: "Igienizzazione Certificata", description: "Ogni mezzo è sanificato a vapore prima della consegna" },
  { title: "Trasparenza Totale", description: "Tariffe competitive, chiare e senza costi nascosti" },
];

export function parsePuntiForza(json: string | null | undefined): PuntoForza[] {
  if (!json) return DEFAULT_PUNTI_FORZA;
  try {
    const parsed = JSON.parse(json) as PuntoForza[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PUNTI_FORZA;
    return parsed.filter((item) => item.title && item.description);
  } catch {
    return DEFAULT_PUNTI_FORZA;
  }
}

export function parseListaServizi(text: string | null | undefined, fallback: string[]): string[] {
  if (!text?.trim()) return fallback;
  const items = text.split("\n").map((line) => line.trim()).filter(Boolean);
  return items.length > 0 ? items : fallback;
}
