import { NextRequest } from "next/server";
import {
  handleRouteError,
  jsonSuccess,
  requireAdmin,
} from "@/lib/api-utils";
import { updatePromozioneDurata } from "@/lib/services/promozioni";
import { z } from "zod";

const updateSchema = z.object({
  nome: z.string().min(1).optional(),
  descrizione_pubblica: z.string().optional().nullable(),
  giorni_minimo: z.number().int().min(1).optional(),
  tipo: z.enum(["paga_giorni", "percentuale"]).optional(),
  giorni_a_pagamento: z.number().int().min(1).optional().nullable(),
  sconto_percentuale: z.number().min(0.01).max(100).optional().nullable(),
  attivo: z.boolean().optional(),
  ordine: z.number().int().min(0).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;
    const { id } = await context.params;
    const parsed = updateSchema.parse(await request.json());
    const data = await updatePromozioneDurata(id, parsed);
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
