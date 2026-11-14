/**
 * Inserisce/aggiorna Citroën C3 automatica FW427YV — categoria Auto.
 * Libretto: LIBRETTO FW427YV (noleggio).pdf — immatricolazione 24.04.2019.
 * Scheda separata dalla C3 grigia manuale (slug citroen-c3, €40).
 * Uso: cd web && node scripts/seed-citroen-c3-automatica.mjs
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

const SLUG = "citroen-c3-automatica";
const FRONT = "/images/veicoli/citroen-c3-automatica-noleggio-auto-trieste.webp";
const SIDE = "/images/veicoli/citroen-c3-automatica-fiancata-trieste.webp";
const INT_FRONT = "/images/veicoli/citroen-c3-automatica-interno-anteriore-trieste.webp";
const INT_REAR = "/images/veicoli/citroen-c3-automatica-interno-posteriore-trieste.webp";
const TRUNK = "/images/veicoli/citroen-c3-automatica-bagagliaio-trieste.webp";
const ALT =
  "Noleggio auto Citroën C3 automatica verde chiaro a Trieste — LILO S.r.l. Viale Campi Elisi";

const HIGHLIGHTS = [
  "Cambio automatico: Citroën C3 5 porte, comoda nel traffico di Trieste.",
  "Motore 1.2 benzina 81 kW: utilitaria per città e spostamenti quotidiani.",
  "5 posti, cambio automatico: adatta a famiglia, lavoro e weekend.",
  "Ritiro in sede: Viale Campi Elisi 38/b, Trieste.",
];

const FAQ = [
  {
    q: "Che patente serve per la Citroën C3 automatica?",
    a: "Patente B. È un’autovettura M1 a 5 posti, con cambio automatico.",
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

  // Libretto FW427YV: B 24.04.2019, D.1 CITROEN, D.3 C3,
  // P.1 1199 cm³, P.2 81 kW, P.3 BENZ, S.1 5, tipo cambio AUT,
  // lunghezza 3,996 m, larghezza 1,749 m, massa a vuoto 1090 kg, Euro 6B.
  // Il 69,528 kW/t del libretto è il rapporto potenza/tara, non la potenza.
  const veicoloPayload = {
    categoria_id: categoria.id,
    targa: "FW427YV",
    marca: "Citroën",
    modello: "C3",
    versione: "1.2 81 kW",
    anno_immatricolazione: 2019,
    colore: "Verde chiaro",
    alimentazione: "Benzina",
    cambio: "Automatico",
    posti: 5,
    porte: 5,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 5,
    unita_disponibili: 1,
    titolo_pubblico: "Noleggio Citroën C3 automatica a Trieste",
    sottotitolo:
      "Utilitaria 5 porte benzina con cambio automatico, comoda per città e dintorni.",
    descrizione_breve:
      "Noleggio Citroën C3 automatica a Trieste: utilitaria verde chiaro 5 porte, benzina 1.2, cambio automatico, 5 posti. Ritiro in Viale Campi Elisi 38/b.",
    descrizione_completa:
      "La Citroën C3 automatica (immatricolazione 2019) è l’utilitaria con cambio automatico della flotta LILO S.r.l. a Trieste: 5 porte, 5 posti, motore benzina 1.2 da 81 kW e cambio automatico. Compatta per il traffico cittadino, adatta a lavoro, famiglia e weekend in provincia. Colore verde chiaro. Dimensioni esterne 3,996 × 1,749 m. Ritiro e riconsegna presso la sede di Viale Campi Elisi 38/b a Trieste.",
    seo_title: "Noleggio Citroën C3 Automatica Trieste | Auto | LILO",
    seo_description:
      "Noleggia una Citroën C3 automatica a Trieste: utilitaria 5 porte benzina, cambio automatico, 5 posti. Tariffe chiare, ritiro in Viale Campi Elisi 38/b. LILO Autonoleggio.",
    seo_keywords: [
      "noleggio citroen c3 automatica trieste",
      "noleggio auto automatica trieste",
      "noleggio auto trieste",
      "c3 cambio automatico noleggio trieste",
    ],
    ai_summary:
      "Citroën C3 automatica — utilitaria 5 porte benzina 1.2, cambio automatico, 5 posti, €49/giorno IVA inclusa, a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b.",
    ai_highlights: HIGHLIGHTS,
    ai_faq: FAQ,
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
    lunghezza_mm: 3996,
    larghezza_mm: 1749,
    og_image_url: FRONT,
  };

  const { data: byTarga } = await supabase
    .from("veicoli")
    .select("id")
    .eq("targa", "FW427YV")
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
    importo: 49,
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
      storage_path: "local/citroen-c3-automatica-noleggio-auto-trieste.webp",
      url_pubblico: FRONT,
      alt_text: ALT,
      titolo: "Citroën C3 automatica verde chiaro noleggio auto Trieste — frontale",
      ordine: 0,
      is_copertina: true,
    },
    {
      storage_path: "local/citroen-c3-automatica-fiancata-trieste.webp",
      url_pubblico: SIDE,
      alt_text: "Citroën C3 automatica verde chiaro — fiancata noleggio Trieste LILO",
      titolo: "Citroën C3 automatica noleggio auto Trieste — fiancata",
      ordine: 1,
      is_copertina: false,
    },
    {
      storage_path: "local/citroen-c3-automatica-interno-anteriore-trieste.webp",
      url_pubblico: INT_FRONT,
      alt_text: "Interno anteriore Citroën C3 automatica noleggio Trieste",
      titolo: "Citroën C3 automatica — abitacolo anteriore",
      ordine: 2,
      is_copertina: false,
    },
    {
      storage_path: "local/citroen-c3-automatica-interno-posteriore-trieste.webp",
      url_pubblico: INT_REAR,
      alt_text: "Sedili posteriori Citroën C3 automatica noleggio Trieste",
      titolo: "Citroën C3 automatica — sedili posteriori",
      ordine: 3,
      is_copertina: false,
    },
    {
      storage_path: "local/citroen-c3-automatica-bagagliaio-trieste.webp",
      url_pubblico: TRUNK,
      alt_text: "Bagagliaio Citroën C3 automatica noleggio Trieste",
      titolo: "Citroën C3 automatica — bagagliaio",
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

  console.log("OK — Citroën C3 automatica FW427YV → auto /", SLUG, "€49");
  console.log("Scheda: https://www.lilosrl.it/flotta/" + SLUG);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
