/**
 * Dump completo del database Supabase in backups/*.sql (locale, non versionato).
 *
 * Uso (dalla root del repo):
 *   npm run backup
 *   node scripts/backup-db.mjs
 *
 * Requisiti:
 *   - supabase/CREDENZIALI.env con NEXT_PUBLIC_SUPABASE_URL + SUPABASE_DB_PASSWORD
 *   - Opzionale: pg_dump in PATH (più completo). Altrimenti dump via Node/pg (public + storage).
 *
 * Nota piano Free: nessun backup automatico Supabase → eseguire periodicamente (es. settimanale).
 */
import { spawnSync } from "child_process";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { finished } from "stream/promises";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ENV_PATH = join(ROOT, "supabase", "CREDENZIALI.env");
const BACKUP_DIR = join(ROOT, "backups");

/** Schema applicativi da includere nel dump Node (no cataloghi di sistema). */
const DUMP_SCHEMAS = ["public", "storage"];

function loadEnv(path) {
  if (!existsSync(path)) {
    throw new Error(
      `Manca ${path}. Copia supabase/CREDENZIALI.env.example e valorizza SUPABASE_DB_PASSWORD.`,
    );
  }
  const vars = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) vars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return vars;
}

function timestamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
    `-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
  );
}

function projectRef(url) {
  return new URL(url).hostname.split(".")[0];
}

function buildPgDumpUrls(ref, password) {
  const pass = encodeURIComponent(password);
  const regions = ["eu-west-1", "eu-central-1", "eu-south-1"];
  const urls = [
    `postgresql://postgres:${pass}@db.${ref}.supabase.co:5432/postgres?sslmode=require`,
  ];
  for (const region of regions) {
    urls.push(
      `postgresql://postgres.${ref}:${pass}@aws-0-${region}.pooler.supabase.com:5432/postgres?sslmode=require`,
    );
  }
  return urls;
}

function buildClientConfigs(ref, password) {
  const regions = ["eu-west-1", "eu-central-1", "eu-south-1"];
  const configs = [];
  for (const region of regions) {
    configs.push({
      label: `pooler ${region}:6543`,
      host: `aws-0-${region}.pooler.supabase.com`,
      port: 6543,
      user: `postgres.${ref}`,
      password,
      database: "postgres",
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 12000,
    });
  }
  configs.push({
    label: `direct db.${ref}:5432`,
    host: `db.${ref}.supabase.co`,
    port: 5432,
    user: "postgres",
    password,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 12000,
  });
  return configs;
}

function findPgDump() {
  const whichCmd = process.platform === "win32" ? "where.exe" : "which";
  const r = spawnSync(whichCmd, ["pg_dump"], { encoding: "utf8" });
  if (r.status === 0) {
    const line = (r.stdout || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .find(Boolean);
    if (line) return line;
  }
  if (process.platform === "win32") {
    for (const root of [
      "C:\\Program Files\\PostgreSQL",
      "C:\\Program Files (x86)\\PostgreSQL",
    ]) {
      if (!existsSync(root)) continue;
      for (const ver of readdirSync(root).sort().reverse()) {
        const candidate = join(root, ver, "bin", "pg_dump.exe");
        if (existsSync(candidate)) return candidate;
      }
    }
  }
  return null;
}

function dockerAvailable() {
  const r = spawnSync("docker", ["info"], {
    encoding: "utf8",
    timeout: 8000,
  });
  return r.status === 0;
}

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    encoding: "utf8",
    ...opts,
  });
}

function tryPgDump(pgDumpBin, dbUrl, outFile) {
  const r = run(pgDumpBin, [
    dbUrl,
    "--format=plain",
    "--no-owner",
    "--no-acl",
    "--clean",
    "--if-exists",
    `--file=${outFile}`,
  ]);
  if (r.status === 0 && existsSync(outFile) && statSync(outFile).size > 0) {
    return { ok: true };
  }
  return {
    ok: false,
    stderr: (r.stderr || r.stdout || `exit ${r.status}`).trim(),
  };
}

function trySupabaseDump(dbUrl, outFile) {
  const r = run(
    "npx",
    [
      "--yes",
      "supabase@latest",
      "db",
      "dump",
      "--db-url",
      dbUrl,
      "-f",
      outFile,
    ],
    { timeout: 10 * 60 * 1000 },
  );
  if (r.status === 0 && existsSync(outFile) && statSync(outFile).size > 0) {
    return { ok: true };
  }
  return {
    ok: false,
    stderr: (r.stderr || r.stdout || `exit ${r.status}`).trim(),
  };
}

function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return "(url)";
  }
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function sqlLiteral(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "NULL";
  }
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Date) return `'${value.toISOString()}'`;
  if (Buffer.isBuffer(value)) return `'\\x${value.toString("hex")}'`;
  if (typeof value === "object") {
    const json = JSON.stringify(value).replace(/'/g, "''");
    return `'${json}'::jsonb`;
  }
  const s = String(value).replace(/'/g, "''");
  return `'${s}'`;
}

function qIdent(name) {
  return `"${String(name).replace(/"/g, '""')}"`;
}

async function connectFirst(configs) {
  let lastErr;
  for (const cfg of configs) {
    const { label, ...clientOpts } = cfg;
    const client = new pg.Client(clientOpts);
    try {
      await client.connect();
      console.log(`  Connesso via ${label}`);
      return client;
    } catch (e) {
      lastErr = e;
      try {
        await client.end();
      } catch {
        /* ignore */
      }
      console.log(`  Skip ${label}: ${String(e.message).split("\n")[0]}`);
    }
  }
  throw new Error(`Connessione DB fallita: ${lastErr?.message || lastErr}`);
}

async function nodeSqlDump(ref, password, outFile) {
  const client = await connectFirst(buildClientConfigs(ref, password));
  const out = createWriteStream(outFile, { encoding: "utf8" });

  const write = (chunk) =>
    new Promise((resolve, reject) => {
      out.write(chunk, (err) => (err ? reject(err) : resolve()));
    });

  try {
    await write(`-- LILO S.r.l. database backup (Node/pg fallback)\n`);
    await write(`-- Generated: ${new Date().toISOString()}\n`);
    await write(`-- Project: ${ref}\n`);
    await write(`-- Schemas: ${DUMP_SCHEMAS.join(", ")}\n`);
    await write(
      `-- Nota: dump DATI (INSERT). Lo schema DDL resta in supabase/migrations/.\n`,
    );
    await write(`-- Restore tipico: applicare migrations, poi psql -f questo file\n\n`);
    await write(`SET session_replication_role = replica;\n`);
    await write(`BEGIN;\n\n`);

    const tablesRes = await client.query(
      `
      SELECT schemaname, tablename
      FROM pg_tables
      WHERE schemaname = ANY($1::text[])
      ORDER BY schemaname, tablename
      `,
      [DUMP_SCHEMAS],
    );

    const tables = tablesRes.rows;
    if (tables.length === 0) {
      throw new Error("Nessuna tabella trovata negli schema richiesti.");
    }

    // TRUNCATE in un colpo (rispetta FK con CASCADE)
    const fqList = tables
      .map((t) => `${qIdent(t.schemaname)}.${qIdent(t.tablename)}`)
      .join(", ");
    await write(`-- Svuota tabelle prima del restore dati\n`);
    await write(`TRUNCATE TABLE ${fqList} RESTART IDENTITY CASCADE;\n\n`);

    let totalRows = 0;
    for (const { schemaname, tablename } of tables) {
      const fq = `${qIdent(schemaname)}.${qIdent(tablename)}`;
      const colsRes = await client.query(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position
        `,
        [schemaname, tablename],
      );
      const cols = colsRes.rows.map((r) => r.column_name);
      if (cols.length === 0) continue;

      const colList = cols.map(qIdent).join(", ");
      const data = await client.query(`SELECT * FROM ${fq}`);
      await write(`-- ${schemaname}.${tablename} (${data.rowCount} rows)\n`);
      if (data.rowCount === 0) {
        await write(`\n`);
        continue;
      }

      for (const row of data.rows) {
        const values = cols.map((c) => sqlLiteral(row[c])).join(", ");
        await write(`INSERT INTO ${fq} (${colList}) VALUES (${values});\n`);
        totalRows += 1;
      }
      await write(`\n`);
      process.stdout.write(`    ${schemaname}.${tablename}: ${data.rowCount} righe\n`);
    }

    // Sequenze / identity
    const seqRes = await client.query(
      `
      SELECT n.nspname AS schemaname, c.relname AS sequencename
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind = 'S' AND n.nspname = ANY($1::text[])
      ORDER BY 1, 2
      `,
      [DUMP_SCHEMAS],
    );
    for (const { schemaname, sequencename } of seqRes.rows) {
      const fq = `${qIdent(schemaname)}.${qIdent(sequencename)}`;
      const last = await client.query(`SELECT last_value, is_called FROM ${fq}`);
      const { last_value, is_called } = last.rows[0];
      await write(
        `SELECT setval('${schemaname}.${sequencename}', ${sqlLiteral(last_value)}, ${is_called ? "true" : "false"});\n`,
      );
    }

    await write(`\nCOMMIT;\n`);
    await write(`SET session_replication_role = DEFAULT;\n`);
    out.end();
    await finished(out);
    return { totalRows, tables: tables.length };
  } catch (e) {
    out.destroy();
    throw e;
  } finally {
    await client.end();
  }
}

async function main() {
  const env = loadEnv(ENV_PATH);
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const password = env.SUPABASE_DB_PASSWORD;
  if (!url || !password) {
    throw new Error(
      "In CREDENZIALI.env servono NEXT_PUBLIC_SUPABASE_URL e SUPABASE_DB_PASSWORD (Database → Settings).",
    );
  }

  mkdirSync(BACKUP_DIR, { recursive: true });
  writeFileSync(
    join(BACKUP_DIR, "README.local.txt"),
    "Dump SQL locali — non pubblicare su Git. Generati con: npm run backup\n",
    "utf8",
  );

  const ref = projectRef(url);
  const outFile = join(BACKUP_DIR, `lilosrl-${timestamp()}.sql`);
  const pgDumpBin = findPgDump();
  const hasDocker = dockerAvailable();

  console.log("Backup database Supabase →", outFile);
  console.log("Progetto:", ref);

  // 1) pg_dump nativo
  if (pgDumpBin) {
    console.log("Motore: pg_dump (", pgDumpBin, ")");
    let lastErr = "";
    for (const dbUrl of buildPgDumpUrls(ref, password)) {
      process.stdout.write(`  Provo ${hostOf(dbUrl)} … `);
      const result = tryPgDump(pgDumpBin, dbUrl, outFile);
      if (result.ok) {
        console.log(`OK (${formatBytes(statSync(outFile).size)})`);
        console.log("\nBackup completato:", outFile);
        return;
      }
      lastErr = (result.stderr || "").split(/\r?\n/).slice(0, 2).join(" | ");
      console.log("FAIL");
      if (lastErr) console.log("   ", lastErr.slice(0, 200));
    }
    console.log("pg_dump non riuscito, provo altri metodi…", lastErr.slice(0, 120));
  }

  // 2) supabase CLI (richiede Docker)
  if (hasDocker) {
    console.log("Motore: npx supabase db dump");
    for (const dbUrl of buildPgDumpUrls(ref, password)) {
      process.stdout.write(`  Provo ${hostOf(dbUrl)} … `);
      const result = trySupabaseDump(dbUrl, outFile);
      if (result.ok) {
        console.log(`OK (${formatBytes(statSync(outFile).size)})`);
        console.log("\nBackup completato:", outFile);
        return;
      }
      console.log("FAIL");
    }
  } else if (!pgDumpBin) {
    console.log(
      "Motore: Node/pg (dati public+storage). Installa pg_dump o Docker per dump DDL nativo.",
    );
  }

  // 3) Fallback Node
  console.log("Avvio dump SQL via Node/pg…");
  const { totalRows, tables } = await nodeSqlDump(ref, password, outFile);
  console.log(
    `\nBackup completato: ${outFile} (${formatBytes(statSync(outFile).size)}, ${tables} tabelle, ${totalRows} INSERT)`,
  );
  console.log("Cartella backups/ esclusa da Git (.gitignore).");
}

main().catch((err) => {
  console.error("\nErrore:", err.message || err);
  process.exit(1);
});
