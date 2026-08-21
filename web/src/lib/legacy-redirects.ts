/**
 * Mappa dei redirect 301 (permanenti) dalle URL storiche di lilosrl.it (WordPress)
 * verso la nuova struttura Next.js.
 *
 * Decisioni SEO (2026-07-28):
 *   - /prezzi e /tariffe → /tariffe-noleggio-furgoni-trieste
 *   - /offerte e /offerta-del-mese → /offerte-noleggio-furgoni-trieste
 *   - /flotta-noleggio e /flotta-noleggio-2 → /flotta
 *   - /autolavaggio resta su lilosrl.it (nessun redirect fuori dominio)
 *   - schede /car/*: mappate 301 → /flotta/... + catch-all → /flotta
 *   - root categorie (/pulmini-9-posti, /furgoni-*, /auto) → /flotta/...
 *
 * Decisioni SEO (2026-08): slug schede senza targa → 301 da /flotta/{slug-con-targa}.
 * Decisioni SEO (2026-08): fallback path sconosciuti → /flotta (middleware).
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
  { source: "/logo-lilo.jpg", destination: "/logo-lilo.webp", note: "Logo JPEG → WebP" },
  {
    source: "/images/flotta/ford-transit-noleggio-furgoni-trieste.png",
    destination: "/images/flotta/ford-transit-noleggio-furgoni-trieste.webp",
    note: "PNG 1MB → WebP",
  },
  {
    source: "/images/flotta/ford-tourneo-noleggio-pulmini-trieste.png",
    destination: "/images/flotta/ford-tourneo-noleggio-pulmini-trieste.webp",
    note: "PNG → WebP",
  },
  {
    source: "/images/flotta/fiat-doblo-noleggio-furgoni-piccoli-trieste.png",
    destination: "/images/flotta/fiat-doblo-noleggio-furgoni-piccoli-trieste.webp",
    note: "PNG → WebP",
  },
  {
    source: "/images/flotta/furgone-grande-iveco-daily-l2h2-trieste-front.jpg",
    destination: "/images/flotta/furgone-grande-iveco-daily-l2h2-trieste-front.webp",
    note: "JPEG → WebP",
  },
  {
    source: "/images/flotta/furgone-piccolo-toyota-proace-city-trieste-front.jpg",
    destination: "/images/flotta/furgone-piccolo-toyota-proace-city-trieste-front.webp",
    note: "JPEG → WebP",
  },
  {
    source: "/images/veicoli/opel-karl-noleggio-auto-trieste.jpg",
    destination: "/images/veicoli/opel-karl-noleggio-auto-trieste.webp",
    note: "JPEG → WebP",
  },
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

  // ── Prezzi / tariffe (URL keyword) ───────────────────────────────────────
  ...withTrailingVariants(
    "/prezzi",
    "/tariffe-noleggio-furgoni-trieste",
    "Vecchia pagina prezzi → listino keyword",
  ),
  ...withTrailingVariants(
    "/tariffe",
    "/tariffe-noleggio-furgoni-trieste",
    "Listino corto → URL con keyword",
  ),

  // ── Offerte / news (URL keyword) ─────────────────────────────────────────
  ...withTrailingVariants(
    "/offerta-del-mese",
    "/offerte-noleggio-furgoni-trieste",
    "Offerta del mese WP → URL keyword",
  ),
  ...withTrailingVariants(
    "/news",
    "/offerte-noleggio-furgoni-trieste",
    "Archivio news WP → offerte keyword",
  ),
  ...withTrailingVariants(
    "/offerte",
    "/offerte-noleggio-furgoni-trieste",
    "Offerte corto → URL con keyword",
  ),

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

  // ── Categorie root (lilo.srl / WP) → /flotta/... ─────────────────────────
  // Critico: dominio lilo.srl fa 301 conservando il path; senza queste regole → 404.
  ...withTrailingVariants(
    "/pulmini-9-posti",
    "/flotta/pulmini-9-posti",
    "Root categoria pulmini → /flotta/pulmini-9-posti",
  ),
  ...withTrailingVariants(
    "/pulmini",
    "/flotta/pulmini-9-posti",
    "Alias /pulmini → categoria pulmini",
  ),
  ...withTrailingVariants(
    "/furgoni-piccoli",
    "/flotta/furgoni-piccoli",
    "Root categoria furgoni piccoli → /flotta/furgoni-piccoli",
  ),
  ...withTrailingVariants(
    "/furgoni-medi",
    "/flotta/furgoni-medi",
    "Root categoria furgoni medi → /flotta/furgoni-medi",
  ),
  ...withTrailingVariants(
    "/furgoni-grandi",
    "/flotta/furgoni-grandi",
    "Root categoria furgoni grandi → /flotta/furgoni-grandi",
  ),
  ...withTrailingVariants(
    "/furgoni-grandi-citta",
    "/flotta/furgoni-grandi-citta",
    "Root categoria furgoni grandi città → /flotta/furgoni-grandi-citta",
  ),
  ...withTrailingVariants(
    "/furgoni-xl",
    "/flotta/furgoni-xl",
    "Root categoria furgoni XL → /flotta/furgoni-xl",
  ),

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

  // ── Gestionale (ex rewrite → Aruba 403 ai crawler) ───────────────────────
  // 301 HTTPS sul dominio gestionale: GSC su lilosrl.it vede redirect, non 403.
  {
    source: "/.gestionale",
    destination: "https://www.gestionalelilo.it/.gestionale",
    note: "Proxy legacy → redirect HTTPS gestionale (evita 403 Aruba in GSC)",
  },
  {
    source: "/.gestionale/",
    destination: "https://www.gestionalelilo.it/.gestionale/",
    note: "Proxy legacy trailing → gestionale HTTPS",
  },
  {
    source: "/.gestionale/:path*",
    destination: "https://www.gestionalelilo.it/.gestionale/:path*",
    note: "Proxy legacy sottopercorsi → gestionale HTTPS",
  },

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

/**
 * Mappa path esatti (senza slash finale, senza parametri dinamici) → destinazione.
 * Usata dal middleware per 301 one-hop anche su URL con trailing slash.
 */
let exactPathRedirectCache: Map<string, string> | null = null;

export function getExactPathRedirectMap(): ReadonlyMap<string, string> {
  if (exactPathRedirectCache) return exactPathRedirectCache;
  const map = new Map<string, string>();
  for (const rule of LEGACY_REDIRECTS) {
    if (rule.source.includes(":")) continue;
    const key = rule.source.replace(/\/+$/, "") || "/";
    if (key === "/" && rule.destination === "/") continue;
    if (!map.has(key)) {
      map.set(key, rule.destination);
    }
  }
  exactPathRedirectCache = map;
  return map;
}
