/**
 * Inserisce/aggiorna Fiat Doblò FE648PP — Furgoni Piccoli (blu, 2016).
 * Libretto: FE648PP (Noleggio).pdf — immatricolazione 23.06.2016, portata 705 kg.
 * Uso: cd web && node scripts/seed-fiat-doblo-fe648pp.mjs
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

/** Slug stabile senza targa (fiat-doblo-cargo = altro mezzo bianco GH618PT). */
const SLUG = "fiat-doblo";
const FRONT = "/images/veicoli/fiat-doblo-blu-noleggio-furgoni-piccoli-trieste.webp";
const REAR = "/images/veicoli/fiat-doblo-blu-posteriore-trieste.webp";
const ALT =
  "Noleggio furgone piccolo Fiat Doblò blu a Trieste — LILO S.r.l. Viale Campi Elisi";

const HIGHLIGHTS = [
  "Furgone piccolo agile: ideale per consegne e piccoli trasporti nel traffico di Trieste.",
  "Portata utile 705 kg (libretto): adatto a scatoloni, attrezzature e traslochi leggeri.",
  "3 posti e cambio manuale: pratico per lavoro in città e provincia.",
  "Ritiro in sede: Viale Campi Elisi 38/b, Trieste.",
];

const FAQ = [
  {
    q: "Per cosa è adatto il Fiat Doblò a noleggio?",
    a: "È un furgone piccolo (categoria Furgoni Piccoli) pensato per consegne urbane, piccoli traslochi e trasporto attrezzature, con buona manovrabilità in città.",
  },
  {
    q: "Dove ritiro il veicolo?",
    a: "Presso la sede LILO S.r.l. in Viale Campi Elisi 38/b a Trieste.",
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

  // Libretto FE648PP: B 23.06.2016, D.3 FIAT DOBLO', P.3 GASOL, S.1 3,
  // lunghezza 4,406 m, larghezza 1,832 m, portata 705 kg, massa vuoto 1320 kg,
  // cambio MECCANICO, cilindrata 1598 cm³
  // Volume vano OEM Doblò Cargo L1 ~3,4 m³ (non sul libretto)
  const veicoloPayload = {
    categoria_id: categoria.id,
    targa: "FE648PP",
    marca: "Fiat",
    modello: "Doblò",
    versione: "Cargo 1.6 Multijet",
    anno_immatricolazione: 2016,
    colore: "Blu",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    porte: 4,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 3,
    unita_disponibili: 1,
    titolo_pubblico: "Noleggio Furgone Piccolo Fiat Doblò a Trieste",
    sottotitolo:
      "Compatto e pratico per consegne urbane, piccoli traslochi e lavoro in città.",
    descrizione_breve:
      "Noleggio Fiat Doblò a Trieste: furgone piccolo diesel, 3 posti, portata utile 705 kg. Ideale consegne e trasporti urbani. Ritiro in Viale Campi Elisi 38/b.",
    descrizione_completa:
      "Il Fiat Doblò (immatricolazione 2016) è un furgone piccolo della flotta LILO S.r.l. a Trieste: compatto nel traffico cittadino, con portata utile 705 kg e circa 3,4 m³ di volume di carico. Alimentazione diesel, cambio manuale, 3 posti. Adatto a consegne, trasporto attrezzature, scatoloni e traslochi leggeri. Ritiro e riconsegna presso la sede di Viale Campi Elisi 38/b a Trieste.",
    seo_title: "Noleggio Fiat Doblò Trieste | Furgone Piccolo | LILO",
    seo_description:
      "Noleggia un Fiat Doblò a Trieste: furgone piccolo diesel, portata 705 kg. Tariffe chiare, ritiro in Viale Campi Elisi 38/b. LILO Autonoleggio.",
    seo_keywords: [
      "noleggio fiat doblo trieste",
      "noleggio furgone piccolo trieste",
      "furgone economico trieste",
      "doblo cargo noleggio",
    ],
    ai_summary:
      "Fiat Doblò — furgone piccolo diesel (~3,4 m³, portata 705 kg) a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b.",
    ai_highlights: HIGHLIGHTS,
    ai_faq: FAQ,
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
    volume_metri_cubi: 3.4,
    volume_carico_mc: 3.4,
    portata_utile_kg: 705,
    portata_kg: 705,
    trazione: "Anteriore",
    passo: "Corto",
    tetto: "Basso",
    sensori_parcheggio: false,
    lunghezza_mm: 4406,
    larghezza_mm: 1832,
    vano_lunghezza_mm: 1820,
    vano_larghezza_mm: 1714,
    vano_altezza_mm: 1305,
    lunghezza_vano_mm: 1820,
    larghezza_vano_mm: 1714,
    altezza_vano_mm: 1305,
    larghezza_tra_passaruota_mm: 1229,
    og_image_url: FRONT,
  };

  const { data: byTarga } = await supabase
    .from("veicoli")
    .select("id")
    .eq("targa", "FE648PP")
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
      storage_path: "local/fiat-doblo-blu-noleggio-furgoni-piccoli-trieste.webp",
      url_pubblico: FRONT,
      alt_text: ALT,
      titolo: "Fiat Doblò blu noleggio furgone piccolo Trieste — frontale",
      ordine: 0,
      is_copertina: true,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/fiat-doblo-blu-posteriore-trieste.webp",
      url_pubblico: REAR,
      alt_text: "Fiat Doblò blu — vista posteriore noleggio Trieste LILO",
      titolo: "Fiat Doblò blu noleggio furgone piccolo Trieste — posteriore",
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

  console.log("OK — Fiat Doblò FE648PP → furgoni-piccoli /", SLUG);
  console.log("Scheda: https://www.lilosrl.it/flotta/" + SLUG);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
