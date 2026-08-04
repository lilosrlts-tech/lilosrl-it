import { NextRequest } from "next/server";
import {
  handleRouteError,
  jsonSuccess,
  requireAdmin,
} from "@/lib/api-utils";
import { buildCategoriaSlug } from "@/lib/slug";
import {
  createPromozioneDurata,
  listPromozioniDurata,
} from "@/lib/services/promozioni";
import { z } from "zod";

const createSchema = z.object({
  nome: z.string().min(1),
  slug: z.string().optional(),
  descrizione_pubblica: z.string().optional().nullable(),
  giorni_minimo: z.number().int().min(1),
  tipo: z.enum(["paga_giorni", "percentuale"]),
  giorni_a_pagamento: z.number().int().min(1).optional().nullable(),
  sconto_percentuale: z.number().min(0.01).max(100).optional().nullable(),
  attivo: z.boolean().optional(),
  ordine: z.number().int().min(0).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;
    return jsonSuccess(await listPromozioniDurata());
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;
    const parsed = createSchema.parse(await request.json());
    const slug = parsed.slug?.trim() || buildCategoriaSlug(parsed.nome);
    const data = await createPromozioneDurata({
      ...parsed,
      slug,
      descrizione_pubblica: parsed.descrizione_pubblica ?? null,
      giorni_a_pagamento: parsed.tipo === "paga_giorni" ? parsed.giorni_a_pagamento : null,
      sconto_percentuale: parsed.tipo === "percentuale" ? parsed.sconto_percentuale : null,
      attivo: parsed.attivo ?? true,
      ordine: parsed.ordine ?? 0,
    });
    return jsonSuccess(data, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
