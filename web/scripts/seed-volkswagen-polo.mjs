/**
 * Inserisce/aggiorna Volkswagen Polo FW152KR — categoria Auto.
 * Libretto: Libretto FW152KR (Noleggio).pdf — immatricolazione 10.05.2019.
 * Slug stabile senza targa: volkswagen-polo
 * Uso: cd web && node scripts/seed-volkswagen-polo.mjs
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

const SLUG = "volkswagen-polo";
const FRONT = "/images/veicoli/volkswagen-polo-noleggio-auto-trieste.webp";
const REAR = "/images/veicoli/volkswagen-polo-posteriore-trieste.webp";
const INT_FRONT = "/images/veicoli/volkswagen-polo-interno-anteriore-trieste.webp";
const INT_REAR = "/images/veicoli/volkswagen-polo-interno-posteriore-trieste.webp";
const TRUNK = "/images/veicoli/volkswagen-polo-bagagliaio-trieste.webp";
const ALT =
  "Noleggio auto Volkswagen Polo rossa a Trieste — LILO S.r.l. Viale Campi Elisi";

const HIGHLIGHTS = [
  "City-car affidabile: Volkswagen Polo 5 porte, ideale per muoversi e parcheggiare a Trieste.",
  "Motore 1.0 benzina 59 kW: consumi contenuti per uso urbano ed extraurbano.",
  "5 posti, cambio manuale: comoda per famiglia, lavoro e weekend.",
  "Ritiro in sede: Viale Campi Elisi 38/b, Trieste.",
];

const FAQ = [
  {
    q: "Che patente serve per la Volkswagen Polo?",
    a: "Patente B. È un’autovettura M1 a 5 posti.",
  },
  {
    q: "Dove ritiro l’auto?",
    a: "Presso la sede LILO S.r.l. in Viale Campi Elisi 38/b a Trieste.",
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

  // Libretto FW152KR: B 10.05.2019, D.1 VOLKSWAGEN, D.3 POLO,
  // P.1 999 cm³, P.2 59 kW, P.3 BENZ, S.1 5, cambio MECCANICO,
  // L 4,053 m, l 1,751 m, massa a vuoto 1050 kg, Euro 6D TEMP
  const veicoloPayload = {
    categoria_id: categoria.id,
    targa: "FW152KR",
    marca: "Volkswagen",
    modello: "Polo",
    versione: "1.0 59 kW",
    anno_immatricolazione: 2019,
    colore: "Rosso",
    alimentazione: "Benzina",
    cambio: "Manuale",
    posti: 5,
    porte: 5,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 4,
    unita_disponibili: 1,
    titolo_pubblico: "Noleggio Volkswagen Polo a Trieste",
    sottotitolo:
      "Utilitaria 5 porte benzina: compatta, affidabile e comoda per città e dintorni.",
    descrizione_breve:
      "Noleggio Volkswagen Polo a Trieste: auto utilitaria rossa 5 porte, benzina 1.0, 5 posti. Ideale per città e spostamenti quotidiani. Ritiro in Viale Campi Elisi 38/b.",
    descrizione_completa:
      "La Volkswagen Polo (immatricolazione 2019) è l’utilitaria della flotta LILO S.r.l. a Trieste: 5 porte, 5 posti, motore benzina 1.0 da 59 kW e cambio manuale. Compatta per il traffico cittadino, affidabile per lavoro, famiglia e weekend in provincia. Dimensioni esterne 4,05 × 1,75 m. Ritiro e riconsegna presso la sede di Viale Campi Elisi 38/b a Trieste.",
    seo_title: "Noleggio Volkswagen Polo Trieste | Auto Utilitaria | LILO",
    seo_description:
      "Noleggia una Volkswagen Polo a Trieste: utilitaria 5 porte benzina, 5 posti. Tariffe chiare, ritiro in Viale Campi Elisi 38/b. LILO Autonoleggio.",
    seo_keywords: [
      "noleggio volkswagen polo trieste",
      "noleggio auto trieste",
      "noleggio utilitaria trieste",
      "polo noleggio trieste",
    ],
    ai_summary:
      "Volkswagen Polo — utilitaria 5 porte benzina 1.0 (5 posti) a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b.",
    ai_highlights: HIGHLIGHTS,
    ai_faq: FAQ,
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
    trazione: "Anteriore",
    sensori_parcheggio: false,
    lunghezza_mm: 4053,
    larghezza_mm: 1751,
    og_image_url: FRONT,
  };

  const { data: byTarga } = await supabase
    .from("veicoli")
    .select("id")
    .eq("targa", "FW152KR")
    .maybeSingle();
  const { data: bySlug } = await supabase
    .from("veicoli")
    .select("id")
    .eq("slug", SLUG)
    .maybeSingle();

  const existingId = byTarga?.id ?? bySlug?.id;
  let veicoloId;
  if (existingId) {
    const { data, error } = await supabase
      .from("veicoli")
      .update(veicoloPayload)
      .eq("id", existingId)
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

  const prezzoPayload = {
    veicolo_id: veicoloId,
    tipo_tariffa: "giornaliero",
    importo: 40,
    valuta: "EUR",
    descrizione: "100 km inclusi / Assicurazione base",
    attivo: true,
  };

  if (prezzoExists?.id) {
    const { error } = await supabase.from("prezzi").update(prezzoPayload).eq("id", prezzoExists.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("prezzi").insert(prezzoPayload);
    if (error) throw error;
  }

  await supabase.from("foto").update({ is_copertina: false }).eq("veicolo_id", veicoloId);

  const foto = [
    {
      storage_path: "local/volkswagen-polo-noleggio-auto-trieste.webp",
      url_pubblico: FRONT,
      alt_text: ALT,
      titolo: "Volkswagen Polo rossa noleggio auto Trieste — frontale",
      ordine: 0,
      is_copertina: true,
    },
    {
      storage_path: "local/volkswagen-polo-posteriore-trieste.webp",
      url_pubblico: REAR,
      alt_text: "Volkswagen Polo rossa — vista posteriore noleggio Trieste LILO",
      titolo: "Volkswagen Polo noleggio auto Trieste — posteriore",
      ordine: 1,
      is_copertina: false,
    },
    {
      storage_path: "local/volkswagen-polo-interno-anteriore-trieste.webp",
      url_pubblico: INT_FRONT,
      alt_text: "Interno anteriore Volkswagen Polo noleggio Trieste",
      titolo: "Volkswagen Polo — abitacolo anteriore",
      ordine: 2,
      is_copertina: false,
    },
    {
      storage_path: "local/volkswagen-polo-interno-posteriore-trieste.webp",
      url_pubblico: INT_REAR,
      alt_text: "Sedili posteriori Volkswagen Polo noleggio Trieste",
      titolo: "Volkswagen Polo — sedili posteriori",
      ordine: 3,
      is_copertina: false,
    },
    {
      storage_path: "local/volkswagen-polo-bagagliaio-trieste.webp",
      url_pubblico: TRUNK,
      alt_text: "Bagagliaio Volkswagen Polo noleggio Trieste",
      titolo: "Volkswagen Polo — bagagliaio",
      ordine: 4,
      is_copertina: false,
    },
  ];

  for (const f of foto) {
    const row = { veicolo_id: veicoloId, storage_bucket: "veicoli", ...f };
    const { data: found } = await supabase
      .from("foto")
      .select("id")
      .eq("veicolo_id", veicoloId)
      .eq("storage_path", f.storage_path)
      .maybeSingle();
    if (found?.id) {
      const { error } = await supabase.from("foto").update(row).eq("id", found.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("foto").insert(row);
      if (error) throw error;
    }
  }

  console.log("OK — Volkswagen Polo FW152KR → auto /", SLUG);
  console.log("Scheda: https://www.lilosrl.it/flotta/" + SLUG);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
