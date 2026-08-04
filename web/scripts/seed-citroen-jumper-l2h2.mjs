/**
 * Inserisce/aggiorna Citroën Jumper L2H2 (FT248AN) — Furgoni Grandi (Uso Città).
 * Uso: cd web && node scripts/seed-citroen-jumper-l2h2.mjs
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

const SLUG = "citroen-jumper-l2h2";

const HIGHLIGHTS = [
  "📦 Configurazione L2H2: Passo medio e tetto alto per una capacità di carico ottimale (circa 11,5 m³) mantenendo un'ottima manovrabilità nel traffico urbano.",
  "🚛 Perfetto per Traslochi e Trasporto Merci: Altezza interna che consente di stare in piedi nel vano di carico e caricare merci ingombranti o elettrodomestici.",
  "🏙️ Uso Città e Provincia: Dimensioni bilanciate ideali per la viabilità e i parcheggi di Trieste e dintorni.",
  "📍 Ritiro e Consegna in Sede: Presso la sede LILO S.r.l. di Viale Campi Elisi 38/b a Trieste.",
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
    targa: "FT248AN",
    marca: "Citroën",
    modello: "Jumper",
    versione: "L2H2",
    anno_immatricolazione: 2016,
    colore: "Bianco",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    porte: 4,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 2,
    titolo_pubblico: "Citroën Jumper L2H2 — Furgone grande uso città Trieste",
    sottotitolo: "Passo medio, tetto alto: ~11,5 m³ con manovrabilità urbana",
    descrizione_breve:
      "Noleggio Citroën Jumper L2H2 a Trieste: furgone grande uso città (~11,5 m³), tetto alto e passo medio. Ritiro in Viale Campi Elisi 38/b. Targa FT248AN.",
    descrizione_completa:
      "Il Citroën Jumper L2H2 (targa FT248AN) è il furgone grande uso città di LILO S.r.l.: configurazione L2H2 con passo medio e tetto alto per circa 11,5 m³ di volume utile, ideale per traslochi e trasporto merci ingombranti senza rinunciare alla manovrabilità nel traffico di Trieste. Altezza interna che consente di stare in piedi nel vano di carico. Ritiro e riconsegna presso la sede di Viale Campi Elisi 38/b a Trieste.",
    seo_title: "Noleggio Citroën Jumper L2H2 Trieste | Furgoni Grandi Città | LILO",
    seo_description:
      "Noleggia il Citroën Jumper L2H2 a Trieste (Viale Campi Elisi 38/b). Furgone grande uso città ~11,5 m³, ideale traslochi. LILO Autonoleggio.",
    ai_summary:
      "Citroën Jumper L2H2 — furgone grande uso città (~11,5 m³) a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b. Targa FT248AN.",
    ai_highlights: HIGHLIGHTS,
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
    volume_metri_cubi: 11.5,
    portata_utile_kg: 1200,
    volume_carico_mc: 11.5,
    portata_kg: 1200,
    trazione: "Anteriore",
    passo: "Medio",
    tetto: "Alto",
    sensori_parcheggio: false,
    og_image_url: "/images/veicoli/furgone-citroen-jumper-l2h2-trieste.webp",
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
      storage_path: "local/furgone-citroen-jumper-l2h2-trieste.webp",
      url_pubblico: "/images/veicoli/furgone-citroen-jumper-l2h2-trieste.webp",
      alt_text:
        "Noleggio furgone grande Citroën Jumper L2H2 bianco a Trieste presso LILO Autonoleggio in Viale Campi Elisi 38/b",
      titolo: "Citroën Jumper L2H2 noleggio furgoni Trieste",
      ordine: 0,
      is_copertina: true,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/furgone-citroen-jumper-l2h2-retro.webp",
      url_pubblico: "/images/veicoli/furgone-citroen-jumper-l2h2-retro.webp",
      alt_text:
        "Vista laterale e posteriore furgone Citroën Jumper L2H2 per traslochi e merci a Trieste",
      titolo: "Noleggio furgone L2H2 uso città Trieste",
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

  console.log("OK — Citroën Jumper L2H2 pubblicato su Supabase");
  console.log("Scheda: http://localhost:3000/flotta/citroen-jumper-l2h2");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
