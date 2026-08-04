/**
 * Inserisce/aggiorna il Ford Transit L2H2 (DV344HD) — Furgoni Grandi (Uso Città).
 * Uso: cd web && node scripts/seed-ford-transit-l2h2.mjs
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

const SLUG = "ford-transit-l2h2";

const HIGHLIGHTS = [
  "Categoria Grande / Città: Dimensioni L2H2 ideali per traslochi voluminosi e trasporto merci, mantenendo un'ottima manovrabilità urbana.",
  "Ampia Capacità di Carico: Tetto alto (H2) e passo medio (L2) per stivare carichi alti, mobili e bancali senza problemi.",
  "Ritiro in Sede: Disponibile per il ritiro diretto presso la sede di Viale Campi Elisi 38/b a Trieste.",
];

async function main() {
  const { data: categoria, error: catErr } = await supabase
    .from("categorie")
    .select("id")
    .eq("slug", "furgoni-grandi-citta")
    .single();

  if (catErr || !categoria) {
    throw new Error(`Categoria furgoni-grandi-citta non trovata: ${catErr?.message}`);
  }

  const veicoloPayload = {
    categoria_id: categoria.id,
    targa: "DV344HD",
    marca: "Ford",
    modello: "Transit",
    versione: "L2H2",
    anno_immatricolazione: 2012,
    colore: "Bianco",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    porte: 4,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 1,
    titolo_pubblico: "Ford Transit L2H2 — Furgone grande uso città Trieste",
    sottotitolo: "Ampia capacità di carico con manovrabilità urbana",
    descrizione_breve:
      "Noleggio Ford Transit L2H2 a Trieste: furgone grande uso città, tetto alto e passo medio. Ritiro in Viale Campi Elisi 38/b. Targa DV344HD.",
    descrizione_completa:
      "Il Ford Transit L2H2 (targa DV344HD) è il furgone grande uso città di LILO S.r.l.: dimensioni L2H2 ideali per traslochi voluminosi e trasporto merci, con ottima manovrabilità in ambito urbano. Tetto alto (H2) e passo medio (L2) per stivare carichi alti, mobili e bancali. Ritiro e riconsegna presso la sede di Viale Campi Elisi 38/b a Trieste.",
    seo_title: "Noleggio Ford Transit L2H2 Trieste | Furgoni Grandi Città | LILO",
    seo_description:
      "Noleggia il Ford Transit L2H2 a Trieste (Viale Campi Elisi 38/b). Furgone grande uso città, ampia capacità di carico. LILO Autonoleggio.",
    ai_summary:
      "Ford Transit L2H2 — furgone grande uso città a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b. Targa DV344HD.",
    ai_highlights: HIGHLIGHTS,
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
    volume_metri_cubi: 10,
    portata_utile_kg: 1200,
    volume_carico_mc: 10,
    portata_kg: 1200,
    trazione: "Anteriore",
    passo: "Medio",
    tetto: "Alto",
    sensori_parcheggio: false,
    og_image_url: "/images/veicoli/ford-transit-l2h2-noleggio-trieste.webp",
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
        importo: 55,
        descrizione: "50 km inclusi / Assicurazione base — uso città",
        attivo: true,
      })
      .eq("id", prezzoExists.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("prezzi").insert({
      veicolo_id: veicoloId,
      tipo_tariffa: "giornaliero",
      importo: 55,
      descrizione: "50 km inclusi / Assicurazione base — uso città",
      attivo: true,
    });
    if (error) throw error;
  }

  const foto = [
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/ford-transit-l2h2-noleggio-trieste.webp",
      url_pubblico: "/images/veicoli/ford-transit-l2h2-noleggio-trieste.webp",
      alt_text:
        "Noleggio furgone Ford Transit L2H2 presso LILO Autonoleggio in Viale Campi Elisi 38/b Trieste",
      titolo: "Ford Transit L2H2 noleggio furgoni grandi Trieste Viale Campi Elisi",
      ordine: 0,
      is_copertina: true,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/ford-transit-l2h2-retro-trieste.webp",
      url_pubblico: "/images/veicoli/ford-transit-l2h2-retro-trieste.webp",
      alt_text:
        "Vista posteriore Ford Transit L2H2 per traslochi e trasporto merci a Trieste Viale Campi Elisi",
      titolo: "Noleggio Ford Transit L2H2 Categoria Grande Trieste",
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
      const { error } = await supabase.from("foto").update(f).eq("id", found.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("foto").insert(f);
      if (error) throw error;
    }
  }

  console.log("OK — Ford Transit L2H2 pubblicato su Supabase");
  console.log("Scheda: http://localhost:3000/flotta/ford-transit-l2h2");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
