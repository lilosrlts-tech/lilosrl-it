import { SITE_URL } from "@/lib/constants";

/**
 * Foto reale per la miniatura in Google e per Open Graph.
 * Il logo è 250×81: Google non lo mostra accanto al risultato.
 */
export const OG_FURGONE = {
  url: `${SITE_URL}/images/flotta/ford-transit-noleggio-furgoni-trieste.webp`,
  width: 1024,
  height: 682,
  alt: "Furgone LILO a noleggio a Trieste",
} as const;

export const OG_AUTO = {
  url: `${SITE_URL}/images/veicoli/volkswagen-polo-noleggio-auto-trieste.webp`,
  width: 1024,
  height: 682,
  alt: "Auto LILO a noleggio a Trieste",
} as const;
