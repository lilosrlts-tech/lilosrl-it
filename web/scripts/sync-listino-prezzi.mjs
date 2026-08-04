/**
 * Allinea i prezzi giornalieri Supabase al listino ufficiale per categoria.
 * Uso: cd web && node scripts/sync-listino-prezzi.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const credPath = join(__dirname, "..", "..", "supabase", "CREDENZIALI.env");

const TARIFFE = {
  auto: { prezzo: 40, descrizione: "100 km inclusi / Assicurazione base" },
  "pulmini-9-posti": { prezzo: 90, descrizione: "150 km inclusi / Assicurazione base" },
  "furgoni-piccoli": { prezzo: 50, descrizione: "100 km inclusi / Assicurazione base" },
  "furgoni-medi": { prezzo: 55, descrizione: "100 km inclusi / Assicurazione base" },
  "furgoni-grandi-citta": {
    prezzo: 55,
    descrizione: "Fino a 50 km inclusi — Ottimizzato per Trieste città",
  },
  "furgoni-grandi": { prezzo: 60, descrizione: "100 km inclusi / Assicurazione base" },
  "furgoni-xl": { prezzo: 70, descrizione: "100 km inclusi / Assicurazione base" },
};

function loadEnv(path) {
  const vars = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) vars[m[1].trim()] = m[2].trim();
  }
  return vars;
}

const env = loadEnv(credPath);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: veicoli, error } = await supabase
    .from("veicoli")
    .select("id, slug, categoria:categorie(slug)")
    .eq("pubblicato", true)
    .eq("attivo", true);

  if (error) throw error;

  for (const veicolo of veicoli ?? []) {
    const catSlug = veicolo.categoria?.slug;
    const tariffa = catSlug ? TARIFFE[catSlug] : null;
    if (!tariffa) {
      console.log("Skip (no tariffa):", veicolo.slug, catSlug);
      continue;
    }

    const { data: existing } = await supabase
      .from("prezzi")
      .select("id")
      .eq("veicolo_id", veicolo.id)
      .eq("tipo_tariffa", "giornaliero")
      .maybeSingle();

    const payload = {
      veicolo_id: veicolo.id,
      tipo_tariffa: "giornaliero",
      importo: tariffa.prezzo,
      descrizione: tariffa.descrizione,
      attivo: true,
    };

    if (existing?.id) {
      await supabase.from("prezzi").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("prezzi").insert(payload);
    }

    console.log(`OK ${veicolo.slug} → €${tariffa.prezzo} (${catSlug})`);
  }

  console.log("Listino prezzi sincronizzato.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
