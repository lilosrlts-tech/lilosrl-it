import { NextRequest } from "next/server";
import {
  handleRouteError,
  jsonError,
  jsonSuccess,
  requireAdmin,
} from "@/lib/api-utils";
import { buildVeicoloSlug } from "@/lib/slug";
import { setVeicoloAccessori } from "@/lib/services/accessori";
import {
  deleteVeicolo,
  getVeicoloById,
  setVeicoloDisponibilita,
  updateVeicolo,
  upsertPrezzoGiornaliero,
} from "@/lib/services/veicoli";
import { veicoloUpdateSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await context.params;
    const veicolo = await getVeicoloById(id);
    if (!veicolo) return jsonError("Veicolo non trovato", 404);

    return jsonSuccess(veicolo);
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
    const parsed = veicoloUpdateSchema.parse(body);
    const { prezzo_giornaliero, accessori_ids, ...veicoloData } = parsed;

    const payload: Record<string, unknown> = { ...veicoloData };

    if (parsed.marca && parsed.modello && !parsed.slug) {
      payload.slug = buildVeicoloSlug(
        parsed.marca,
        parsed.modello,
        parsed.versione,
      );
    }

    const action = body.action as string | undefined;
    if (action === "set_disponibilita") {
      const attivo = Boolean(body.attivo);
      const veicolo = await setVeicoloDisponibilita(id, attivo);
      return jsonSuccess(veicolo);
    }

    const veicolo = await updateVeicolo(id, payload);

    if (prezzo_giornaliero !== undefined) {
      await upsertPrezzoGiornaliero(id, prezzo_giornaliero);
    }

    if (accessori_ids !== undefined) {
      await setVeicoloAccessori(id, accessori_ids);
    }

    const dettaglio = await getVeicoloById(id);
    return jsonSuccess(dettaglio ?? veicolo);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await context.params;
    const hard = request.nextUrl.searchParams.get("hard") === "true";

    if (hard) {
      await deleteVeicolo(id);
      return jsonSuccess({ deleted: true });
    }

    const veicolo = await setVeicoloDisponibilita(id, false);
    return jsonSuccess({ ...veicolo, soft_deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
