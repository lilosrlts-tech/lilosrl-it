/**
 * Inserisce/aggiorna Toyota Proace City (GJ996JJ) — Furgoni Piccoli.
 * Uso: cd web && node scripts/seed-toyota-proace-city.mjs
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

const SLUG = "toyota-proace-city";
const FRONT = "/images/flotta/furgone-piccolo-toyota-proace-city-trieste-front.webp";
const REAR = "/images/flotta/furgone-piccolo-toyota-proace-city-trieste-rear.webp";
const ALT =
  "Noleggio Furgone Piccolo Toyota Proace City a Trieste - Lilo SRL";

const HIGHLIGHTS = [
  "Dimensioni Compatte: Facile da guidare e parcheggiare anche nelle vie strette di Trieste.",
  "Ideale per Professionisti & Privati: Perfetto per consegne espresse, piccoli traslochi di scatole o trasporto strumenti.",
  "Consumi Ridotti: Categoria economica e dai bassi consumi di carburante.",
  "Noleggio Flessibile: Disponibile anche senza carta di credito.",
];

const FAQ = [
  {
    q: "Per cosa è adatto il noleggio di un furgone piccolo come il Toyota Proace City?",
    a: "Il furgone piccolo è ideale per muoversi agevolmente nel centro di Trieste, trasportare piccoli elettrodomestici, scatoloni o attrezzatura da lavoro fino a circa 3,3-3,8 metri cubi di carico.",
  },
];

async function main() {
  const { data: categoria, error: catErr } = await supabase
    .from("categorie")
    .select("id")
    .eq("slug", "furgoni-piccoli")
    .single();
  if (catErr || !categoria) {
    throw new Error(`Categoria furgoni-piccoli non trovata: ${catErr?.message}`);
  }

  // Libretto GJ996JJ (04.03.2022): L 4403, l 1848, portata 583 kg, 2 posti
  // Vano OEM Proace City L1: 1817 × 1527 × 1200, 3.3 m³ (fino a 3.8 con Smart Cargo)
  const veicoloPayload = {
    categoria_id: categoria.id,
    targa: "GJ996JJ",
    marca: "Toyota",
    modello: "Proace City",
    versione: "L1 / Van",
    anno_immatricolazione: 2022,
    colore: "Bianco",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 2,
    porte: 4,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 2,
    unita_disponibili: 2,
    titolo_pubblico: "Noleggio Furgone Piccolo Toyota Proace City a Trieste",
    sottotitolo:
      "Agilità urbana e massimo spazio di carico per i tuoi piccoli trasporti in città.",
    descrizione_breve:
      "Noleggio Toyota Proace City a Trieste: furgone piccolo (~3,3–3,8 m³), compatto e agile per consegne e piccoli trasporti urbani. Ritiro in Viale Campi Elisi 38/b.",
    descrizione_completa:
      "Il Toyota Proace City è il furgone piccolo di LILO S.r.l. a Trieste: compatto e agile nel traffico cittadino, ideale per consegne veloci, piccoli trasporti urbani, attrezzature di lavoro o traslochi leggeri. Volume di carico circa 3,3 m³ (fino a 3,8 m³ con Smart Cargo), portata utile 583 kg. Noleggio flessibile, anche senza carta di credito per uso in città. Ritiro e riconsegna presso Viale Campi Elisi 38/b.",
    seo_title: "Noleggio Furgone Piccolo Trieste | Toyota Proace City - Lilo SRL",
    seo_description:
      "Cerchi un furgone piccolo ed economico a Trieste? Noleggia il Toyota Proace City da LILO SRL. Trasparenza, tariffe chiare e noleggio senza carta di credito!",
    seo_keywords: [
      "noleggio furgone piccolo trieste",
      "toyota proace city trieste",
      "furgone economico trieste",
      "noleggio senza carta di credito",
    ],
    ai_summary:
      "Toyota Proace City — furgone piccolo (~3,3–3,8 m³) a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b. Compatto, agile, ideale consegne urbane.",
    ai_highlights: HIGHLIGHTS,
    ai_faq: FAQ,
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
    volume_metri_cubi: 3.3,
    volume_carico_mc: 3.3,
    portata_utile_kg: 583,
    portata_kg: 583,
    trazione: "Anteriore",
    passo: "Corto",
    tetto: "Basso",
    sensori_parcheggio: false,
    lunghezza_mm: 4403,
    larghezza_mm: 1848,
    vano_lunghezza_mm: 1817,
    vano_larghezza_mm: 1527,
    vano_altezza_mm: 1200,
    lunghezza_vano_mm: 1817,
    larghezza_vano_mm: 1527,
    altezza_vano_mm: 1200,
    larghezza_tra_passaruota_mm: 1229,
    og_image_url: FRONT,
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

  const prezzoPayload = {
    veicolo_id: veicoloId,
    tipo_tariffa: "giornaliero",
    importo: 50,
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
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/furgone-piccolo-toyota-proace-city-trieste-front.webp",
      url_pubblico: FRONT,
      alt_text: ALT,
      titolo: "Toyota Proace City noleggio furgone piccolo Trieste — frontale",
      ordine: 0,
      is_copertina: true,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/furgone-piccolo-toyota-proace-city-trieste-rear.webp",
      url_pubblico: REAR,
      alt_text: ALT,
      titolo: "Toyota Proace City noleggio furgone piccolo Trieste — posteriore",
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

  console.log("OK — Toyota Proace City → furgoni-piccoli");
  console.log("Scheda: http://localhost:3000/flotta/toyota-proace-city");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
