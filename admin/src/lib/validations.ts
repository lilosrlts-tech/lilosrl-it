import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categoriaCreateSchema = z.object({
  nome: z.string().min(1, "Il nome è obbligatorio"),
  slug: z.string().regex(slugRegex, "Slug non valido").optional(),
  descrizione: z.string().optional().nullable(),
  icona: z.string().optional().nullable(),
  ordine: z.number().int().min(0).optional(),
  attivo: z.boolean().optional(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
  seo_keywords: z.array(z.string()).optional(),
});

export const categoriaUpdateSchema = categoriaCreateSchema.partial();

export const veicoloCreateSchema = z.object({
  categoria_id: z.string().uuid("Categoria non valida"),
  targa: z.string().min(1, "La targa è obbligatoria"),
  marca: z.string().min(1, "La marca è obbligatoria"),
  modello: z.string().min(1, "Il modello è obbligatorio"),
  versione: z.string().optional().nullable(),
  anno_immatricolazione: z.number().int().min(1980).max(2100).optional().nullable(),
  colore: z.string().optional().nullable(),
  alimentazione: z.string().optional().nullable(),
  cambio: z.string().optional().nullable(),
  posti: z.number().int().min(1).max(50).optional().nullable(),
  porte: z.number().int().min(2).max(6).optional().nullable(),
  note_interne: z.string().optional().nullable(),
  slug: z.string().regex(slugRegex, "Slug non valido").optional(),
  pubblicato: z.boolean().optional(),
  attivo: z.boolean().optional(),
  in_evidenza: z.boolean().optional(),
  ordine: z.number().int().min(0).optional(),
  titolo_pubblico: z.string().optional().nullable(),
  sottotitolo: z.string().optional().nullable(),
  descrizione_breve: z.string().optional().nullable(),
  descrizione_completa: z.string().optional().nullable(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
  seo_keywords: z.array(z.string()).optional(),
  ai_summary: z.string().optional().nullable(),
  ai_highlights: z.array(z.string()).optional(),
  ai_faq: z
    .array(
      z.object({
        q: z.string().min(1),
        a: z.string().min(1),
      }),
    )
    .optional(),
  prezzo_giornaliero: z.number().min(0, "Il prezzo deve essere >= 0").optional(),
  portata_kg: z.number().int().min(0).optional().nullable(),
  volume_carico_mc: z.number().min(0).optional().nullable(),
  trazione: z.string().optional().nullable(),
  passo: z.string().optional().nullable(),
  tetto: z.string().optional().nullable(),
  sensori_parcheggio: z.boolean().optional().nullable(),
  lunghezza_mm: z.number().int().min(0).optional().nullable(),
  larghezza_mm: z.number().int().min(0).optional().nullable(),
  altezza_mm: z.number().int().min(0).optional().nullable(),
  vano_lunghezza_mm: z.number().int().min(0).optional().nullable(),
  vano_larghezza_mm: z.number().int().min(0).optional().nullable(),
  vano_altezza_mm: z.number().int().min(0).optional().nullable(),
  volume_metri_cubi: z.number().min(0).optional().nullable(),
  portata_utile_kg: z.number().int().min(0).optional().nullable(),
  lunghezza_vano_mm: z.number().int().min(0).optional().nullable(),
  larghezza_vano_mm: z.number().int().min(0).optional().nullable(),
  altezza_vano_mm: z.number().int().min(0).optional().nullable(),
  larghezza_tra_passaruota_mm: z.number().int().min(0).optional().nullable(),
  capacita_bagagliaio_valigie: z.number().int().min(0).max(20).optional().nullable(),
  classe_ambientale: z.string().optional().nullable(),
  connessione_smartphone: z.string().optional().nullable(),
  configurazione_sedili: z.string().optional().nullable(),
  climatizzazione_posteriore: z.boolean().optional().nullable(),
  unita_disponibili: z.number().int().min(1).max(99).optional().nullable(),
  accessori_ids: z.array(z.string().uuid()).optional(),
  promo_durata_attiva: z.boolean().optional(),
});

export const accessorioCreateSchema = z.object({
  nome: z.string().min(1, "Il nome è obbligatorio"),
  slug: z.string().regex(slugRegex, "Slug non valido").optional(),
  descrizione: z.string().optional().nullable(),
  prezzo_giornaliero: z.number().min(0),
  deposito: z.number().min(0).optional().nullable(),
  deposito_richiesto: z.boolean().optional(),
  quantita_max: z.number().int().min(1).max(20).optional(),
  attivo: z.boolean().optional(),
  ordine: z.number().int().min(0).optional(),
});

export const accessorioUpdateSchema = accessorioCreateSchema.partial();
export const veicoloUpdateSchema = veicoloCreateSchema.partial();

export const prezzoUpdateSchema = z.object({
  tipo_tariffa: z
    .enum(["giornaliero", "weekend", "settimanale", "mensile", "ora", "custom"])
    .default("giornaliero"),
  importo: z.number().min(0),
  descrizione: z.string().optional().nullable(),
  attivo: z.boolean().optional(),
});

export type CategoriaCreateInput = z.infer<typeof categoriaCreateSchema>;
export type CategoriaUpdateInput = z.infer<typeof categoriaUpdateSchema>;
export type VeicoloCreateInput = z.infer<typeof veicoloCreateSchema>;
export type VeicoloUpdateInput = z.infer<typeof veicoloUpdateSchema>;
