import { NextRequest } from "next/server";
import {
  handleRouteError,
  jsonError,
  jsonSuccess,
  requireAdmin,
} from "@/lib/api-utils";
import { deleteVeicoloFoto } from "@/lib/services/veicoli";

type RouteContext = { params: Promise<{ id: string; fotoId: string }> };

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id, fotoId } = await context.params;
    await deleteVeicoloFoto(fotoId, id);
    return jsonSuccess({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
