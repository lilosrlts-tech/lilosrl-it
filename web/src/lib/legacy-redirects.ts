/**
 * Mappa dei redirect 301 (permanenti) dalle URL storiche di lilosrl.it (WordPress)
 * verso la nuova struttura Next.js.
 *
 * Decisioni SEO (2026-07-28):
 *   - /prezzi → /tariffe (pagina listino esistente)
 *   - /flotta-noleggio e /flotta-noleggio-2 → /flotta
 *   - /autolavaggio resta su lilosrl.it (nessun redirect fuori dominio)
 *   - schede /car/*: mappate 301 → /flotta/... + catch-all → /flotta
 *
 * Decisioni SEO (2026-08): slug schede senza targa → 301 da /flotta/{slug-con-targa}.
 *
 * Status HTTP: sempre statusCode 301 (non permanent:true → 308) per tool SEO.
 * Domini secondari / apex: middleware + REDIRECT_TO_CANONICAL_HOSTS in constants.
 *
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects
 * @see docs/seo-url-migration-map.md
 * @see veicolo-slug-renames.ts
 */

import { VEICOLO_SLUG_REDIRECTS_301 } from "./veicolo-slug-renames";

export interface LegacyRedirect {
  /** Path sorgente (senza dominio), es. "/furgoni" */
  source: string;
  /** Path destinazione (relativo o assoluto sullo stesso dominio) */
  destination: string;
  /** Nota interna: perché esiste questo redirect */
  note?: string;
}

/** Aggiunge variante con e senza trailing slash (URL WP storiche). */
function withTrailingVariants(
  source: string,
  destination: string,
  note: string,
): LegacyRedirect[] {
  const base = source.replace(/\/$/, "") || "/";
  if (base === "/") {
    return [];
  }
  return [
    { source: base, destination, note },
    { source: `${base}/`, destination, note: `${note} (trailing slash WP)` },
  ];
}

/**
 * ─── Redirect attivi (Fase 1) ────────────────────────────────────────────────
 * Ordine: regole più specifiche prima di quelle generiche.
 * source === destination viene escluso da getActiveRedirectRules().
 */
export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  // ── Home e alias comuni ──────────────────────────────────────────────────
  ...withTrailingVariants("/home", "/", "Vecchia home /home"),
  {
    source: "/index.html",
    destination: "/",
    note: "Home statica legacy",
  },
  {
    source: "/index.php",
    destination: "/",
    note: "Home PHP legacy",
  },

  // ── Hub flotta WP (entrambi → /flotta) ────────────────────────────────────
  ...withTrailingVariants(
    "/flotta-noleggio",
    "/flotta",
    "Hub flotta WordPress → hub flotta Next",
  ),
  ...withTrailingVariants(
    "/flotta-noleggio-2",
    "/flotta",
    "Duplicato hub flotta WP → /flotta",
  ),

  // ── Prezzi → tariffe (pagina /tariffe esistente) ──────────────────────────
  ...withTrailingVariants(
    "/prezzi",
    "/tariffe",
    "Vecchia pagina prezzi → listino /tariffe",
  ),

  // ── Offerte / news ───────────────────────────────────────────────────────
  ...withTrailingVariants(
    "/offerta-del-mese",
    "/offerte",
    "Offerta del mese WP → /offerte",
  ),
  ...withTrailingVariants("/news", "/offerte", "Archivio news WP → /offerte"),

  // ── Legale / cookie ──────────────────────────────────────────────────────
  ...withTrailingVariants(
    "/termini-e-condizioni",
    "/termini-condizioni",
    "Termini WP (con «e») → /termini-condizioni",
  ),
  ...withTrailingVariants(
    "/cookie-policy-ue",
    "/cookie-policy",
    "Cookie Policy UE WP → /cookie-policy",
  ),

  // ── Pagine inutili / test ────────────────────────────────────────────────
  ...withTrailingVariants(
    "/test-shortcode",
    "/",
    "Pagina test shortcode → home",
  ),
  ...withTrailingVariants(
    "/how-we-manage-large-construction-projects",
    "/",
    "Post template inglese irrilevante → home",
  ),

  // ── Plugin car rental (basso valore SEO) ─────────────────────────────────
  ...withTrailingVariants(
    "/car-rental/search",
    "/flotta",
    "Ricerca plugin noleggio → flotta",
  ),
  ...withTrailingVariants(
    "/car-rental/booking-confirmed",
    "/flotta",
    "Conferma booking plugin → flotta",
  ),
  ...withTrailingVariants(
    "/car-rental/payment-cancelled",
    "/contatti",
    "Pagamento annullato plugin → contatti",
  ),
  ...withTrailingVariants(
    "/car-rental/car-rental-terms-and-conditions",
    "/termini-condizioni",
    "Termini plugin noleggio → termini sito",
  ),

  // ── Contatti (alias) ─────────────────────────────────────────────────────
  ...withTrailingVariants("/contact", "/contatti", "Alias inglese → contatti"),
  ...withTrailingVariants("/contattaci", "/contatti", "Alias italiano → contatti"),

  // ── Alias marketing / landing generiche ──────────────────────────────────
  ...withTrailingVariants("/veicoli", "/flotta", "Vecchia sezione veicoli → flotta"),
  ...withTrailingVariants("/auto", "/flotta/auto", "Landing auto → categoria auto"),
  ...withTrailingVariants(
    "/noleggio-auto",
    "/flotta/auto",
    "Landing noleggio auto → categoria auto",
  ),
  ...withTrailingVariants(
    "/furgoni",
    "/flotta/furgoni-medi",
    "Landing furgoni generica → furgoni medi",
  ),
  ...withTrailingVariants(
    "/noleggio-furgoni",
    "/flotta/furgoni-medi",
    "Landing noleggio furgoni → furgoni medi",
  ),
  ...withTrailingVariants("/noleggio", "/flotta", "Sezione noleggio generica → flotta"),
  ...withTrailingVariants("/parco-auto", "/flotta", "Alias parco auto → flotta"),
  ...withTrailingVariants("/about", "/chi-siamo", "Alias about → Chi Siamo"),

  // ── Pattern dettaglio (slug) — utili se indicizzati; /car/* = fase 2 ──────
  {
    source: "/noleggio/:slug",
    destination: "/flotta/:slug",
    note: "Pattern dettaglio /noleggio/:slug",
  },
  {
    source: "/veicolo/:slug",
    destination: "/flotta/:slug",
    note: "Singolare veicolo",
  },
  {
    source: "/veicoli/:slug",
    destination: "/flotta/:slug",
    note: "Plurale veicoli",
  },
  {
    source: "/furgoni/:slug",
    destination: "/flotta/:slug",
    note: "Dettaglio furgone per slug",
  },
  {
    source: "/auto/:slug",
    destination: "/flotta/:slug",
    note: "Dettaglio auto per slug",
  },

  // ── Fase 2: /car/:slug → /flotta/... (URL WP storiche in Google) ─────────
  ...withTrailingVariants(
    "/car/volvo-volvo-s40",
    "/flotta/volvo-s40",
    "WP Volvo S40 → scheda Next",
  ),
  ...withTrailingVariants(
    "/car/opel-karl",
    "/flotta/opel-karl",
    "WP Opel Karl → scheda Next",
  ),
  ...withTrailingVariants(
    "/car/renault-renault-trafic-9-posti",
    "/flotta/renault-trafic-9-posti",
    "WP Renault Trafic 9 posti → scheda Next",
  ),
  ...withTrailingVariants(
    "/car/nissan-primastar",
    "/flotta/nissan-primastar-9-posti",
    "WP Nissan Primastar → scheda Next",
  ),
  ...withTrailingVariants(
    "/car/opel-vivaro",
    "/flotta/opel-vivaro",
    "WP Opel Vivaro → scheda Next",
  ),
  ...withTrailingVariants(
    "/car/fiat-doblo",
    "/flotta/fiat-doblo-cargo",
    "WP Fiat Doblò → scheda Next",
  ),
  ...withTrailingVariants(
    "/car/fiat-ducato-l1h1",
    "/flotta/fiat-ducato-l1h1",
    "WP Fiat Ducato L1H1 → scheda Next",
  ),
  ...withTrailingVariants(
    "/car/ford-transit-l3h2-furgone",
    "/flotta/ford-transit-l3h2",
    "WP Ford Transit L3H2 → scheda Next",
  ),
  ...withTrailingVariants(
    "/car/opel-movano",
    "/flotta/opel-movano-l2h2",
    "WP Opel Movano → scheda Next",
  ),
  ...withTrailingVariants(
    "/car/peugeot-boxer-l2h2",
    "/flotta/peugeot-boxer-l2h2",
    "WP Peugeot Boxer L2H2 → scheda Next",
  ),
  ...withTrailingVariants(
    "/car/peugeot-boxer-l2h2-2",
    "/flotta/peugeot-boxer-l2h2",
    "WP Peugeot Boxer L2H2 duplicato → stessa scheda",
  ),
  ...withTrailingVariants(
    "/car/peugeot-boxer-2",
    "/flotta/peugeot-boxer-l3h3",
    "WP Peugeot Boxer XL → Boxer L3H3",
  ),
  ...withTrailingVariants(
    "/car/iveco-iveco-daily",
    "/flotta/iveco-daily-35-12",
    "WP Iveco Daily → scheda Next",
  ),
  ...withTrailingVariants(
    "/car/renault-master",
    "/flotta/renault-master-l2h2",
    "WP Renault Master → Master L2H2",
  ),
  ...withTrailingVariants(
    "/car/ford-transit",
    "/flotta/ford-transit-l2h2",
    "WP Ford Transit generico → Transit grandi",
  ),
  ...withTrailingVariants(
    "/car/noleggio-furgone-a-trieste-ford-l1h1",
    "/flotta/ford-transit-custom-l1h1-ibrido",
    "WP Ford L1H1 → Transit Custom",
  ),
  ...withTrailingVariants(
    "/car/noleggio-furgoni-autonoleggio-pulmini-9-posti",
    "/flotta/pulmini-9-posti",
    "WP landing pulmini → categoria pulmini",
  ),
  ...withTrailingVariants(
    "/car/peugeot-partner",
    "/flotta/furgoni-piccoli",
    "WP Peugeot Partner fuori flotta → furgoni piccoli",
  ),
  ...withTrailingVariants(
    "/car/noleggio-furgoni-mercedes-vito-trieste",
    "/flotta/furgoni-medi",
    "WP Mercedes Vito fuori flotta → furgoni medi",
  ),

  // ── Slug schede: targa rimossa (vecchie URL → slug stabili) ───────────────
  ...VEICOLO_SLUG_REDIRECTS_301.flatMap(({ from, to }) =>
    withTrailingVariants(
      `/flotta/${from}`,
      `/flotta/${to}`,
      `Slug con targa ${from} → ${to}`,
    ),
  ),

  // Catch-all: qualsiasi /car/* non mappato → hub flotta (preserva equity SEO residua)
  {
    source: "/car/:slug",
    destination: "/flotta",
    note: "Catch-all WP /car/* sconosciuto → hub flotta",
  },
  {
    source: "/car/:slug/",
    destination: "/flotta",
    note: "Catch-all WP /car/*/ (trailing) → hub flotta",
  },
];

/** Formato next.config redirects(). statusCode 301 (non permanent→308). */
export interface NextRedirectRule {
  source: string;
  destination: string;
  statusCode: 301;
}

export function toNextRedirectRules(): NextRedirectRule[] {
  return LEGACY_REDIRECTS.map(({ source, destination }) => ({
    source,
    destination,
    statusCode: 301 as const,
  }));
}

/**
 * Esclude source === destination (loop) e regole incomplete.
 */
export function getActiveRedirectRules(): NextRedirectRule[] {
  return toNextRedirectRules().filter(
    (rule) => rule.source !== rule.destination && Boolean(rule.source) && Boolean(rule.destination),
  );
}
