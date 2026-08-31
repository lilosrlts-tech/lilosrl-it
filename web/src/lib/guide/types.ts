import type { AiFaqItem } from "@/types/veicolo";

export interface GuideLink {
  href: string;
  label: string;
}

export interface GuideSection {
  h2: string;
  paragraphs: string[];
  /** Elenco puntato opzionale sotto i paragrafi */
  bullets?: string[];
}

export interface GuideArticle {
  slug: string;
  title: string;
  /** Meta title (senza brand suffix se già gestito da resolveMetadataTitle) */
  metaTitle: string;
  metaDescription: string;
  /** Risposta diretta in cima (GEO / AI) */
  inBreve: string;
  publishedAt: string;
  updatedAt: string;
  sections: GuideSection[];
  faq?: AiFaqItem[];
  relatedLinks: GuideLink[];
  ctaPrimary: GuideLink;
  ctaSecondary?: GuideLink;
}
