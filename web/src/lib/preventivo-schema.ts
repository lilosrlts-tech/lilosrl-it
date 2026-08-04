import { z } from "zod";

const accessorioRichiestoSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  quantita: z.number().int().min(1).max(20),
  prezzo_giornaliero: z.number().min(0),
});

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data non valida")
  .refine((v) => !Number.isNaN(Date.parse(`${v}T12:00:00`)), "Data non valida");

/** Solo cifre; accetta +39 / spazi / trattini in ingresso. */
export function digitsFromPhone(raw: string): string {
  return String(raw).replace(/\D/g, "");
}

export function isValidPhone(raw: string): boolean {
  const digits = digitsFromPhone(raw);
  // IT cell/fisso tipici 9–11 cifre; con prefisso paese fino a 15 (E.164)
  return digits.length >= 8 && digits.length <= 15;
}

function todayIsoLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const preventivoSchema = z
  .object({
    veicolo_id: z.string().min(1, "Veicolo mancante"),
    veicolo_slug: z.string().min(1).optional().nullable(),
    veicolo_name: z.string().min(1),
    nome: z.string().min(2, "Nome troppo corto").max(120),
    email: z.string().email("Email non valida").max(200),
    telefono: z
      .string()
      .min(6, "Telefono non valido")
      .max(40)
      .refine(isValidPhone, "Telefono non valido (min. 8 cifre)"),
    km_previsti: z.coerce
      .number({ invalid_type_error: "Indica i km previsti" })
      .positive("I km devono essere maggiori di 0")
      .max(100_000, "Km non validi"),
    destinazione: z.enum(["trieste-citta", "fuori-citta", "estero"], {
      required_error: "Seleziona la destinazione",
      invalid_type_error: "Seleziona la destinazione",
    }),
    data_ritiro: isoDate,
    data_riconsegna: isoDate,
    messaggio: z.string().max(2000).optional().nullable(),
    accessori: z.array(accessorioRichiestoSchema).max(20).optional().default([]),
    /** Honeypot anti-bot: se valorizzato, la route risponde OK senza salvare */
    website: z.string().max(200).optional().nullable(),
  })
  .refine((data) => data.data_ritiro >= todayIsoLocal(), {
    message: "La data di ritiro non può essere nel passato",
    path: ["data_ritiro"],
  })
  .refine((data) => data.data_riconsegna >= data.data_ritiro, {
    message: "La data di riconsegna deve essere successiva al ritiro",
    path: ["data_riconsegna"],
  });

export type PreventivoInput = z.infer<typeof preventivoSchema>;
export type AccessorioRichiesto = z.infer<typeof accessorioRichiestoSchema>;

export function parsePreventivo(body: unknown): PreventivoInput {
  return preventivoSchema.parse(body);
}
