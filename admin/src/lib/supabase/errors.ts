export function isInvalidApiKeyMessage(message?: string): boolean {
  return message?.toLowerCase().includes("invalid api key") ?? false;
}

export const SUPABASE_KEY_HELP =
  "Chiave Supabase non valida. In Supabase apri Project Settings → API Keys → scheda Legacy: copia service_role in admin/.env.local (SUPABASE_SERVICE_ROLE_KEY) e anon public in web/.env.local (NEXT_PUBLIC_SUPABASE_ANON_KEY), poi esegui RIAVVIA_LILO.bat.";
