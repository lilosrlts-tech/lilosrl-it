import type { Categoria, VeicoloDettaglio } from "@/types/database";
import type { ImpostazioniSito } from "@/types/impostazioni";
import { IMPOSTAZIONI_SITO_ID } from "@/types/impostazioni";
import type { SeoSettings } from "@/types/seo";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return Boolean(url && key && !url.includes("your-project") && !key.includes("your-service"));
}

const now = new Date().toISOString();

function makeCategoria(
  id: string,
  nome: string,
  slug: string,
  descrizione: string,
  ordine: number,
): Categoria {
  return {
    id,
    nome,
    slug,
    descrizione,
    icona: null,
    ordine,
    attivo: true,
    seo_title: null,
    seo_description: null,
    seo_keywords: [],
    meta_robots: null,
    canonical_url: null,
    created_at: now,
    updated_at: now,
  };
}

export const DEMO_CATEGORIE: Categoria[] = [
  makeCategoria(
    "c1111111-1111-1111-1111-111111111111",
    "Auto",
    "auto",
    "Automobili per uso personale e business",
    1,
  ),
  makeCategoria(
    "c2222222-2222-2222-2222-222222222222",
    "Pulmini 9 posti",
    "pulmini-9-posti",
    "Veicoli fino a 9 posti per gruppi e trasferimenti",
    2,
  ),
  makeCategoria(
    "c3333333-3333-3333-3333-333333333333",
    "Furgoni Piccoli",
    "furgoni-piccoli",
    "Furgoni compatti per città e piccoli traslochi",
    3,
  ),
  makeCategoria(
    "c4444444-4444-4444-4444-444444444444",
    "Furgoni Medi",
    "furgoni-medi",
    "Furgoni medi per lavoro e traslochi",
    4,
  ),
  makeCategoria(
    "c5555555-5555-5555-5555-555555555555",
    "Furgoni Grandi",
    "furgoni-grandi",
    "Furgoni grandi per carichi voluminosi",
    5,
  ),
  makeCategoria(
    "c6666666-6666-6666-6666-666666666666",
    "Furgoni XL",
    "furgoni-xl",
    "Furgoni extra-large per esigenze professionali",
    6,
  ),
];

export const DEMO_VEICOLI: VeicoloDettaglio[] = [
  {
    id: "v1111111-1111-1111-1111-111111111111",
    categoria_id: "c4444444-4444-4444-4444-444444444444",
    targa: "DV344HD",
    marca: "Ford",
    modello: "Transit",
    versione: "350M 2.2",
    anno_immatricolazione: 2019,
    colore: "Bianco",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    porte: 4,
    portata_kg: 1074,
    volume_carico_mc: 5.23,
    volume_metri_cubi: 5.23,
    portata_utile_kg: 1074,
    lunghezza_vano_mm: 2537,
    larghezza_vano_mm: 1662,
    altezza_vano_mm: 1387,
    capacita_bagagliaio_valigie: null,
    classe_ambientale: null,
    connessione_smartphone: null,
    configurazione_sedili: null,
    climatizzazione_posteriore: null,
    trazione: "Anteriore",
    passo: "Corto",
    tetto: "Basso",
    sensori_parcheggio: true,
    lunghezza_mm: 4999,
    larghezza_mm: 1959,
    altezza_mm: 1971,
    vano_lunghezza_mm: 2537,
    vano_larghezza_mm: 1662,
    vano_altezza_mm: 1387,
    note_interne: null,
    slug: "ford-transit-l2h2-citta",
    pubblicato: true,
    attivo: true,
    in_evidenza: true,
    ordine: 0,
    unita_disponibili: 1,
    promo_durata_attiva: true,
    titolo_pubblico: "Ford Transit 350M — Noleggio furgone Trieste",
    sottotitolo: null,
    descrizione_breve: "Furgone diesel ideale per traslochi a Trieste.",
    descrizione_completa: "Il Ford Transit 350M è capiente e affidabile.",
    seo_title: null,
    seo_description: null,
    seo_keywords: [],
    ai_summary: null,
    ai_highlights: [],
    ai_faq: [],
    larghezza_tra_passaruota_mm: null,
    created_at: now,
    updated_at: now,
    categoria: {
      id: "c4444444-4444-4444-4444-444444444444",
      nome: "Furgoni Medi",
      slug: "furgoni-medi",
    },
    prezzi: [
      {
        id: "p1111111-1111-1111-1111-111111111111",
        veicolo_id: "v1111111-1111-1111-1111-111111111111",
        categoria_id: null,
        tipo_tariffa: "giornaliero",
        importo: 89,
        valuta: "EUR",
        data_inizio: null,
        data_fine: null,
        giorni_minimo: 1,
        km_inclusi: null,
        deposito: null,
        descrizione: "Tariffa giornaliera",
        attivo: true,
        created_at: now,
        updated_at: now,
      },
    ],
    foto: [],
  },
];

export const DEMO_IMPOSTAZIONI: ImpostazioniSito = {
  id: IMPOSTAZIONI_SITO_ID,
  orari_noleggio:
    "Lunedì – Venerdì: 8:30 – 12:30 / 15:00 – 17:30\nSabato: 8:30 – 12:30\nDomenica: chiuso",
  orari_autolavaggio: "Lunedì – Sabato: 8:30 – 13:00 / 14:00 – 18:30\nDomenica: chiuso",
  telefono_noleggio: "040 2471720",
  telefono_autolavaggio: "040 2471720",
  email_contatto: "info@lilosrl.it",
  email_preventivi: "info@lilosrl.it",
  social_facebook: "https://www.facebook.com/LiloAutonoleggioFurgoniTrieste",
  social_facebook_autolavaggio: "https://www.facebook.com/LiloAutolavaggioTrieste/",
  social_instagram: null,
  social_linkedin: null,
  indirizzo_noleggio: "Viale Campi Elisi 38/B, 34143 Trieste (TS)",
  indirizzo_autolavaggio:
    "Ingresso: Via Schiaparelli 21/A — Uscita: Via G. De Coletti 7, Trieste",
  testo_hero_home:
    "Noleggio auto e furgoni a Trieste con LILO S.r.l.: flotta moderna, tariffe trasparenti e ritiro in sede in Viale Campi Elisi. Ideale per privati, aziende e traslochi.",
  hero_titolo_home: "Noleggio auto e furgoni a Trieste",
  hero_badge_home: "",
  home_punti_forza_titolo: "I punti di forza che fanno la differenza",
  home_punti_forza_json: null,
  chi_siamo_hero_titolo:
    "LILO SRL: 20 ANNI DI ESPERIENZA NEI TRASPORTI E SERVIZI A TRIESTE",
  chi_siamo_hero_sottotitolo: "La Nostra Storia: Dal 2003 a Oggi",
  chi_siamo_intro:
    "Dal 2003 LILO opera a Trieste con professionalità nei trasporti, nel noleggio veicoli e nei servizi integrati per privati, aziende ed enti.",
  offerta_titolo: "Offerta del Mese",
  offerta_descrizione:
    "Ogni mese selezioniamo veicoli e tariffe agevolate per privati e aziende. Contattaci per conoscere l'offerta attuale o consulta la flotta online.",
  offerta_attiva: true,
  descrizione_autolavaggio:
    "Autolavaggio self-service LILO a Trieste: lavaggio completo interno ed esterno, ingresso da Via Schiaparelli 21/A e uscita su Via G. De Coletti 7.",
  autolavaggio_lista_servizi:
    "Lavaggio esterno completo\nLavaggio interno con aspirazione\nAsciugatura professionale\nTrattamenti carrozzeria e cerchi\nSanificazione abitacolo",
  servizi_noleggio_lista:
    "Noleggio giornaliero e settimanale\nFurgoni, pulmini e auto\nRitiro in sede a Trieste\nPreventivi personalizzati per aziende",
  created_at: now,
  updated_at: now,
};

export const DEMO_SEO_SETTINGS: SeoSettings[] = [
  {
    page_key: "home",
    seo_title: "Noleggio Furgoni e Auto a Trieste | LILO S.r.l.",
    seo_description:
      "Noleggio auto e furgoni a Trieste: flotta moderna, tariffe trasparenti, ritiro in sede. LILO S.r.l. dal 2003 al servizio di privati e aziende.",
    seo_keywords: ["noleggio auto trieste", "noleggio furgoni trieste", "autonoleggio trieste", "LILO S.r.l."],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    created_at: now,
    updated_at: now,
  },
  {
    page_key: "flotta",
    seo_title: "Flotta Noleggio Furgoni e Auto a Trieste | Lilo Srl",
    seo_description:
      "Scopri la flotta LILO S.r.l. a Trieste: auto, pulmini 9 posti e furgoni da piccoli a XL. Tariffe trasparenti, ritiro in sede.",
    seo_keywords: ["flotta noleggio trieste", "furgoni noleggio", "pulmini 9 posti trieste"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    created_at: now,
    updated_at: now,
  },
  {
    page_key: "autolavaggio",
    seo_title: "Autolavaggio Trieste | LILO S.r.l.",
    seo_description:
      "Autolavaggio self-service e professionale a Trieste. Lavaggio interno ed esterno, ingresso Via Schiaparelli, uscita Via De Coletti.",
    seo_keywords: ["autolavaggio trieste", "lavaggio auto trieste", "LILO autolavaggio"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    created_at: now,
    updated_at: now,
  },
  {
    page_key: "tariffe",
    seo_title: "Prezzi Noleggio Auto e Furgoni Trieste | LILO S.r.l.",
    seo_description:
      "Listino prezzi noleggio auto e furgoni a Trieste aggiornato dalla flotta LILO. Tariffe giornaliere trasparenti.",
    seo_keywords: ["prezzi noleggio furgoni trieste", "tariffe autonoleggio trieste"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    created_at: now,
    updated_at: now,
  },
  {
    page_key: "offerte",
    seo_title: "Offerta del Mese — LILO Autonoleggio Trieste",
    seo_description:
      "Promozioni mensili su noleggio auto e furgoni a Trieste. Scopri le occasioni LILO S.r.l.",
    seo_keywords: ["offerta noleggio trieste", "promozioni autonoleggio"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    created_at: now,
    updated_at: now,
  },
  {
    page_key: "chi-siamo",
    seo_title: "Chi Siamo — LILO SRL | 20 Anni di Esperienza a Trieste",
    seo_description:
      "Dal 2003 LILO S.r.l. è leader a Trieste in trasporti, noleggio furgoni e auto, autolavaggio professionale.",
    seo_keywords: ["LILO S.r.l.", "noleggio trieste", "trasporti trieste"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    created_at: now,
    updated_at: now,
  },
  {
    page_key: "contatti",
    seo_title: "Contatti — LILO Autonoleggio Trieste",
    seo_description:
      "Contatta LILO S.r.l. per noleggio auto e furgoni a Trieste. Telefono, email, sede in Viale Campi Elisi.",
    seo_keywords: ["contatti LILO trieste", "noleggio auto trieste contatti"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    created_at: now,
    updated_at: now,
  },
  {
    page_key: "privacy",
    seo_title: "Privacy Policy | LILO S.r.l. Autonoleggio Trieste",
    seo_description:
      "Informativa privacy e trattamento dati personali di LILO S.r.l. — noleggio auto e furgoni a Trieste.",
    seo_keywords: ["privacy LILO", "GDPR autonoleggio trieste"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    created_at: now,
    updated_at: now,
  },
  {
    page_key: "cookie-policy",
    seo_title: "Cookie Policy | LILO S.r.l.",
    seo_description:
      "Informativa sui cookie utilizzati dal sito LILO S.r.l. e gestione del consenso.",
    seo_keywords: ["cookie policy", "consenso cookie LILO"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    created_at: now,
    updated_at: now,
  },
  {
    page_key: "termini-condizioni",
    seo_title: "Termini e Condizioni | LILO Autonoleggio Trieste",
    seo_description:
      "Termini e condizioni di utilizzo del sito e dei servizi di noleggio veicoli LILO S.r.l. a Trieste.",
    seo_keywords: ["termini noleggio", "condizioni LILO trieste"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    created_at: now,
    updated_at: now,
  },
];
