/**
 * Inserisce/aggiorna il Citroën Jumpy FR523SW su Supabase.
 * Uso: cd web && node scripts/seed-citroen-jumpy.mjs
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

const SLUG = "citroen-jumpy-fr523sw";

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
    targa: "FR523SW",
    marca: "Citroën",
    modello: "Jumpy",
    versione: "L1 H1",
    anno_immatricolazione: 2024,
    colore: "Bianco",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    porte: 4,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 5,
    titolo_pubblico: "Citroën Jumpy L1 H1 — Noleggio furgone medio Trieste",
    sottotitolo: "Furgone medio diesel, ideale per lavoro e consegne",
    descrizione_breve:
      "Noleggio Citroën Jumpy L1 H1 a Trieste: 5,3 m³, portata 1.028 kg, vano interno 2.512×1.258×1.397 mm. Targa FR523SW, immatricolazione 2024.",
    descrizione_completa:
      "Il Citroën Jumpy L1 H1 (targa FR523SW) è un furgone medio diesel con vano interno da 2.512 mm di lunghezza, 1.258 mm tra i passaruota e 1.397 mm di altezza, per un volume utile di 5,3 m³ e portata utile di 1.028 kg. Disponibile presso LILO S.r.l. a Trieste, Viale Campi Elisi 38/B.",
    seo_title: "Noleggio Citroën Jumpy L1 H1 Trieste | LILO Autonoleggio",
    seo_description:
      "Noleggia il Citroën Jumpy L1 H1 (5,3 m³) a Trieste con LILO S.r.l. Furgone medio diesel, targa FR523SW, ritiro in sede.",
    ai_summary:
      "Citroën Jumpy L1 H1 diesel, 5,3 m³, vano 2.512 mm — noleggio a Trieste presso LILO S.r.l. Targa FR523SW, anno 2024.",
    ai_highlights: ["5,3 m³", "Diesel", "Portata 1.028 kg", "Vano 2.512 mm", "Trieste"],
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
    volume_metri_cubi: 5.3,
    portata_utile_kg: 1028,
    volume_carico_mc: 5.3,
    portata_kg: 1028,
    lunghezza_vano_mm: 2512,
    larghezza_vano_mm: 1258,
    altezza_vano_mm: 1397,
    vano_lunghezza_mm: 2512,
    vano_larghezza_mm: 1258,
    vano_altezza_mm: 1397,
    trazione: "Anteriore",
    passo: "Corto",
    tetto: "Basso",
    sensori_parcheggio: true,
    lunghezza_mm: 4983,
    larghezza_mm: 1920,
    altezza_mm: 1895,
    og_image_url: "/images/veicoli/citroen-jumpy-fr523sw-copertina.webp",
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
      .update({ importo: 95, descrizione: "Tariffa giornaliera", attivo: true })
      .eq("id", prezzoExists.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("prezzi").insert({
      veicolo_id: veicoloId,
      tipo_tariffa: "giornaliero",
      importo: 95,
      descrizione: "Tariffa giornaliera",
      attivo: true,
    });
    if (error) throw error;
  }

  const foto = [
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/citroen-jumpy-fr523sw-copertina.webp",
      url_pubblico: "/images/veicoli/citroen-jumpy-fr523sw-copertina.webp",
      alt_text:
        "Noleggio Furgone Medio Citroën Jumpy LILO Autonoleggio Trieste - Fiancata con targa FR523SW",
      ordine: 0,
      is_copertina: true,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/citroen-jumpy-fr523sw-posteriore.webp",
      url_pubblico: "/images/veicoli/citroen-jumpy-fr523sw-posteriore.webp",
      alt_text:
        "Noleggio Furgone Medio Citroën Jumpy LILO Autonoleggio Trieste - Posteriore con targa FR523SW",
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

  console.log("OK — Citroën Jumpy FR523SW pubblicato su Supabase");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
