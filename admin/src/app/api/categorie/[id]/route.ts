import { NextRequest } from "next/server";
import {
  handleRouteError,
  jsonError,
  jsonSuccess,
  requireAdmin,
} from "@/lib/api-utils";
import { buildCategoriaSlug } from "@/lib/slug";
import {
  deleteCategoria,
  getCategoriaById,
  updateCategoria,
} from "@/lib/services/categorie";
import { categoriaUpdateSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await context.params;
    const categoria = await getCategoriaById(id);
    if (!categoria) return jsonError("Categoria non trovata", 404);

    return jsonSuccess(categoria);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await context.params;
    const body = await request.json();
    const parsed = categoriaUpdateSchema.parse(body);

    const payload: Record<string, unknown> = { ...parsed };
    if (parsed.nome && !parsed.slug) {
      payload.slug = buildCategoriaSlug(parsed.nome);
    }

    const data = await updateCategoria(id, payload);
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await context.params;
    await deleteCategoria(id);
    return jsonSuccess({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
