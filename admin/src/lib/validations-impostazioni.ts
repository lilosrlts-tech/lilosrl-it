import { z } from "zod";

/** Accetta stringa vuota, null o URL valido (es. social non compilati). */
const optionalUrl = z.preprocess(
  (value) => {
    if (value === null || value === undefined) return null;
    const trimmed = String(value).trim();
    return trimmed === "" ? null : trimmed;
  },
  z.union([z.string().url("URL non valido"), z.null()])
);

export const impostazioniSitoUpdateSchema = z.object({
  orari_noleggio: z.string().min(1).optional(),
  orari_autolavaggio: z.string().min(1).optional(),
  telefono_noleggio: z.string().min(1).optional(),
  telefono_autolavaggio: z.string().min(1).optional(),
  email_contatto: z.string().email().optional(),
  email_preventivi: z.string().email().optional(),
  social_facebook: optionalUrl.optional(),
  social_facebook_autolavaggio: optionalUrl.optional(),
  social_instagram: optionalUrl.optional(),
  social_linkedin: optionalUrl.optional(),
  indirizzo_noleggio: z.string().min(1).optional(),
  indirizzo_autolavaggio: z.string().min(1).optional(),
  testo_hero_home: z.string().min(1).optional(),
  hero_titolo_home: z.string().min(1).optional(),
  hero_badge_home: z.string().min(1).optional(),
  home_punti_forza_titolo: z.string().min(1).optional(),
  home_punti_forza_json: z.string().nullable().optional(),
  chi_siamo_hero_titolo: z.string().nullable().optional(),
  chi_siamo_hero_sottotitolo: z.string().nullable().optional(),
  chi_siamo_intro: z.string().nullable().optional(),
  offerta_titolo: z.string().min(1).optional(),
  offerta_descrizione: z.string().nullable().optional(),
  offerta_attiva: z.boolean().optional(),
  descrizione_autolavaggio: z.string().min(1).optional(),
  autolavaggio_lista_servizi: z.string().nullable().optional(),
  servizi_noleggio_lista: z.string().nullable().optional(),
});

export type ImpostazioniSitoUpdateInput = z.infer<typeof impostazioniSitoUpdateSchema>;
