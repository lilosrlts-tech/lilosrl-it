import { isSupabaseConfigured } from "@/lib/demo";
import { createAdminClient } from "@/lib/supabase/admin";
import { isInvalidApiKeyMessage } from "@/lib/supabase/errors";

export type SupabaseConnectionStatus =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "invalid_api_key" | "error"; message: string };

export async function verifySupabaseConnection(): Promise<SupabaseConnectionStatus> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      reason: "not_configured",
      message: "Supabase non configurato in admin/.env.local",
    };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("impostazioni_sito").select("id").limit(1);

    if (!error) return { ok: true };

    if (isInvalidApiKeyMessage(error.message)) {
      return { ok: false, reason: "invalid_api_key", message: error.message };
    }

    return { ok: false, reason: "error", message: error.message };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore connessione Supabase";
    if (isInvalidApiKeyMessage(message)) {
      return { ok: false, reason: "invalid_api_key", message };
    }
    return { ok: false, reason: "error", message };
  }
}
