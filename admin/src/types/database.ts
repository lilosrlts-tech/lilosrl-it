export type TipoTariffa =
  | "giornaliero"
  | "weekend"
  | "settimanale"
  | "mensile"
  | "ora"
  | "custom";

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  descrizione: string | null;
  icona: string | null;
  ordine: number;
  attivo: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  meta_robots: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Prezzo {
  id: string;
  veicolo_id: string | null;
  categoria_id: string | null;
  tipo_tariffa: TipoTariffa;
  importo: number;
  valuta: string;
  data_inizio: string | null;
  data_fine: string | null;
  giorni_minimo: number | null;
  km_inclusi: number | null;
  deposito: number | null;
  descrizione: string | null;
  attivo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Foto {
  id: string;
  veicolo_id: string;
  storage_bucket: string;
  storage_path: string;
  url_pubblico: string;
  alt_text: string;
  titolo: string | null;
  didascalia: string | null;
  ordine: number;
  is_copertina: boolean;
  mime_type: string | null;
  peso_bytes: number | null;
  created_at: string;
  updated_at: string;
}

export interface Accessorio {
  id: string;
  nome: string;
  slug: string;
  descrizione: string | null;
  prezzo_giornaliero: number;
  deposito: number | null;
  deposito_richiesto: boolean;
  quantita_max: number;
  attivo: boolean;
  ordine: number;
  created_at: string;
  updated_at: string;
}

export interface Veicolo {
  id: string;
  categoria_id: string;
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
  volume_metri_cubi: number | null;
  portata_utile_kg: number | null;
  lunghezza_vano_mm: number | null;
  larghezza_vano_mm: number | null;
  altezza_vano_mm: number | null;
  larghezza_tra_passaruota_mm: number | null;
  capacita_bagagliaio_valigie: number | null;
  classe_ambientale: string | null;
  connessione_smartphone: string | null;
  configurazione_sedili: string | null;
  climatizzazione_posteriore: boolean | null;
  note_interne: string | null;
  slug: string;
  pubblicato: boolean;
  attivo: boolean;
  in_evidenza: boolean;
  ordine: number;
  unita_disponibili: number;
  promo_durata_attiva: boolean;
  titolo_pubblico: string | null;
  sottotitolo: string | null;
  descrizione_breve: string | null;
  descrizione_completa: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  ai_summary: string | null;
  ai_highlights: string[] | null;
  ai_faq: { q: string; a: string }[] | null;
  created_at: string;
  updated_at: string;
}

export interface VeicoloDettaglio extends Veicolo {
  categoria?: Pick<Categoria, "id" | "nome" | "slug"> | null;
  prezzi?: Prezzo[];
  foto?: Foto[];
  accessori_ids?: string[];
}

export interface ApiErrorBody {
  error: string;
  details?: unknown;
}

export interface ApiSuccessBody<T> {
  data: T;
}
