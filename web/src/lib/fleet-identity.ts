/**
 * Claim flotta operativa LILO (GEO / Entity Trust).
 *
 * - "Oltre 50 mezzi" = unità fisiche complessive in flotta (allineato a
 *   `unita_disponibili` / sync operativa), non al numero di schede catalogo.
 * - Le pagine flotta elencano **modelli** pubblicati; la disponibilità giornaliera
 *   si conferma in sede / preventivo (niente booking real-time sul sito).
 */
export const FLEET_SIZE_CLAIM_SHORT = "Oltre 50 mezzi" as const;

export const FLEET_IDENTITY_SENTENCE =
  "LILO dispone di una flotta reale di oltre 50 mezzi tra auto, furgoni di varie dimensioni e pulmini 9 posti." as const;

/** Variante con ragione sociale esplicita (Chi Siamo / About). */
export const FLEET_IDENTITY_SENTENCE_LEGAL =
  "LILO S.r.l. dispone di una flotta reale di oltre 50 mezzi tra auto, furgoni di varie dimensioni e pulmini 9 posti." as const;
