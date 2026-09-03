/**
 * Conteggio unità fisiche per modello (scheda pubblica senza targhe).
 * Allineato a sync-unita-disponibili.mjs / flotta operativa LILO.
 *
 * NON è disponibilità booking in tempo reale: indica quante unità dello stesso
 * modello sono in flotta. Conferma date = preventivo / sede.
 */
export const UNITA_DISPONIBILI_BY_SLUG: Record<string, number> = {
  // XL
  "ford-transit-l3h2": 3,
  "nissan-interstar-l3h2": 2,
  "peugeot-boxer-l3h3": 2,
  // Grandi città
  "peugeot-boxer-l2h2": 4,
  "citroen-jumper-l2h2": 3,
  // Grandi
  "ford-transit-l2h2": 3,
  "renault-master-l2h2": 4,
  "opel-movano-l2h2": 4,
  // Medi
  "ford-transit-custom-l1h1-ibrido": 4,
  "ford-transit-custom-l1h1": 4,
  "opel-vivaro": 3,
  "citroen-jumpy-l1h1": 3,
  // Piccoli
  "fiat-doblo-cargo": 3,
  "fiat-doblo": 1,
  "toyota-proace-city": 2,
  // Auto
  "citroen-c3": 3,
  "opel-karl": 2,
  "volkswagen-polo": 1,
  // Pulmini
  "renault-trafic-9-posti": 3,
  "nissan-primastar-9-posti": 3,
};

export function resolveUnitaDisponibili(
  slug: string,
  fromDb?: number | null,
): number {
  if (typeof fromDb === "number" && Number.isFinite(fromDb) && fromDb >= 1) {
    return Math.floor(fromDb);
  }
  return UNITA_DISPONIBILI_BY_SLUG[slug] ?? 1;
}
