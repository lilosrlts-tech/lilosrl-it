import { createAdminClient } from "@/lib/supabase/admin";
import { DEMO_SEO_SETTINGS, isSupabaseConfigured } from "@/lib/demo";
import { isInvalidApiKeyMessage } from "@/lib/supabase/errors";
import type { SeoPageKey, SeoSettings } from "@/types/seo";

export async function getAllSeoSettings(): Promise<SeoSettings[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_SEO_SETTINGS.map((row) => ({ ...row }));
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("seo_settings").select("*").order("page_key");

  if (error) {
    if (isInvalidApiKeyMessage(error.message)) {
      return DEMO_SEO_SETTINGS.map((row) => ({ ...row }));
    }
    throw new Error(error.message);
  }

  return (data ?? []) as SeoSettings[];
}

export async function updateSeoSettings(
  pageKey: SeoPageKey,
  payload: Record<string, unknown>
): Promise<SeoSettings> {
  if (!isSupabaseConfigured()) {
    const index = DEMO_SEO_SETTINGS.findIndex((row) => row.page_key === pageKey);
    if (index === -1) throw new Error("Pagina SEO non trovata");

    const updated = {
      ...DEMO_SEO_SETTINGS[index],
      ...payload,
      page_key: pageKey,
      updated_at: new Date().toISOString(),
    };
    DEMO_SEO_SETTINGS[index] = updated;
    return { ...updated };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("seo_settings")
    .update(payload)
    .eq("page_key", pageKey)
    .select("*")
    .single();

  if (error) {
    if (isInvalidApiKeyMessage(error.message)) {
      const index = DEMO_SEO_SETTINGS.findIndex((row) => row.page_key === pageKey);
      if (index === -1) throw new Error("Pagina SEO non trovata");
      const updated = {
        ...DEMO_SEO_SETTINGS[index],
        ...payload,
        page_key: pageKey,
        updated_at: new Date().toISOString(),
      };
      DEMO_SEO_SETTINGS[index] = updated;
      return { ...updated };
    }
    throw new Error(error.message);
  }

  return data as SeoSettings;
}
