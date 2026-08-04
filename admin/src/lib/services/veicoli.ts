import { createAdminClient, getStorageBucketName } from "@/lib/supabase/admin";
import { ensureStorageBucket } from "@/lib/supabase/storage";
import { DEMO_VEICOLI, isSupabaseConfigured } from "@/lib/demo";
import {
  buildAdminFleetFotoAlt,
  buildAdminFleetFotoTitle,
  buildAdminFleetImageFilename,
} from "@/lib/fleet-image-seo";
import { listAccessoriIdsForVeicolo } from "@/lib/services/accessori";
import type { Foto, Prezzo, Veicolo, VeicoloDettaglio } from "@/types/database";

const VEICOLO_SELECT = `
  *,
  categoria:categorie(id, nome, slug),
  prezzi(*),
  foto(*)
`;

async function withAccessoriIds(veicolo: VeicoloDettaglio): Promise<VeicoloDettaglio> {
  try {
    const accessori_ids = await listAccessoriIdsForVeicolo(veicolo.id);
    return { ...veicolo, accessori_ids };
  } catch {
    return { ...veicolo, accessori_ids: [] };
  }
}

export async function listVeicoli(): Promise<VeicoloDettaglio[]> {
  if (!isSupabaseConfigured()) return DEMO_VEICOLI;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("veicoli")
    .select(VEICOLO_SELECT)
    .order("ordine", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  const list = (data ?? []) as VeicoloDettaglio[];
  return Promise.all(list.map(withAccessoriIds));
}

export async function getVeicoloById(id: string): Promise<VeicoloDettaglio | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_VEICOLI.find((v) => v.id === id) ?? null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("veicoli")
    .select(VEICOLO_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return withAccessoriIds(data as VeicoloDettaglio);
}

export async function createVeicolo(
  payload: Record<string, unknown>
): Promise<Veicolo> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("veicoli")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Veicolo;
}

export async function updateVeicolo(
  id: string,
  payload: Record<string, unknown>
): Promise<Veicolo> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("veicoli")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Veicolo;
}

export async function deleteVeicolo(id: string): Promise<void> {
  const supabase = createAdminClient();

  const { data: fotoList } = await supabase
    .from("foto")
    .select("storage_path")
    .eq("veicolo_id", id);

  if (fotoList?.length) {
    const paths = fotoList.map((f) => f.storage_path);
    await supabase.storage.from(getStorageBucketName()).remove(paths);
  }

  const { error } = await supabase.from("veicoli").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setVeicoloDisponibilita(
  id: string,
  attivo: boolean
): Promise<Veicolo> {
  const payload: Record<string, unknown> = { attivo };
  if (!attivo) payload.pubblicato = false;
  return updateVeicolo(id, payload);
}

export async function upsertPrezzoGiornaliero(
  veicoloId: string,
  importo: number,
  descrizione?: string | null
): Promise<Prezzo> {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("prezzi")
    .select("id")
    .eq("veicolo_id", veicoloId)
    .eq("tipo_tariffa", "giornaliero")
    .eq("attivo", true)
    .maybeSingle();

  if (existing?.id) {
    const { data, error } = await supabase
      .from("prezzi")
      .update({ importo, descrizione: descrizione ?? "Tariffa giornaliera" })
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as Prezzo;
  }

  const { data, error } = await supabase
    .from("prezzi")
    .insert({
      veicolo_id: veicoloId,
      tipo_tariffa: "giornaliero",
      importo,
      descrizione: descrizione ?? "Tariffa giornaliera",
      attivo: true,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Prezzo;
}

export async function uploadVeicoloFoto(
  veicoloId: string,
  file: File,
  altText: string,
  isCopertina = false
): Promise<Foto> {
  await ensureStorageBucket();
  const supabase = createAdminClient();
  const bucket = getStorageBucketName();

  const veicolo = await getVeicoloById(veicoloId);
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const seoName = veicolo
    ? buildAdminFleetImageFilename({
        marca: veicolo.marca,
        modello: veicolo.modello,
        categoriaSlug: veicolo.categoria?.slug,
        isCopertina,
        ext,
      })
    : `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const storagePath = `${veicoloId}/${seoName}`;

  const seoAlt =
    veicolo &&
    (!altText ||
      altText === "seo-auto" ||
      /\.(jpe?g|png|webp|heic)$/i.test(altText) ||
      altText.includes(file.name))
      ? buildAdminFleetFotoAlt({
          marca: veicolo.marca,
          modello: veicolo.modello,
          categoriaNome: veicolo.categoria?.nome,
          isCopertina,
        })
      : altText;
  const seoTitle = veicolo
    ? buildAdminFleetFotoTitle({
        marca: veicolo.marca,
        modello: veicolo.modello,
        categoriaNome: veicolo.categoria?.nome,
      })
    : seoAlt;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(
      `Upload Storage bucket "${bucket}" fallito: ${uploadError.message}. ` +
        "Verifica SUPABASE_STORAGE_BUCKET=veicoli in admin/.env.local",
    );
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);

  if (isCopertina) {
    await supabase
      .from("foto")
      .update({ is_copertina: false })
      .eq("veicolo_id", veicoloId)
      .eq("is_copertina", true);
  }

  const { count } = await supabase
    .from("foto")
    .select("*", { count: "exact", head: true })
    .eq("veicolo_id", veicoloId);

  const { data, error } = await supabase
    .from("foto")
    .insert({
      veicolo_id: veicoloId,
      storage_bucket: bucket,
      storage_path: storagePath,
      url_pubblico: publicUrlData.publicUrl,
      alt_text: seoAlt,
      titolo: seoTitle,
      ordine: count ?? 0,
      is_copertina: isCopertina || (count ?? 0) === 0,
      mime_type: file.type || null,
      peso_bytes: file.size,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Foto;
}

export async function deleteVeicoloFoto(fotoId: string, veicoloId?: string): Promise<void> {
  const supabase = createAdminClient();

  const { data: foto, error: fetchError } = await supabase
    .from("foto")
    .select("*")
    .eq("id", fotoId)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);
  if (!foto) throw new Error("Foto non trovata");
  if (veicoloId && foto.veicolo_id !== veicoloId) {
    throw new Error("Foto non appartiene a questo veicolo");
  }

  await ensureStorageBucket();
  await supabase.storage.from(getStorageBucketName()).remove([foto.storage_path]);

  const { error } = await supabase.from("foto").delete().eq("id", fotoId);
  if (error) throw new Error(error.message);
}
