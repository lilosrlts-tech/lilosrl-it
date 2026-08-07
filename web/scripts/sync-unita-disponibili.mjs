/**
 * Aggiunge unita_disponibili e aggiorna i conteggi flotta.
 * Uso: cd web && node scripts/sync-unita-disponibili.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const credPath = join(__dirname, "..", "..", "supabase", "CREDENZIALI.env");

function loadEnv(path) {
  const vars = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) vars[m[1].trim()] = m[2].trim();
  }
  return vars;
}

/** Conteggi modello → unità (senza targhe pubbliche). */
const BY_SLUG = {
  // XL
  "ford-transit-l3h2": 3,
  "nissan-interstar-l3h2": 2,
  "peugeot-boxer-l3h3": 2,
  // Grandi città
  "peugeot-boxer-l2h2": 4,
  "citroen-jumper-l2h2": 3,
  // Grandi
  "ford-transit-l2h2": 3,
  "renault-master-l2h2": 4,
  "renault-master-l2h3": 4,
  "opel-movano-l2h2": 4,
  // Medi
  "ford-transit-custom-l1h1-ibrido": 4,
  "ford-transit-custom-l1h1": 4,
  "opel-vivaro": 3,
  "citroen-jumpy-l1h1": 3,
  // Piccoli
  "fiat-doblo-cargo": 3,
  "fiat-doblo": 1,
  "toyota-proace-city": 2,
  // Auto
  "citroen-c3": 3,
  "opel-karl": 2,
  "volkswagen-polo": 1,
  // Pulmini
  "renault-trafic-9-posti": 3,
  "nissan-primastar-9-posti": 3,
};

async function ensureColumn(env) {
  const ref = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
  const password = env.SUPABASE_DB_PASSWORD;
  const candidates = [
    {
      host: "aws-0-eu-west-1.pooler.supabase.com",
      port: 6543,
      user: `postgres.${ref}`,
    },
    {
      host: "aws-0-eu-central-1.pooler.supabase.com",
      port: 6543,
      user: `postgres.${ref}`,
    },
    {
      host: "aws-0-eu-south-1.pooler.supabase.com",
      port: 6543,
      user: `postgres.${ref}`,
    },
    {
      host: `db.${ref}.supabase.co`,
      port: 5432,
      user: "postgres",
      family: 6,
    },
  ];

  let lastErr;
  for (const c of candidates) {
    const client = new pg.Client({
      host: c.host,
      port: c.port,
      user: c.user,
      password,
      database: "postgres",
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 12000,
      ...(c.family ? { family: c.family } : {}),
    });
    try {
      await client.connect();
      await client.query(`
        ALTER TABLE public.veicoli
        ADD COLUMN IF NOT EXISTS unita_disponibili integer NOT NULL DEFAULT 1
        CHECK (unita_disponibili >= 1);
      `);
      await client.query(`
        COMMENT ON COLUMN public.veicoli.unita_disponibili IS
        'Numero unita dello stesso modello in flotta (senza esporre targhe).';
      `);
      console.log("Colonna OK via", c.host);
      await client.end();
      return;
    } catch (err) {
      lastErr = err;
      console.warn("Skip", c.host, String(err.message || err).slice(0, 120));
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
  }
  throw lastErr || new Error("Impossibile connettersi al DB");
}

async function main() {
  const env = loadEnv(credPath);
  await ensureColumn(env);

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // reset default 1 then apply known counts
  const { data: all, error: listErr } = await supabase.from("veicoli").select("id,slug");
  if (listErr) throw listErr;

  for (const row of all ?? []) {
    const n = BY_SLUG[row.slug] ?? 1;
    const { error } = await supabase
      .from("veicoli")
      .update({ unita_disponibili: n })
      .eq("id", row.id);
    if (error) throw error;
    console.log(row.slug, "→", n);
  }

  console.log("Sync unita_disponibili completato");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
