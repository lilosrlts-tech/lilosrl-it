/**
 * Inserisce/aggiorna Opel Vivaro Van — Furgoni Medi.
 * Uso: cd web && node scripts/seed-opel-vivaro.mjs
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

const SLUG = "opel-vivaro";

const HIGHLIGHTS = [
  "📦 Dimensioni Intermedie Ideali: Bilanciamento perfetto tra vano di carico capiente e facilità di guida nel traffico cittadino.",
  "🪜 Barre Portatutto Integrate: Equipaggiato con barre sul tetto per il trasporto pratico di scale, tubi o carichi lunghi.",
  "💼 Eccellente per Professionisti e Privati: Ottimo sia per piccoli traslochi fai-da-te che per esigenze lavorative giornaliere.",
  "📍 Ritiro e Consegna in Sede: Presso la sede LILO S.r.l. di Viale Campi Elisi 38/b a Trieste.",
];

async function main() {
  const { data: categoria, error: catErr } = await supabase
    .from("categorie")
    .select("id")
    .eq("slug", "furgoni-medi")
    .single();

  if (catErr || !categoria) {
    throw new Error(`Categoria furgoni-medi non trovata: ${catErr?.message}`);
  }

  const veicoloPayload = {
    categoria_id: categoria.id,
    targa: "n.d.",
    marca: "Opel",
    modello: "Vivaro",
    versione: "Van",
    anno_immatricolazione: 2015,
    colore: "Bianco",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    porte: 4,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 4,
    titolo_pubblico: "Opel Vivaro Van — Furgone medio Trieste",
    sottotitolo: "Furgone medio con barre portatutto, ideale città e piccoli traslochi",
    descrizione_breve:
      "Noleggio Opel Vivaro Van a Trieste: furgone medio con barre sul tetto, vano capiente e guida agevole. Ritiro in Viale Campi Elisi 38/b.",
    descrizione_completa:
      "L'Opel Vivaro Van è il furgone medio di LILO S.r.l.: bilanciamento ideale tra vano di carico e manovrabilità nel traffico di Trieste. Equipaggiato con barre portatutto per scale, tubi e carichi lunghi. Adatto a professionisti e privati per piccoli traslochi o lavoro quotidiano. Ritiro e riconsegna presso la sede di Viale Campi Elisi 38/b a Trieste.",
    seo_title: "Noleggio Opel Vivaro Trieste | Furgoni Medi | LILO Autonoleggio",
    seo_description:
      "Noleggia l'Opel Vivaro Van a Trieste (Viale Campi Elisi 38/b). Furgone medio con barre portatutto, ideale trasporti e piccoli traslochi. LILO.",
    ai_summary:
      "Opel Vivaro Van — furgone medio con barre portatutto a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b.",
    ai_highlights: HIGHLIGHTS,
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
    volume_metri_cubi: 5.2,
    portata_utile_kg: 1000,
    volume_carico_mc: 5.2,
    portata_kg: 1000,
    trazione: "Anteriore",
    passo: "Medio",
    tetto: "Basso",
    sensori_parcheggio: false,
    og_image_url: "/images/veicoli/furgone-opel-vivaro-trieste.webp",
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
        descrizione: "100 km inclusi / Assicurazione base",
        attivo: true,
      })
      .eq("id", prezzoExists.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("prezzi").insert({
      veicolo_id: veicoloId,
      tipo_tariffa: "giornaliero",
      importo: 55,
      descrizione: "100 km inclusi / Assicurazione base",
      attivo: true,
    });
    if (error) throw error;
  }

  const foto = [
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/furgone-opel-vivaro-trieste.webp",
      url_pubblico: "/images/veicoli/furgone-opel-vivaro-trieste.webp",
      alt_text:
        "Noleggio furgone medio Opel Vivaro bianco con barre sul tetto a Trieste presso LILO Autonoleggio in Viale Campi Elisi 38/b",
      titolo: "Opel Vivaro noleggio furgone medio Trieste",
      ordine: 0,
      is_copertina: true,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/furgone-opel-vivaro-retro.webp",
      url_pubblico: "/images/veicoli/furgone-opel-vivaro-retro.webp",
      alt_text:
        "Vista posteriore e laterale furgone Opel Vivaro per trasporto merci e traslochi a Trieste",
      titolo: "Noleggio Opel Vivaro furgone commerciale Trieste",
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

  console.log("OK — Opel Vivaro pubblicato su Supabase");
  console.log("Scheda: http://localhost:3000/flotta/opel-vivaro");
  console.log("Nota: targa non letta chiaramente dalle foto (impostata n.d.) — aggiornare quando nota.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
