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
  created_at: string;
  updated_at: string;
}

export const SEO_PAGE_LABELS: Record<SeoPageKey, string> = {
  home: "Home",
  flotta: "Flotta Noleggio",
  autolavaggio: "Autolavaggio",
  tariffe: "Prezzi",
  offerte: "Offerta del Mese",
  "chi-siamo": "Chi Siamo",
  contatti: "Contatti",
  privacy: "Privacy Policy",
  "cookie-policy": "Cookie Policy",
  "termini-condizioni": "Termini e Condizioni",
};

export const SEO_PAGE_PATHS: Record<SeoPageKey, string> = {
  home: "/",
  flotta: "/flotta",
  autolavaggio: "/autolavaggio",
  tariffe: "/tariffe",
  offerte: "/offerte",
  "chi-siamo": "/chi-siamo",
  contatti: "/contatti",
  privacy: "/privacy",
  "cookie-policy": "/cookie-policy",
  "termini-condizioni": "/termini-condizioni",
};
