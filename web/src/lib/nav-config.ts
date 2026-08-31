export const GOLD = "#D4AF37";
/** Oro scuro per testo piccolo su sfondo chiaro (WCAG AA ≥ 4.5:1). */
export const GOLD_TEXT = "#8B6B0E";

export const AUTOLAVAGGIO_URL = "https://www.autolavaggiolilo.it";

/** Categorie mostrate nel menu Flotta (dropdown header). */
export const FLOTTA_CATEGORIE_NAV = [
  { label: "Auto", slug: "auto" },
  { label: "Pulmini 9 Posti", slug: "pulmini-9-posti" },
  { label: "Furgoni Piccoli", slug: "furgoni-piccoli" },
  { label: "Furgoni Medi", slug: "furgoni-medi" },
  { label: "Furgoni Grandi", slug: "furgoni-grandi" },
  { label: "Furgoni Grandi (Uso Città)", slug: "furgoni-grandi-citta" },
  { label: "Furgoni XL", slug: "furgoni-xl" },
] as const;

export function flottaCategoriaHref(slug: string): string {
  return `/flotta/${slug}`;
}

/** Link SEO footer — noleggio locale Trieste */
export const FOOTER_NOLEGGIO_LINKS = [
  { label: "Noleggio Auto Trieste", href: "/noleggio-auto-trieste" },
  { label: "Noleggio Furgoni Trieste", href: "/noleggio-furgoni-trieste" },
  { label: "Noleggio Pulmini 9 Posti", href: "/noleggio-pulmini-9-posti-trieste" },
] as const;

export const FOOTER_LILO_LINKS = [
  { href: "/chi-siamo", label: "Chi Siamo" },
  { href: "/chi-siamo#storia", label: "La Nostra Storia" },
  { href: "/contatti", label: "Contatti" },
] as const;

export const FOOTER_SERVIZI_LINKS = [
  { href: "/tariffe-noleggio-furgoni-trieste", label: "Listino prezzi noleggio" },
  { href: "/cosa-trasporti", label: "Cosa trasporti?" },
  { href: "/guide", label: "Guide" },
  { href: AUTOLAVAGGIO_URL, label: "Autolavaggio Professionale", external: true },
  { href: "/flotta", label: "Flotta e Prezzi" },
  { href: "/offerte-noleggio-furgoni-trieste", label: "Offerte", requiresOfferta: true },
] as const;

export const FOOTER_LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/termini-condizioni", label: "Termini e Condizioni" },
] as const;
