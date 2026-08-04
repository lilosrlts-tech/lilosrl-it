export interface CategoriaPubblica {
  id: string;
  nome: string;
  slug: string;
  ordine?: number;
}

export interface FotoPubblica {
  id: string;
  url_pubblico: string;
  alt_text: string;
  titolo: string | null;
  didascalia: string | null;
  ordine: number;
  is_copertina: boolean;
}

export interface PrezzoPubblico {
  tipo_tariffa: string;
  importo: number;
  valuta: string;
  descrizione: string | null;
}

export interface AiFaqItem {
  q: string;
  a: string;
}

/** Dati strutturati per scheda veicolo (furgoni, pulmini, auto). */
export interface SpecificheTecniche {
  /** Furgoni — campi principali SEO */
  volume_metri_cubi: number | null;
  portata_utile_kg: number | null;
  lunghezza_vano_mm: number | null;
  larghezza_vano_mm: number | null;
  altezza_vano_mm: number | null;
  larghezza_tra_passaruota_mm: number | null;
  /** Auto */
  capacita_bagagliaio_valigie: number | null;
  classe_ambientale: string | null;
  connessione_smartphone: string | null;
  /** Pulmini 9 posti */
  configurazione_sedili: string | null;
  climatizzazione_posteriore: boolean | null;
  /** Campi comuni / legacy (furgoni) */
  portata_kg: number | null;
  volume_carico_mc: number | null;
  trazione: string | null;
  passo: string | null;
  tetto: string | null;
  sensori_parcheggio: boolean | null;
  lunghezza_mm: number | null;
  larghezza_mm: number | null;
  altezza_mm: number | null;
  vano_lunghezza_mm: number | null;
  vano_larghezza_mm: number | null;
  vano_altezza_mm: number | null;
}

export interface VeicoloPubblico {
  id: string;
  slug: string;
  targa: string;
  marca: string;
  modello: string;
  versione: string | null;
  anno_immatricolazione: number | null;
  colore: string | null;
  alimentazione: string | null;
  cambio: string | null;
  posti: number | null;
  porte: number | null;
  titolo_pubblico: string | null;
  sottotitolo: string | null;
  descrizione_breve: string | null;
  descrizione_completa: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  meta_robots: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  json_ld: Record<string, unknown> | null;
  ai_summary: string | null;
  ai_highlights: string[];
  ai_faq: AiFaqItem[];
  ai_context: string | null;
  categoria: CategoriaPubblica | null;
  /** Unità dello stesso modello in flotta (nascoste le targhe). Default 1. */
  unita_disponibili?: number;
  /** Se true, applica sconti durata di flotta (7=6, mese -30%, …). */
  promo_durata_attiva?: boolean;
  specifiche_tecniche: SpecificheTecniche;
  prezzi: PrezzoPubblico[];
  foto: FotoPubblica[];
  accessori?: AccessorioPubblico[];
  /** Calcolato server-side: listino + sconti durata. */
  prezzo_promo?: {
    giornaliero: number;
    daGiorno: number;
    valuta: string;
    promoAttiva: boolean;
    regole: {
      id: string;
      nome: string;
      slug: string;
      descrizione_pubblica: string | null;
      giorni_minimo: number;
      tipo: "paga_giorni" | "percentuale";
      giorni_a_pagamento: number | null;
      sconto_percentuale: number | null;
      ordine: number;
    }[];
    regolaMigliore: {
      id: string;
      nome: string;
      descrizione_pubblica: string | null;
      giorni_minimo: number;
    } | null;
  } | null;
}

export interface AccessorioPubblico {
  id: string;
  nome: string;
  slug: string;
  descrizione: string | null;
  prezzo_giornaliero: number;
  deposito: number | null;
  deposito_richiesto: boolean;
  quantita_max: number;
}
