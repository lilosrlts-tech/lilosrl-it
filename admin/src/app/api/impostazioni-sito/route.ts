import { NextRequest } from "next/server";
import {
  handleRouteError,
  jsonSuccess,
  requireAdmin,
} from "@/lib/api-utils";
import { getImpostazioniSito, updateImpostazioniSito } from "@/lib/services/impostazioni";
import { impostazioniSitoUpdateSchema } from "@/lib/validations-impostazioni";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const data = await getImpostazioniSito();
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    const parsed = impostazioniSitoUpdateSchema.parse(body);

    const data = await updateImpostazioniSito(parsed);
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
