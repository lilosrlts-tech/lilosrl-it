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
  phone: "0402471720",
  phoneE164: "+390402471720",
  email: "info@lilosrl.it",
  streetAddress: "Viale Campi Elisi 38/B",
  city: "Trieste",
  region: "Friuli-Venezia Giulia",
  postalCode: "34132",
  country: "IT",
  geo: {
    latitude: 45.6495,
    longitude: 13.7768,
  },
} as const;
