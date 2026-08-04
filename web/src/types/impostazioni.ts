export interface ImpostazioniSito {

  id: string;

  orari_noleggio: string;

  orari_autolavaggio: string;

  telefono_noleggio: string;

  telefono_autolavaggio: string;

  email_contatto: string;

  email_preventivi: string;

  social_facebook: string | null;
  social_facebook_autolavaggio: string | null;

  social_instagram: string | null;

  social_linkedin: string | null;

  indirizzo_noleggio: string;

  indirizzo_autolavaggio: string;

  testo_hero_home: string;

  hero_titolo_home: string;

  hero_badge_home: string;

  home_punti_forza_titolo: string;

  home_punti_forza_json: string | null;

  chi_siamo_hero_titolo: string | null;

  chi_siamo_hero_sottotitolo: string | null;

  chi_siamo_intro: string | null;

  offerta_titolo: string;

  offerta_descrizione: string | null;

  offerta_attiva: boolean;

  descrizione_autolavaggio: string;

  autolavaggio_lista_servizi: string | null;

  servizi_noleggio_lista: string | null;

  updated_at: string;

}



export const IMPOSTAZIONI_SITO_ID = "a0000000-0000-0000-0000-000000000001";

