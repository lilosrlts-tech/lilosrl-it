import { createAdminClient } from "@/lib/supabase/admin";
import { DEMO_CATEGORIE, DEMO_VEICOLI, isSupabaseConfigured } from "@/lib/demo";
import { buildCategoriaSlug } from "@/lib/slug";
import type { Categoria } from "@/types/database";

export async function listCategorie(includeInactive = true): Promise<Categoria[]> {
  if (!isSupabaseConfigured()) {
    const items = [...DEMO_CATEGORIE].sort((a, b) => a.ordine - b.ordine);
    return includeInactive ? items : items.filter((c) => c.attivo);
  }

  const supabase = createAdminClient();
  let query = supabase.from("categorie").select("*").order("ordine", { ascending: true });

  if (!includeInactive) {
    query = query.eq("attivo", true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Categoria[];
}

export async function getCategoriaById(id: string): Promise<Categoria | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_CATEGORIE.find((c) => c.id === id) ?? null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categorie")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Categoria | null;
}

function buildDemoCategoria(payload: Record<string, unknown>): Categoria {
  const timestamp = new Date().toISOString();
  const nome = String(payload.nome ?? "");
  return {
    id: crypto.randomUUID(),
    nome,
    slug: String(payload.slug ?? buildCategoriaSlug(nome)),
    descrizione: (payload.descrizione as string | null | undefined) ?? null,
    icona: (payload.icona as string | null | undefined) ?? null,
    ordine: Number(payload.ordine ?? DEMO_CATEGORIE.length + 1),
    attivo: payload.attivo !== false,
    seo_title: (payload.seo_title as string | null | undefined) ?? null,
    seo_description: (payload.seo_description as string | null | undefined) ?? null,
    seo_keywords: (payload.seo_keywords as string[] | undefined) ?? [],
    meta_robots: null,
    canonical_url: null,
    created_at: timestamp,
    updated_at: timestamp,
  };
}

export async function createCategoria(
  payload: Record<string, unknown>,
): Promise<Categoria> {
  if (!isSupabaseConfigured()) {
    const categoria = buildDemoCategoria(payload);
    DEMO_CATEGORIE.push(categoria);
    return categoria;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categorie")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Categoria;
}

export async function updateCategoria(
  id: string,
  payload: Record<string, unknown>,
): Promise<Categoria> {
  if (!isSupabaseConfigured()) {
    const index = DEMO_CATEGORIE.findIndex((c) => c.id === id);
    if (index < 0) throw new Error("Categoria non trovata");

    const updated: Categoria = {
      ...DEMO_CATEGORIE[index],
      ...payload,
      updated_at: new Date().toISOString(),
    } as Categoria;
    DEMO_CATEGORIE[index] = updated;

    for (const veicolo of DEMO_VEICOLI) {
      if (veicolo.categoria_id === id && veicolo.categoria) {
        veicolo.categoria = {
          id: updated.id,
          nome: updated.nome,
          slug: updated.slug,
        };
      }
    }

    return updated;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categorie")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Categoria;
}

export async function deleteCategoria(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const inUse = DEMO_VEICOLI.some((v) => v.categoria_id === id);
    if (inUse) {
      throw new Error("Impossibile eliminare: ci sono veicoli collegati a questa categoria");
    }

    const index = DEMO_CATEGORIE.findIndex((c) => c.id === id);
    if (index < 0) throw new Error("Categoria non trovata");
    DEMO_CATEGORIE.splice(index, 1);
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("categorie").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
