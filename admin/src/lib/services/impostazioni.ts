import { createAdminClient } from "@/lib/supabase/admin";
import { DEMO_IMPOSTAZIONI, isSupabaseConfigured } from "@/lib/demo";
import { isInvalidApiKeyMessage } from "@/lib/supabase/errors";
import { IMPOSTAZIONI_SITO_ID } from "@/types/impostazioni";
import type { ImpostazioniSito } from "@/types/impostazioni";

export async function getImpostazioniSito(): Promise<ImpostazioniSito> {
  if (!isSupabaseConfigured()) return DEMO_IMPOSTAZIONI;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("impostazioni_sito")
    .select("*")
    .eq("id", IMPOSTAZIONI_SITO_ID)
    .maybeSingle();

  if (error) {
    if (isInvalidApiKeyMessage(error.message)) return { ...DEMO_IMPOSTAZIONI };
    throw new Error(error.message);
  }
  if (!data) throw new Error("Impostazioni sito non trovate. Esegui la migration 002.");

  return data as ImpostazioniSito;
}

export async function updateImpostazioniSito(
  payload: Record<string, unknown>
): Promise<ImpostazioniSito> {
  if (!isSupabaseConfigured()) {
    Object.assign(DEMO_IMPOSTAZIONI, payload, { updated_at: new Date().toISOString() });
    return { ...DEMO_IMPOSTAZIONI };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("impostazioni_sito")
    .update(payload)
    .eq("id", IMPOSTAZIONI_SITO_ID)
    .select("*")
    .single();

  if (error) {
    if (isInvalidApiKeyMessage(error.message)) {
      Object.assign(DEMO_IMPOSTAZIONI, payload, { updated_at: new Date().toISOString() });
      return { ...DEMO_IMPOSTAZIONI };
    }
    throw new Error(error.message);
  }
  return data as ImpostazioniSito;
}
