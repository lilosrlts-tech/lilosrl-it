import { NextRequest } from "next/server";
import {
  handleRouteError,
  jsonError,
  jsonSuccess,
  requireAdmin,
} from "@/lib/api-utils";
import {
  deleteAccessorio,
  getAccessorioById,
  updateAccessorio,
} from "@/lib/services/accessori";
import { accessorioUpdateSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await context.params;
    const item = await getAccessorioById(id);
    if (!item) return jsonError("Accessorio non trovato", 404);
    return jsonSuccess(item);
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
    const parsed = accessorioUpdateSchema.parse(body);
    const data = await updateAccessorio(id, parsed);
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
    await deleteAccessorio(id);
    return jsonSuccess({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
