/**
 * Test rapido: bucket Storage + campi veicolo su Supabase.
 * Esegui: npx tsx scripts/test-storage-veicoli.ts
 */
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  const envPath = resolve(__dirname, "../.env.local");
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 1) continue;
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

async function main() {
  loadEnvLocal();

  const { ensureStorageBucket, resetStorageBucketCache } = await import(
    "../src/lib/supabase/storage"
  );
  const { getStorageBucketName, createAdminClient } = await import(
    "../src/lib/supabase/admin"
  );

  const bucket = getStorageBucketName();
  console.log("Bucket configurato:", bucket);

  resetStorageBucketCache();
  await ensureStorageBucket();
  console.log("OK ensureStorageBucket — bucket accessibile");

  const supabase = createAdminClient();
  const { data: probe, error: probeErr } = await supabase.storage.from(bucket).list("", {
    limit: 1,
  });
  if (probeErr) throw new Error(`Probe bucket fallito: ${probeErr.message}`);
  console.log("OK probe list — file nel bucket:", probe?.length ?? 0);

  const { data: veicolo, error: vErr } = await supabase
    .from("veicoli")
    .select("id, slug, lunghezza_vano_mm, larghezza_vano_mm, altezza_vano_mm, larghezza_tra_passaruota_mm, ai_summary, ai_faq")
    .limit(1)
    .maybeSingle();

  if (vErr) throw new Error(`Lettura veicoli fallita: ${vErr.message}`);
  console.log("OK campi DB su veicolo campione:", veicolo?.slug ?? "(nessuno)");
  console.log("   vano mm:", {
    lunghezza: veicolo?.lunghezza_vano_mm,
    larghezza: veicolo?.larghezza_vano_mm,
    altezza: veicolo?.altezza_vano_mm,
    passaruota: veicolo?.larghezza_tra_passaruota_mm,
  });
  console.log("   ai_summary:", veicolo?.ai_summary ? "presente" : "(vuoto)");
  console.log("   ai_faq:", Array.isArray(veicolo?.ai_faq) ? veicolo.ai_faq.length + " FAQ" : "(vuoto)");

  console.log("\nTutti i test superati.");
}

main().catch((err) => {
  console.error("FALLITO:", err instanceof Error ? err.message : err);
  process.exit(1);
});
