import {
  NAP_EMAIL,
  NAP_NOLEGGIO_CITY,
  NAP_NOLEGGIO_COUNTRY,
  NAP_NOLEGGIO_POSTAL,
  NAP_NOLEGGIO_REGION,
  NAP_NOLEGGIO_STREET,
  NAP_PHONE_DISPLAY,
  NAP_PHONE_E164,
} from "@/lib/nap";

export const SITE_URL = "https://www.lilosrl.it";
export const CANONICAL_HOST = "www.lilosrl.it";
export const CANONICAL_ORIGIN = SITE_URL;

/** Apex senza www — stesso dominio canonico. */
export const APEX_HOST = "lilosrl.it";

/**
 * Domini secondari storici da reindirizzare a https://www.lilosrl.it
 * (con e senza www). Al go-live: puntare DNS di questi host al nuovo sito.
 */
export const SECONDARY_HOSTS = [
  "lilo.srl",
  "www.lilo.srl",
  "noleggiofurgonitrieste.it",
  "www.noleggiofurgonitrieste.it",
  "noleggiotrieste.it",
  "www.noleggiotrieste.it",
  "autonoleggiotrieste.it",
  "www.autonoleggiotrieste.it",
] as const;

/** Host che devono fare 301 verso CANONICAL_ORIGIN (stesso path). */
export const REDIRECT_TO_CANONICAL_HOSTS: ReadonlySet<string> = new Set([
  APEX_HOST,
  ...SECONDARY_HOSTS,
]);

export const COMPANY = {
  /** Ragione sociale (legale, footer, documenti). */
  name: "LILO S.r.l.",
  legalName: "LILO S.R.L.",
  /**
   * Nome commerciale da usare in testi pubblici (una volta, non ripetuto).
   * Evitare il solo «LILO»: sembra un nome proprio, non un’azienda.
   */
  marketingName: "LILO Autonoleggio e Furgoni Trieste",
  vatNumber: "01249580323",
  /** Display NAP (spazi) — fonte `nap.ts`. */
  phone: NAP_PHONE_DISPLAY,
  phoneE164: NAP_PHONE_E164,
  email: NAP_EMAIL,
  /** Sede legale (privacy, titolare trattamento). */
  legalAddress: "Via Giuseppe De Coletti, 7, 34143 Trieste (TS)",
  /** Sede operativa noleggio (ritiro / riconsegna) — allineata a NAP. */
  streetAddress: NAP_NOLEGGIO_STREET,
  city: NAP_NOLEGGIO_CITY,
  region: NAP_NOLEGGIO_REGION,
  postalCode: NAP_NOLEGGIO_POSTAL,
  country: NAP_NOLEGGIO_COUNTRY,
  geo: {
    latitude: 45.6495,
    longitude: 13.7768,
  },
} as const;
