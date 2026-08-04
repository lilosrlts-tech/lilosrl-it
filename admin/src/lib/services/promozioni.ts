import { createAdminClient } from "@/lib/supabase/admin";

export type PromoDurataTipo = "paga_giorni" | "percentuale";

export interface PromozioneDurata {
  id: string;
  nome: string;
  slug: string;
  descrizione_pubblica: string | null;
  giorni_minimo: number;
  tipo: PromoDurataTipo;
  giorni_a_pagamento: number | null;
  sconto_percentuale: number | null;
  attivo: boolean;
  ordine: number;
  created_at: string;
  updated_at: string;
}

export async function listPromozioniDurata(): Promise<PromozioneDurata[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("promozioni_durata")
    .select("*")
    .order("ordine", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as PromozioneDurata[];
}

export async function updatePromozioneDurata(
  id: string,
  payload: Record<string, unknown>,
): Promise<PromozioneDurata> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("promozioni_durata")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as PromozioneDurata;
}

export async function createPromozioneDurata(
  payload: Record<string, unknown>,
): Promise<PromozioneDurata> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("promozioni_durata")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as PromozioneDurata;
}
