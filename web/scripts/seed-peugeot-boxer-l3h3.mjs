/**
 * Inserisce/aggiorna Peugeot Boxer L3H3 — Furgoni XL (Extra Large).
 * Uso: cd web && node scripts/seed-peugeot-boxer-l3h3.mjs
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

const SLUG = "peugeot-boxer-l3h3";
const LEGACY_SLUG = "peugeot-boxer-l3h3-ix345ij";

const HIGHLIGHTS = [
  "📦 Configurazione Extra Large L3H3: Volume di carico massimo (circa 15 m³) con tetto super alto ed estensione in lunghezza.",
  "🐘 Capienza Senza Compromessi: Permette di caricare arredi voluminosi, mobilio alto in verticale e carichi industriali ingombranti.",
  "🛠️ Ideale per Traslochi Impegnativi: Massimizza l'efficienza dei viaggi per aziende, artigiani e grandi traslochi privati.",
  "📍 Ritiro e Consegna in Sede: Presso la sede LILO S.r.l. di Viale Campi Elisi 38/b a Trieste.",
];

async function main() {
  const { data: categoria, error: catErr } = await supabase
    .from("categorie")
    .select("id")
    .eq("slug", "furgoni-xl")
    .single();

  if (catErr || !categoria) {
    throw new Error(`Categoria furgoni-xl non trovata: ${catErr?.message}`);
  }

  const veicoloPayload = {
    categoria_id: categoria.id,
    targa: "GB762PM",
    marca: "Peugeot",
    modello: "Boxer",
    versione: "L3H3",
    anno_immatricolazione: 2018,
    colore: "Bianco",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    porte: 4,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 3,
    titolo_pubblico: "Peugeot Boxer L3H3 — Furgone extra large Trieste",
    sottotitolo: "Massimo volume di carico con tetto super alto",
    descrizione_breve:
      "Noleggio Peugeot Boxer L3H3 a Trieste: furgone extra large (~15 m³), tetto super alto e passo lungo. Ritiro in Viale Campi Elisi 38/b.",
    descrizione_completa:
      "Il Peugeot Boxer L3H3 è il furgone extra large di LILO S.r.l.: configurazione L3H3 con circa 15 m³ di volume utile, tetto super alto e passo lungo per traslochi impegnativi e carichi voluminosi. Ideale per arredi alti, mobilio in verticale e carichi industriali. Ritiro e riconsegna presso la sede di Viale Campi Elisi 38/b a Trieste.",
    seo_title: "Noleggio Peugeot Boxer L3H3 Trieste | Furgoni XL | LILO",
    seo_description:
      "Noleggia il Peugeot Boxer L3H3 a Trieste (Viale Campi Elisi 38/b). Furgone extra large ~15 m³, tetto super alto. LILO Autonoleggio.",
    ai_summary:
      "Peugeot Boxer L3H3 — furgone extra large (~15 m³) a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b.",
    ai_highlights: HIGHLIGHTS,
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
    volume_metri_cubi: 15,
    portata_utile_kg: 1400,
    volume_carico_mc: 15,
    portata_kg: 1400,
    trazione: "Anteriore",
    passo: "Lungo",
    tetto: "Super alto",
    sensori_parcheggio: false,
    og_image_url: "/images/veicoli/furgone-peugeot-boxer-l3h3-trieste.webp",
  };

  const { data: legacy } = await supabase
    .from("veicoli")
    .select("id")
    .eq("slug", LEGACY_SLUG)
    .maybeSingle();

  const { data: existing } = await supabase
    .from("veicoli")
    .select("id")
    .eq("slug", SLUG)
    .maybeSingle();

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
  } else if (legacy?.id) {
    const { data, error } = await supabase
      .from("veicoli")
      .update(veicoloPayload)
      .eq("id", legacy.id)
      .select("id")
      .single();
    if (error) throw error;
    veicoloId = data.id;
    console.log("Veicolo migrato da legacy slug:", veicoloId);
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
        importo: 70,
        descrizione: "100 km inclusi / Assicurazione base",
        attivo: true,
      })
      .eq("id", prezzoExists.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("prezzi").insert({
      veicolo_id: veicoloId,
      tipo_tariffa: "giornaliero",
      importo: 70,
      descrizione: "100 km inclusi / Assicurazione base",
      attivo: true,
    });
    if (error) throw error;
  }

  const foto = [
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/furgone-peugeot-boxer-l3h3-trieste.webp",
      url_pubblico: "/images/veicoli/furgone-peugeot-boxer-l3h3-trieste.webp",
      alt_text:
        "Noleggio furgone gran volume Peugeot Boxer L3H3 bianco a Trieste presso LILO Autonoleggio in Viale Campi Elisi 38/b",
      titolo: "Peugeot Boxer L3H3 noleggio furgoni extra large Trieste",
      ordine: 0,
      is_copertina: true,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/furgone-peugeot-boxer-l3h3-retro.webp",
      url_pubblico: "/images/veicoli/furgone-peugeot-boxer-l3h3-retro.webp",
      alt_text:
        "Vista laterale e posteriore furgone Peugeot Boxer L3H3 per traslochi voluminosi a Trieste",
      titolo: "Noleggio furgone L3H3 tetto super alto Trieste",
      ordine: 1,
      is_copertina: false,
    },
  ];

  for (const f of foto) {
    const { data: found } = await supabase
      .from("foto")
      .select("id")
      .eq("veicolo_id", veicoloId)
      .eq("storage_path", f.storage_path)
      .maybeSingle();

    if (found?.id) {
      // Prima togli eventuali altre copertine per evitare idx_foto_copertina_unica
      if (f.is_copertina) {
        await supabase.from("foto").update({ is_copertina: false }).eq("veicolo_id", veicoloId);
      }
      const { error } = await supabase.from("foto").update(f).eq("id", found.id);
      if (error) throw error;
    } else {
      if (f.is_copertina) {
        await supabase.from("foto").update({ is_copertina: false }).eq("veicolo_id", veicoloId);
      }
      const { error } = await supabase.from("foto").insert(f);
      if (error) throw error;
    }
  }

  console.log("OK — Peugeot Boxer L3H3 pubblicato su Supabase");
  console.log("Scheda: http://localhost:3000/flotta/peugeot-boxer-l3h3");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
