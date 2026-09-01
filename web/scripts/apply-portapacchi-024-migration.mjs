/**
 * Applica migration 024_portapacchi_doblo_vivaro.sql
 * Uso: cd web && node scripts/apply-portapacchi-024-migration.mjs
 */
import pg from "pg";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");

function load(path) {
  const vars = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) vars[m[1].trim()] = m[2].trim();
  }
  return vars;
}

const env = load(join(root, "supabase", "CREDENZIALI.env"));
const ref = env.NEXT_PUBLIC_SUPABASE_URL.replace("https://", "").replace(
  ".supabase.co",
  "",
);
const pass = encodeURIComponent(env.SUPABASE_DB_PASSWORD);
const sql = readFileSync(
  join(root, "supabase", "migrations", "024_portapacchi_doblo_vivaro.sql"),
  "utf8",
);

const candidates = [
  `postgresql://postgres.${ref}:${pass}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.${ref}:${pass}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres:${pass}@db.${ref}.supabase.co:5432/postgres`,
];

let lastErr = null;
for (const conn of candidates) {
  const host = conn.split("@")[1].split("/")[0];
  const client = new pg.Client({
    connectionString: conn,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 12000,
  });
  try {
    await client.connect();
    await client.query(sql);
    const check = await client.query(`
      SELECT slug, sottotitolo,
        ai_highlights[1] AS highlight_1,
        left(descrizione_breve, 120) AS descrizione_breve
      FROM public.veicoli
      WHERE slug IN ('fiat-doblo-cargo', 'opel-vivaro')
      ORDER BY slug
    `);
    await client.end();
    console.log("OK migration 024 applied via", host);
    console.log("VERIFY rows:", JSON.stringify(check.rows, null, 2));
    process.exit(0);
  } catch (e) {
    lastErr = e.message;
    console.log("FAIL", host, "->", String(e.message).split("\n")[0]);
    try {
      await client.end();
    } catch {
      /* ignore */
    }
  }
}
console.log("ALL_FAILED", lastErr);
process.exit(1);
