/**
 * Inserisce/aggiorna Opel Karl (FX170RW, Karl Rocks) — categoria Auto.
 * Foto placeholder (WP / provvisoria): sostituire quando arrivano le foto reali.
 * Uso: cd web && node scripts/seed-opel-karl.mjs
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

const SLUG = "opel-karl";
const COVER = "/images/veicoli/opel-karl-noleggio-auto-trieste.webp";

const HIGHLIGHTS = [
  "City-car compatta: Ideale per centro città, parcheggi stretti e spostamenti quotidiani a Trieste.",
  "Consumi contenuti: Motore benzina 1.0, agile e parsimoniosa per uso urbano ed extraurbano.",
  "5 posti e 5 porte: Pratica per famiglie piccole, turismo e lavoro in città.",
  "Ritiro in sede: Presso LILO S.r.l. in Viale Campi Elisi 38/b a Trieste.",
];

const FAQ = [
  {
    q: "Per cosa è adatta l'Opel Karl a noleggio?",
    a: "È una city-car compatta a 5 posti, perfetta per muoversi e parcheggiare a Trieste, weekend fuori porta e spostamenti di lavoro senza bisogno di un veicolo grande.",
  },
];

async function main() {
  const { data: categoria, error: catErr } = await supabase
    .from("categorie")
    .select("id")
    .eq("slug", "auto")
    .single();

  if (catErr || !categoria) {
    throw new Error(`Categoria auto non trovata: ${catErr?.message}`);
  }

  // Libretto FX170RW (prima immatricolazione 31.07.2019): KARLROCKS, benzina 999 cc / 54 kW,
  // cambio MEC, 5 posti, L 3676 × W 1632 mm, Euro 6d-TEMP. 2ª unità in flotta (foto reali da sostituire).
  const veicoloPayload = {
    categoria_id: categoria.id,
    targa: "FX170RW",
    marca: "Opel",
    modello: "Karl",
    versione: "Rocks",
    anno_immatricolazione: 2019,
    alimentazione: "Benzina",
    cambio: "Manuale",
    posti: 5,
    porte: 5,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 3,
    unita_disponibili: 2,
    titolo_pubblico: "Opel Karl — Noleggio auto city-car Trieste",
    sottotitolo: "Compatta, agile e pratica per Trieste e dintorni",
    descrizione_breve:
      "Noleggio Opel Karl a Trieste: city-car benzina a 5 posti, ideale per centro città e spostamenti quotidiani. Ritiro in Viale Campi Elisi 38/b.",
    descrizione_completa:
      "L'Opel Karl è la city-car compatta di LILO S.r.l. a Trieste: dimensioni ridotte (lunghezza 3,68 m), 5 porte e 5 posti, motore benzina e cambio manuale. Perfetta per muoversi e parcheggiare nel centro, weekend e spostamenti di lavoro. Due unità disponibili in flotta. Ritiro e riconsegna presso Viale Campi Elisi 38/b.",
    seo_title: "Noleggio Opel Karl Trieste | Auto City-Car | LILO Autonoleggio",
    seo_description:
      "Noleggia l'Opel Karl a Trieste (Viale Campi Elisi 38/b). City-car compatta a 5 posti, benzina, tariffe chiare. LILO Autonoleggio.",
    seo_keywords: [
      "noleggio opel karl trieste",
      "noleggio auto trieste",
      "city car trieste",
      "noleggio senza carta di credito",
    ],
    ai_summary:
      "Opel Karl — city-car a 5 posti a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b. Due unità disponibili.",
    ai_highlights: HIGHLIGHTS,
    ai_faq: FAQ,
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
    classe_ambientale: "Euro 6d-TEMP",
    trazione: "Anteriore",
    lunghezza_mm: 3676,
    larghezza_mm: 1632,
    og_image_url: COVER,
  };

  const { data: existing } = await supabase.from("veicoli").select("id").eq("slug", SLUG).maybeSingle();

  let veicoloId;
  if (existing?.id) {
    const { data, error } = await supabase
      .from("veicoli")
      .update(veicoloPayload)
      .eq("id", existing.id)
      .select("id")
      .single();
    if (error) throw error;
    veicoloId = data.id;
    console.log("Veicolo aggiornato:", veicoloId);
  } else {
    const { data, error } = await supabase
      .from("veicoli")
      .insert(veicoloPayload)
      .select("id")
      .single();
    if (error) throw error;
    veicoloId = data.id;
    console.log("Veicolo creato:", veicoloId);
  }

  const { data: prezzoExists } = await supabase
    .from("prezzi")
    .select("id")
    .eq("veicolo_id", veicoloId)
    .eq("tipo_tariffa", "giornaliero")
    .maybeSingle();

  if (prezzoExists?.id) {
    const { error } = await supabase
      .from("prezzi")
      .update({
        importo: 40,
        descrizione: "100 km inclusi / Assicurazione base",
        attivo: true,
      })
      .eq("id", prezzoExists.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("prezzi").insert({
      veicolo_id: veicoloId,
      tipo_tariffa: "giornaliero",
      importo: 40,
      descrizione: "100 km inclusi / Assicurazione base",
      attivo: true,
    });
    if (error) throw error;
  }

  const foto = {
    veicolo_id: veicoloId,
    storage_bucket: "veicoli",
    storage_path: "local/opel-karl-noleggio-auto-trieste.webp",
    url_pubblico: COVER,
    alt_text:
      "Noleggio autovettura Opel Karl city-car a Trieste presso LILO Autonoleggio in Viale Campi Elisi 38/b",
    titolo: "Opel Karl noleggio auto Trieste",
    didascalia: "Foto provvisoria — da sostituire con scatti reali della flotta LILO",
    ordine: 0,
    is_copertina: true,
  };

  const { data: found } = await supabase
    .from("foto")
    .select("id")
    .eq("veicolo_id", veicoloId)
    .eq("storage_path", foto.storage_path)
    .maybeSingle();

  if (found?.id) {
    const { error } = await supabase.from("foto").update(foto).eq("id", found.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("foto").insert(foto);
    if (error) throw error;
  }

  console.log("OK — Opel Karl pubblicato su Supabase (2 unità, foto placeholder)");
  console.log("Scheda: http://localhost:3000/flotta/opel-karl");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
