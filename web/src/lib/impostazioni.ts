import { unstable_cache } from "next/cache";
import { createPublicClient, isSupabaseConfigured } from "@/lib/supabase";
import { isDemoMode } from "@/lib/demo-veicolo";
import {
  NAP_AUTOLAVAGGIO_ADDRESS_FULL,
  NAP_AUTOLAVAGGIO_NOTE,
  NAP_EMAIL,
  NAP_NOLEGGIO_ADDRESS_FULL,
  NAP_ORARI_AUTOLAVAGGIO,
  NAP_ORARI_NOLEGGIO,
  NAP_PHONE_DISPLAY,
  NAP_SERVIZI_AUTOLAVAGGIO,
  NAP_SERVIZI_NOLEGGIO,
} from "@/lib/nap";
import { IMPOSTAZIONI_SITO_ID, type ImpostazioniSito } from "@/types/impostazioni";

const IMPOSTAZIONI_SELECT =
  "id, orari_noleggio, orari_autolavaggio, telefono_noleggio, telefono_autolavaggio, email_contatto, email_preventivi, social_facebook, social_facebook_autolavaggio, social_instagram, social_linkedin, indirizzo_noleggio, indirizzo_autolavaggio, testo_hero_home, hero_titolo_home, hero_badge_home, home_punti_forza_titolo, home_punti_forza_json, chi_siamo_hero_titolo, chi_siamo_hero_sottotitolo, chi_siamo_intro, offerta_titolo, offerta_descrizione, offerta_attiva, descrizione_autolavaggio, autolavaggio_lista_servizi, servizi_noleggio_lista, updated_at";

export const DEMO_IMPOSTAZIONI: ImpostazioniSito = {
  id: IMPOSTAZIONI_SITO_ID,
  orari_noleggio: NAP_ORARI_NOLEGGIO,
  orari_autolavaggio: NAP_ORARI_AUTOLAVAGGIO,
  telefono_noleggio: NAP_PHONE_DISPLAY,
  telefono_autolavaggio: NAP_PHONE_DISPLAY,
  email_contatto: NAP_EMAIL,
  email_preventivi: NAP_EMAIL,
  social_facebook: "https://www.facebook.com/LiloAutonoleggioFurgoniTrieste",
  social_facebook_autolavaggio: "https://www.facebook.com/LiloAutolavaggioTrieste/",
  social_instagram: null,
  social_linkedin: null,
  indirizzo_noleggio: NAP_NOLEGGIO_ADDRESS_FULL,
  indirizzo_autolavaggio: `${NAP_AUTOLAVAGGIO_ADDRESS_FULL}\n${NAP_AUTOLAVAGGIO_NOTE}`,
  testo_hero_home:
    "LILO dispone di una flotta reale di oltre 50 mezzi tra auto, furgoni di varie dimensioni e pulmini 9 posti. Tariffe trasparenti e ritiro in sede in Viale Campi Elisi — ideale per privati, aziende e traslochi.",
  hero_titolo_home: "Noleggio auto e furgoni a Trieste",
  hero_badge_home: "",
  home_punti_forza_titolo: "I punti di forza che fanno la differenza",
  home_punti_forza_json: null,
  chi_siamo_hero_titolo:
    "LILO SRL: 20 ANNI DI ESPERIENZA NEI TRASPORTI E SERVIZI A TRIESTE",
  chi_siamo_hero_sottotitolo: "La Nostra Storia: Dal 2003 a Oggi",
  chi_siamo_intro:
    "Dal 2003 LILO S.r.l. opera a Trieste con professionalità nei trasporti, nel noleggio veicoli e nei servizi integrati per privati, aziende ed enti. LILO S.r.l. dispone di una flotta reale di oltre 50 mezzi tra auto, furgoni di varie dimensioni e pulmini 9 posti.",
  offerta_titolo: "Offerta del Mese",
  offerta_descrizione:
    "Promo Weekend riservata ai Furgoni grandi (uso città): 48 ore (sabato–lunedì) a 83€ IVA inclusa.",
  offerta_attiva: true,
  descrizione_autolavaggio:
    "Autolavaggio self-service a Trieste: lavaggio completo interno ed esterno, ingresso da Via Schiaparelli 21/A e uscita su Via G. De Coletti 7. Asciugatura, aspirazione e trattamenti disponibili in loco.",
  autolavaggio_lista_servizi: NAP_SERVIZI_AUTOLAVAGGIO.join("\n"),
  servizi_noleggio_lista: NAP_SERVIZI_NOLEGGIO.join("\n"),
  updated_at: new Date().toISOString(),
};

export function telefonoE164(telefono: string): string {
  const digits = telefono.replace(/\D/g, "");
  if (digits.startsWith("39")) return `+${digits}`;
  if (digits.startsWith("0")) return `+39${digits}`;
  return `+39${digits}`;
}

export function formatOrari(testo: string): string[] {
  return testo
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);
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
