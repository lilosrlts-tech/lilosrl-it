import { unstable_cache } from "next/cache";

import { createPublicClient, isSupabaseConfigured } from "@/lib/supabase";

import { isDemoMode } from "@/lib/demo-veicolo";

import { IMPOSTAZIONI_SITO_ID, type ImpostazioniSito } from "@/types/impostazioni";



const IMPOSTAZIONI_SELECT =

  "id, orari_noleggio, orari_autolavaggio, telefono_noleggio, telefono_autolavaggio, email_contatto, email_preventivi, social_facebook, social_facebook_autolavaggio, social_instagram, social_linkedin, indirizzo_noleggio, indirizzo_autolavaggio, testo_hero_home, hero_titolo_home, hero_badge_home, home_punti_forza_titolo, home_punti_forza_json, chi_siamo_hero_titolo, chi_siamo_hero_sottotitolo, chi_siamo_intro, offerta_titolo, offerta_descrizione, offerta_attiva, descrizione_autolavaggio, autolavaggio_lista_servizi, servizi_noleggio_lista, updated_at";



export const DEMO_IMPOSTAZIONI: ImpostazioniSito = {

  id: IMPOSTAZIONI_SITO_ID,

  orari_noleggio:
    "Lunedì – Venerdì: 08:30 – 12:30 / 15:00 – 17:30\nSabato: 08:30 – 12:30\nDomenica: Chiuso",

  orari_autolavaggio: "Lunedì – Sabato: 09:00 – 13:00 / 14:00 – 18:30\nDomenica: Chiuso",

  telefono_noleggio: "040 2471720",

  telefono_autolavaggio: "040 2471720",

  email_contatto: "info@lilosrl.it",

  email_preventivi: "info@lilosrl.it",

  social_facebook: "https://www.facebook.com/LiloAutonoleggioFurgoniTrieste",
  social_facebook_autolavaggio: "https://www.facebook.com/LiloAutolavaggioTrieste/",

  social_instagram: null,

  social_linkedin: null,

  indirizzo_noleggio: "Viale Campi Elisi 38/b, 34143 Trieste (TS)",

  indirizzo_autolavaggio:
    "Via Giovanni Schiaparelli 21/a, 34143 Trieste (TS)\nIngresso da Via Schiaparelli 21/a — Uscita su Via G. De Coletti 7",

  testo_hero_home:

    "Noleggio auto e furgoni a Trieste con LILO S.r.l.: flotta moderna, tariffe trasparenti e ritiro in sede in Viale Campi Elisi. Ideale per privati, aziende e traslochi.",

  hero_titolo_home: "Noleggio auto e furgoni a Trieste",

  hero_badge_home: "Trieste · Piazza Unità d'Italia",

  home_punti_forza_titolo: "I punti di forza che fanno la differenza",

  home_punti_forza_json: null,

  chi_siamo_hero_titolo:

    "LILO SRL: 20 ANNI DI ESPERIENZA NEI TRASPORTI E SERVIZI A TRIESTE",

  chi_siamo_hero_sottotitolo: "La Nostra Storia: Dal 2003 a Oggi",

  chi_siamo_intro:

    "Dal 2003 LILO S.r.l. opera a Trieste con professionalità nei trasporti, nel noleggio veicoli e nei servizi integrati per privati, aziende ed enti.",

  offerta_titolo: "Offerta del Mese",

  offerta_descrizione:
    "Promo Weekend riservata ai Furgoni grandi (uso città): 48 ore (sabato–lunedì) a 83€ IVA inclusa.",

  offerta_attiva: true,

  descrizione_autolavaggio:

    "Autolavaggio self-service a Trieste: lavaggio completo interno ed esterno, ingresso da Via Schiaparelli 21/A e uscita su Via G. De Coletti 7. Asciugatura, aspirazione e trattamenti disponibili in loco.",

  autolavaggio_lista_servizi:
    "Lavaggio Completo Interno ed Esterno\nSanificazione Abitacolo\nLavaggio e Cura Tappezzeria\nAsciugatura Professionale e Trattamenti Carrozzeria",

  servizi_noleggio_lista:
    "Noleggio Furgoni (S, M, L, XL)\nNoleggio Autovetture e Utilitarie\nNoleggio Pulmini 9 Posti\nRitiro e Consegna Veicoli in Sede",

  updated_at: new Date().toISOString(),

};



export function telefonoE164(telefono: string): string {

  const digits = telefono.replace(/\D/g, "");

  if (digits.startsWith("39")) return `+${digits}`;

  if (digits.startsWith("0")) return `+39${digits}`;

  return `+39${digits}`;

}



export function formatOrari(testo: string): string[] {

  return testo.split("\n").map((r) => r.trim()).filter(Boolean);

}



export async function getImpostazioniSito(): Promise<ImpostazioniSito> {
  if (isDemoMode() || !isSupabaseConfigured()) {
    return { ...DEMO_IMPOSTAZIONI };
  }

  return unstable_cache(
    async () => {
      try {
        const supabase = createPublicClient();
        const { data, error } = await supabase
          .from("impostazioni_sito")
          .select(IMPOSTAZIONI_SELECT)
          .eq("id", IMPOSTAZIONI_SITO_ID)
          .maybeSingle();

        if (error) {
          console.error("[impostazioni]", error.message);
          return { ...DEMO_IMPOSTAZIONI };
        }
        if (!data) return { ...DEMO_IMPOSTAZIONI };

        const row = data as ImpostazioniSito;
        // Typo storico Lila → Lilo (pagina Facebook reale)
        if (
          row.social_facebook &&
          /LilaAutonoleggio/i.test(row.social_facebook)
        ) {
          row.social_facebook =
            "https://www.facebook.com/LiloAutonoleggioFurgoniTrieste";
        }
        return row;
      } catch (err) {
        console.error("[impostazioni]", err);
        return { ...DEMO_IMPOSTAZIONI };
      }
    },
    ["impostazioni-sito"],
    { revalidate: 300 },
  )();
}

