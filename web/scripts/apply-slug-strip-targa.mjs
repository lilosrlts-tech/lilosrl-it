/**
 * Applica migration 022 (slug senza targa) su Supabase.
 * Uso: cd web && node scripts/apply-slug-strip-targa.mjs
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");
const envPath = join(root, "supabase", "CREDENZIALI.env");
const sqlPath = join(
  root,
  "supabase",
  "migrations",
  "022_strip_targa_from_vehicle_slugs.sql",
);

function loadEnv(path) {
  const vars = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) vars[m[1].trim()] = m[2].trim();
  }
  return vars;
}

const env = loadEnv(envPath);
const ref = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
const password = env.SUPABASE_DB_PASSWORD;
const sql = readFileSync(sqlPath, "utf8");

const candidates = [
  { host: "aws-0-eu-west-1.pooler.supabase.com", port: 6543, user: `postgres.${ref}` },
  { host: "aws-0-eu-central-1.pooler.supabase.com", port: 6543, user: `postgres.${ref}` },
  { host: "aws-0-eu-south-1.pooler.supabase.com", port: 6543, user: `postgres.${ref}` },
  { host: `db.${ref}.supabase.co`, port: 5432, user: "postgres" },
];

let lastErr;
for (const c of candidates) {
  const client = new pg.Client({
    ...c,
    password,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  try {
    await client.connect();
    console.log("Connected via", c.host);
    const before = await client.query(
      `SELECT slug, targa FROM public.veicoli ORDER BY slug`,
    );
    console.log("Before:");
    for (const r of before.rows) console.log(" ", r.slug, r.targa);
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
    const after = await client.query(
      `SELECT slug, targa FROM public.veicoli ORDER BY slug`,
    );
    console.log("After:");
    for (const r of after.rows) console.log(" ", r.slug, r.targa);
    await client.end();
    process.exit(0);
  } catch (e) {
    lastErr = e;
    try {
      await client.query("ROLLBACK");
    } catch {
      /* ignore */
    }
    try {
      await client.end();
    } catch {
      /* ignore */
    }
    console.log("Fail", c.host, e.message);
  }
}
console.error("All failed:", lastErr?.message);
process.exit(1);
