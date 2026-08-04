import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createPublicClient, isSupabaseConfigured } from "@/lib/supabase";

/** Client server-side: preferisce service role per scrittura lead. */
export function createServerSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  try {
    return createPublicClient();
  } catch {
    return null;
  }
}
