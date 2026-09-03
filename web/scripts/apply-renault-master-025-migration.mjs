/**
 * Applica migration 025_fix_renault_master_l2h3_to_l2h2.sql
 * Uso: cd web && node scripts/apply-renault-master-025-migration.mjs
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
  join(root, "supabase", "migrations", "025_fix_renault_master_l2h3_to_l2h2.sql"),
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
      SELECT slug, targa, versione, volume_metri_cubi, altezza_vano_mm, pubblicato, titolo_pubblico
      FROM public.veicoli
      WHERE slug LIKE 'renault-master%'
      ORDER BY slug
    `);
    await client.end();
    console.log("OK migration 025 applied via", host);
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
