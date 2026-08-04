import { jsonSuccess } from "@/lib/api-utils";
import { isSupabaseConfigured } from "@/lib/demo";
import { SUPABASE_KEY_HELP } from "@/lib/supabase/errors";
import { verifySupabaseConnection } from "@/lib/supabase/verify";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonSuccess({
      demo: true,
      supabase: false,
      message:
        "Modalità dimostrazione — le modifiche restano solo in questa sessione admin. Configura Supabase su admin e sito per salvare sul database.",
    });
  }

  const connection = await verifySupabaseConnection();

  if (!connection.ok) {
    if (connection.reason === "invalid_api_key") {
      return jsonSuccess({
        demo: true,
        supabase: false,
        invalidApiKey: true,
        message: SUPABASE_KEY_HELP,
      });
    }

    return jsonSuccess({
      demo: true,
      supabase: false,
      message: `Supabase non raggiungibile: ${connection.message}. Verifica chiavi e migrazioni SQL.`,
    });
  }

  return jsonSuccess({
    demo: false,
    supabase: true,
    message: "Database Supabase collegato — le modifiche aggiornano il sito pubblico.",
  });
}
