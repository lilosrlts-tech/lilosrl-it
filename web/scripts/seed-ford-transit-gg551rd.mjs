/**
 * Aggiorna Ford Transit L2H2 (GG551RD) — Furgoni Grandi.
 * Uso: cd web && node scripts/seed-ford-transit-gg551rd.mjs
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

const SLUG = "ford-transit-gg551rd";
const COVER = "/images/veicoli/ford-transit-gg551rd-noleggio-furgoni-grandi-trieste.webp";
const REAR = "/images/veicoli/ford-transit-gg551rd-posteriore-trieste.webp";

const HIGHLIGHTS = [
  "Categoria Grande: Dimensioni L2H2 ideali per traslochi e trasporto merci a Trieste.",
  "Portata utile 1.166 kg (libretto) e vano circa 10 m³ con tetto alto.",
  "Ritiro in sede: Viale Campi Elisi 38/b a Trieste.",
];

async function main() {
  const { data: categoria, error: catErr } = await supabase
    .from("categorie")
    .select("id")
    .eq("slug", "furgoni-grandi")
    .single();

  if (catErr || !categoria) {
    throw new Error(`Categoria furgoni-grandi non trovata: ${catErr?.message}`);
  }

  const veicoloPayload = {
    categoria_id: categoria.id,
    targa: "GG551RD",
    marca: "Ford",
    modello: "Transit",
    versione: "L2H2",
    anno_immatricolazione: 2021,
    colore: "Bianco",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    porte: 4,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    titolo_pubblico: "Ford Transit L2H2 — Furgone grande Trieste",
    sottotitolo: "Ideale per traslochi e trasporto merci",
    descrizione_breve:
      "Noleggio Ford Transit L2H2 a Trieste: furgone grande, tetto alto e passo medio. Ritiro in Viale Campi Elisi 38/b.",
    descrizione_completa:
      "Il Ford Transit L2H2 è il furgone grande di riferimento per traslochi e trasporto merci a Trieste: dimensioni L2H2 con tetto alto, vano circa 10 m³ e portata utile da libretto di 1.166 kg. Ritiro e riconsegna presso la sede di Viale Campi Elisi 38/b.",
    seo_title: "Noleggio Ford Transit L2H2 Trieste | Furgoni Grandi | LILO S.r.l.",
    seo_description:
      "Noleggia il Ford Transit L2H2 a Trieste. Furgone grande ~10 m³, portata 1.166 kg. Ritiro in Viale Campi Elisi 38/b.",
    ai_summary:
      "Ford Transit L2H2 — furgone grande a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b.",
    ai_highlights: HIGHLIGHTS,
    ai_context: "Ritiro e riconsegna presso la sede in Viale Campi Elisi 38/B, Trieste.",
    volume_metri_cubi: 10,
    portata_utile_kg: 1166,
    volume_carico_mc: 10,
    portata_kg: 1166,
    lunghezza_mm: 5531,
    larghezza_mm: 2059,
    altezza_mm: 2470,
    trazione: "Anteriore",
    passo: "Medio",
    tetto: "Alto",
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

  if (!prezzoExists?.id) {
    const { error } = await supabase.from("prezzi").insert({
      veicolo_id: veicoloId,
      tipo_tariffa: "giornaliero",
      importo: 60,
      descrizione: "100 km inclusi / Assicurazione base",
      attivo: true,
    });
    if (error) throw error;
  }

  // Rimuovi foto obsolete (FT407 riusate per errore) e ripubblica le due corrette
  await supabase.from("foto").delete().eq("veicolo_id", veicoloId);

  const foto = [
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/ford-transit-gg551rd-noleggio-furgoni-grandi-trieste.webp",
      url_pubblico: COVER,
      alt_text:
        "Noleggio Ford Transit L2H2 furgone grande presso LILO Autonoleggio Viale Campi Elisi Trieste",
      titolo: "Ford Transit L2H2 — Furgone grande Trieste",
      ordine: 0,
      is_copertina: true,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/ford-transit-gg551rd-posteriore-trieste.webp",
      url_pubblico: REAR,
      alt_text: "Vista posteriore Ford Transit L2H2 noleggio furgoni grandi Trieste",
      titolo: "Ford Transit L2H2 posteriore Trieste",
      ordine: 1,
      is_copertina: false,
    },
  ];

  const { error: fotoErr } = await supabase.from("foto").insert(foto);
  if (fotoErr) throw fotoErr;

  // FT407 resta solo in XL — verifica categoria
  const { data: xl } = await supabase.from("categorie").select("id").eq("slug", "furgoni-xl").single();
  if (xl?.id) {
    const { error } = await supabase
      .from("veicoli")
      .update({
        categoria_id: xl.id,
        versione: "L3H2",
        titolo_pubblico: "Ford Transit L3H2 — Furgone XL Trieste",
        og_image_url: "/images/veicoli/ford-transit-l3h2-passo-lungo-noleggio.webp",
      })
      .eq("slug", "ford-transit-l3h2");
    if (error) throw error;
    console.log("FT407CY confermato in furgoni-xl");
  }

  console.log("OK — GG551RD L2H2 in furgoni-grandi");
  console.log("Scheda: http://localhost:3000/flotta/ford-transit-gg551rd");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
