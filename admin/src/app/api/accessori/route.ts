import { NextRequest } from "next/server";
import {
  handleRouteError,
  jsonSuccess,
  requireAdmin,
} from "@/lib/api-utils";
import { buildCategoriaSlug } from "@/lib/slug";
import {
  createAccessorio,
  listAccessori,
} from "@/lib/services/accessori";
import { accessorioCreateSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const includeInactive =
      request.nextUrl.searchParams.get("include_inactive") !== "false";
    const data = await listAccessori(includeInactive);
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    const parsed = accessorioCreateSchema.parse(body);
    const slug = parsed.slug ?? buildCategoriaSlug(parsed.nome);

    const data = await createAccessorio({
      ...parsed,
      slug,
      descrizione: parsed.descrizione ?? null,
      deposito: parsed.deposito ?? null,
      deposito_richiesto: parsed.deposito_richiesto ?? false,
      quantita_max: parsed.quantita_max ?? 5,
      attivo: parsed.attivo ?? true,
      ordine: parsed.ordine ?? 0,
    });

    return jsonSuccess(data, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
