import { NextRequest } from "next/server";
import {
  handleRouteError,
  jsonSuccess,
  requireAdmin,
} from "@/lib/api-utils";
import { buildVeicoloSlug } from "@/lib/slug";
import { setVeicoloAccessori } from "@/lib/services/accessori";
import {
  createVeicolo,
  getVeicoloById,
  listVeicoli,
  upsertPrezzoGiornaliero,
  uploadVeicoloFoto,
} from "@/lib/services/veicoli";
import { veicoloCreateSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const data = await listVeicoli();
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      return await createVeicoloFromForm(request);
    }

    const body = await request.json();
    const parsed = veicoloCreateSchema.parse(body);
    const { prezzo_giornaliero, accessori_ids, ...veicoloData } = parsed;

    const slug =
      parsed.slug ?? buildVeicoloSlug(parsed.marca, parsed.modello, parsed.targa);

    const veicolo = await createVeicolo({
      ...veicoloData,
      slug,
      seo_keywords: parsed.seo_keywords ?? [],
      pubblicato: parsed.pubblicato ?? false,
      attivo: parsed.attivo ?? true,
      ordine: parsed.ordine ?? 0,
    });

    if (prezzo_giornaliero !== undefined) {
      await upsertPrezzoGiornaliero(veicolo.id, prezzo_giornaliero);
    }

    if (accessori_ids) {
      await setVeicoloAccessori(veicolo.id, accessori_ids);
    }

    const dettaglio = await getVeicoloById(veicolo.id);
    return jsonSuccess(dettaglio ?? veicolo, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}

async function createVeicoloFromForm(request: NextRequest) {
  const formData = await request.formData();

  function numField(key: string): number | undefined {
    const v = formData.get(key)?.toString().trim();
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }

  function intField(key: string): number | undefined {
    const n = numField(key);
    return n === undefined ? undefined : Math.round(n);
  }

  const raw = {
    categoria_id: String(formData.get("categoria_id") ?? ""),
    targa: String(formData.get("targa") ?? ""),
    marca: String(formData.get("marca") ?? ""),
    modello: String(formData.get("modello") ?? ""),
    versione: formData.get("versione")?.toString() || null,
    colore: formData.get("colore")?.toString() || null,
    alimentazione: formData.get("alimentazione")?.toString() || null,
    descrizione_breve: formData.get("descrizione_breve")?.toString() || null,
    descrizione_completa: formData.get("descrizione_completa")?.toString() || null,
    titolo_pubblico: formData.get("titolo_pubblico")?.toString() || null,
    prezzo_giornaliero: numField("prezzo_giornaliero"),
    volume_metri_cubi: numField("volume_metri_cubi"),
    portata_utile_kg: intField("portata_utile_kg"),
    lunghezza_vano_mm: intField("lunghezza_vano_mm"),
    larghezza_vano_mm: intField("larghezza_vano_mm"),
    altezza_vano_mm: intField("altezza_vano_mm"),
    larghezza_tra_passaruota_mm: intField("larghezza_tra_passaruota_mm"),
    portata_kg: intField("portata_utile_kg"),
    volume_carico_mc: numField("volume_metri_cubi"),
    vano_lunghezza_mm: intField("lunghezza_vano_mm"),
    vano_larghezza_mm: intField("larghezza_vano_mm"),
    vano_altezza_mm: intField("altezza_vano_mm"),
    ai_summary: formData.get("ai_summary")?.toString() || null,
    ai_highlights: formData.get("ai_highlights")?.toString()
      ? formData
          .get("ai_highlights")!
          .toString()
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean)
      : undefined,
    ai_faq: formData.get("ai_faq")?.toString()
      ? (JSON.parse(formData.get("ai_faq")!.toString()) as { q: string; a: string }[])
      : undefined,
    pubblicato: formData.get("pubblicato") === "true",
    attivo: formData.get("attivo") !== "false",
  };

  const parsed = veicoloCreateSchema.parse(raw);
  const { prezzo_giornaliero, ...veicoloData } = parsed;

  const slug = buildVeicoloSlug(parsed.marca, parsed.modello, parsed.targa);
  const veicolo = await createVeicolo({
    ...veicoloData,
    slug,
    seo_keywords: [],
    ordine: 0,
  });

  if (prezzo_giornaliero !== undefined) {
    await upsertPrezzoGiornaliero(veicolo.id, prezzo_giornaliero);
  }

  const foto = formData.get("foto");
  const altText = formData.get("foto_alt")?.toString() || `${parsed.marca} ${parsed.modello}`;

  if (foto instanceof File && foto.size > 0) {
    await uploadVeicoloFoto(veicolo.id, foto, altText, true);
  }

  return jsonSuccess(veicolo, 201);
}
