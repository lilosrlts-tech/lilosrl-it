import { createAdminClient } from "@/lib/supabase/admin";
import type { Accessorio } from "@/types/database";

export async function listAccessori(includeInactive = true): Promise<Accessorio[]> {
  const supabase = createAdminClient();
  let query = supabase.from("accessori").select("*").order("ordine", { ascending: true });
  if (!includeInactive) query = query.eq("attivo", true);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Accessorio[];
}

export async function getAccessorioById(id: string): Promise<Accessorio | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("accessori").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as Accessorio | null;
}

export async function createAccessorio(
  payload: Record<string, unknown>,
): Promise<Accessorio> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("accessori")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as Accessorio;
}

export async function updateAccessorio(
  id: string,
  payload: Record<string, unknown>,
): Promise<Accessorio> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("accessori")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as Accessorio;
}

export async function deleteAccessorio(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("accessori").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function listAccessoriIdsForVeicolo(veicoloId: string): Promise<string[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("veicolo_accessori")
    .select("accessorio_id")
    .eq("veicolo_id", veicoloId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => String(row.accessorio_id));
}

export async function setVeicoloAccessori(
  veicoloId: string,
  accessorioIds: string[],
): Promise<void> {
  const supabase = createAdminClient();
  const { error: delErr } = await supabase
    .from("veicolo_accessori")
    .delete()
    .eq("veicolo_id", veicoloId);
  if (delErr) throw new Error(delErr.message);

  const unique = [...new Set(accessorioIds.filter(Boolean))];
  if (unique.length === 0) return;

  const rows = unique.map((accessorio_id) => ({
    veicolo_id: veicoloId,
    accessorio_id,
  }));
  const { error: insErr } = await supabase.from("veicolo_accessori").insert(rows);
  if (insErr) throw new Error(insErr.message);
}
