import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/demo";

export { isSupabaseConfigured };

let adminClient: SupabaseClient | null = null;

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variabile d'ambiente mancante: ${name}`);
  }
  return value;
}

export function createAdminClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase non configurato — modalità demo attiva");
  }

  if (adminClient) return adminClient;

  adminClient = createClient(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return adminClient;
}

/** Nome bucket Storage flotta — default "veicoli" (allineato a Supabase). */
export const DEFAULT_STORAGE_BUCKET = "veicoli";

export function getStorageBucketName(): string {
  const fromEnv = process.env.SUPABASE_STORAGE_BUCKET?.trim();
  return fromEnv || DEFAULT_STORAGE_BUCKET;
}

/** Risolto a runtime per leggere correttamente .env.local */
export function getStorageBucket(): string {
  return getStorageBucketName();
}
