import { NextRequest } from "next/server";
import {
  handleRouteError,
  jsonError,
  jsonSuccess,
  requireAdmin,
} from "@/lib/api-utils";
import { getVeicoloById, uploadVeicoloFoto } from "@/lib/services/veicoli";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await context.params;
    const veicolo = await getVeicoloById(id);
    if (!veicolo) return jsonError("Veicolo non trovato", 404);

    return jsonSuccess(veicolo.foto ?? []);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await context.params;
    const veicolo = await getVeicoloById(id);
    if (!veicolo) return jsonError("Veicolo non trovato", 404);

    const formData = await request.formData();
    const file = formData.get("foto");

    if (!(file instanceof File) || file.size === 0) {
      return jsonError("File foto mancante o non valido", 400);
    }

    const altText =
      formData.get("alt_text")?.toString() ||
      `${veicolo.marca} ${veicolo.modello}`;
    const isCopertina = formData.get("is_copertina") === "true";

    const foto = await uploadVeicoloFoto(id, file, altText, isCopertina);
    return jsonSuccess(foto, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
