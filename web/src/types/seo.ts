export type SeoPageKey =
  | "home"
  | "flotta"
  | "autolavaggio"
  | "tariffe"
  | "offerte"
  | "chi-siamo"
  | "contatti"
  | "privacy"
  | "cookie-policy"
  | "termini-condizioni";

export interface SeoSettings {
  page_key: SeoPageKey;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  meta_robots: string;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  updated_at: string;
}

export const SEO_PAGE_PATHS: Record<SeoPageKey, string> = {
  home: "/",
  flotta: "/flotta",
  autolavaggio: "/autolavaggio",
  /** Canonica listino: /tariffe corto fa solo 301 qui (mai pagina 200). */
  tariffe: "/tariffe-noleggio-furgoni-trieste",
  offerte: "/offerte-noleggio-furgoni-trieste",
  "chi-siamo": "/chi-siamo",
  contatti: "/contatti",
  privacy: "/privacy",
  "cookie-policy": "/cookie-policy",
  "termini-condizioni": "/termini-condizioni",
};
