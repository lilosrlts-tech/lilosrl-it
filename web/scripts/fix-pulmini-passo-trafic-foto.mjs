/**
 * Fix flotta: pulmini passo Normale + rimuove foto Trafic interni duplicata.
 * Uso: cd web && node scripts/fix-pulmini-passo-trafic-foto.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

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

const env = loadEnv(credPath);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: categoria, error: catErr } = await supabase
    .from("categorie")
    .select("id")
    .eq("slug", "pulmini-9-posti")
    .single();
  if (catErr || !categoria) throw new Error(catErr?.message || "categoria missing");

  const { data: updated, error: upErr } = await supabase
    .from("veicoli")
    .update({ passo: "Normale" })
    .eq("categoria_id", categoria.id)
    .select("slug,passo");
  if (upErr) throw upErr;
  console.log("Pulmini passo -> Normale:", updated);

  const { data: trafic } = await supabase
    .from("veicoli")
    .select("id")
    .eq("slug", "renault-trafic-9-posti")
    .single();
  if (!trafic) throw new Error("trafic missing");

  // abitacolo.webp è byte-identica a guida.webp → rimuovi il duplicato interni
  const { data: deleted, error: delErr } = await supabase
    .from("foto")
    .delete()
    .eq("veicolo_id", trafic.id)
    .eq("storage_path", "local/renault-trafic-9-posti-abitacolo.webp")
    .select("id,url_pubblico");
  if (delErr) throw delErr;
  console.log("Foto Trafic rimosse (duplicato interni):", deleted);

  // rinumera ordine rimanenti
  const { data: foto } = await supabase
    .from("foto")
    .select("id,ordine,url_pubblico")
    .eq("veicolo_id", trafic.id)
    .order("ordine", { ascending: true });

  let ordine = 0;
  for (const f of foto || []) {
    if (f.ordine !== ordine) {
      await supabase.from("foto").update({ ordine }).eq("id", f.id);
    }
    ordine += 1;
  }
  console.log(
    "Foto Trafic rimanenti:",
    (foto || []).map((f) => f.url_pubblico),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
