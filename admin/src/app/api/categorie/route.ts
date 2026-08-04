import { NextRequest } from "next/server";
import {
  handleRouteError,
  jsonError,
  jsonSuccess,
  requireAdmin,
} from "@/lib/api-utils";
import { buildCategoriaSlug } from "@/lib/slug";
import {
  createCategoria,
  listCategorie,
} from "@/lib/services/categorie";
import { categoriaCreateSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const includeInactive =
      request.nextUrl.searchParams.get("include_inactive") !== "false";

    const data = await listCategorie(includeInactive);
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
    const parsed = categoriaCreateSchema.parse(body);

    const slug = parsed.slug ?? buildCategoriaSlug(parsed.nome);
    const data = await createCategoria({
      ...parsed,
      slug,
      seo_keywords: parsed.seo_keywords ?? [],
      attivo: parsed.attivo ?? true,
      ordine: parsed.ordine ?? 0,
    });

    return jsonSuccess(data, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
