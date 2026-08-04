/**
 * Inserisce/aggiorna Renault Trafic 9 posti (GL555YT) — Pulmini 9 posti.
 * Uso: cd web && node scripts/seed-renault-trafic-9-posti.mjs
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

const SLUG = "renault-trafic-9-posti";

const HIGHLIGHTS = [
  "Comfort Anteriore: Posto guida ergonomico con bracciolo e plancia moderna dotata di vani portaoggetti capienti.",
  "Accesso Agevolato: Ampio portellone scorrevole e gradino d'ingresso ribassato per salire comodamente a bordo.",
  "Igiene e Pulizia: Interni in tessuto ad alta resistenza e tappetini in gomma lavabili, sempre igienizzati prima di ogni noleggio.",
];

async function main() {
  const { data: categoria, error: catErr } = await supabase
    .from("categorie")
    .select("id")
    .eq("slug", "pulmini-9-posti")
    .single();

  if (catErr || !categoria) {
    throw new Error(`Categoria pulmini-9-posti non trovata: ${catErr?.message}`);
  }

  const veicoloPayload = {
    categoria_id: categoria.id,
    targa: "GL555YT",
    marca: "Renault",
    modello: "Trafic",
    versione: "9 posti",
    anno_immatricolazione: 2020,
    colore: "Bianco",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 9,
    porte: 5,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 1,
    titolo_pubblico: "Renault Trafic 9 posti — Noleggio pulmino Trieste",
    sottotitolo: "Comfort, accesso agevolato e interni sempre igienizzati",
    descrizione_breve:
      "Noleggio Renault Trafic 9 posti a Trieste: pulmino diesel con posto guida confortevole, portellone scorrevole e interni igienizzati. Ritiro in Viale Campi Elisi 38/b. Targa GL555YT.",
    descrizione_completa:
      "Il Renault Trafic 9 posti (targa GL555YT) è il pulmino ideale per gruppi, gite ed eventi a Trieste. Offre posto guida ergonomico con bracciolo e plancia moderna, ampio portellone scorrevole con gradino d'ingresso ribassato, interni in tessuto ad alta resistenza e tappetini in gomma lavabili, sempre igienizzati prima di ogni noleggio. Ritiro e riconsegna presso LILO S.r.l., Viale Campi Elisi 38/b.",
    seo_title: "Noleggio Renault Trafic 9 posti Trieste | Pulmino LILO",
    seo_description:
      "Noleggia il Renault Trafic 9 posti a Trieste (Viale Campi Elisi 38/b). Comfort, accesso agevolato e interni igienizzati. LILO Autonoleggio.",
    ai_summary:
      "Renault Trafic 9 posti — pulmino a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b. Targa GL555YT.",
    ai_highlights: HIGHLIGHTS,
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
    configurazione_sedili: "3+3+3",
    climatizzazione_posteriore: true,
    trazione: "Anteriore",
    sensori_parcheggio: true,
    og_image_url: "/images/veicoli/renault-trafic-9-posti-noleggio-trieste.webp",
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

  // Se esiste il placeholder Tourneo, non competere in home/categoria
  await supabase
    .from("veicoli")
    .update({ pubblicato: false, attivo: false })
    .eq("slug", "ford-tourneo-9-posti");

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
        importo: 90,
        descrizione: "150 km inclusi / Assicurazione base",
        attivo: true,
      })
      .eq("id", prezzoExists.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("prezzi").insert({
      veicolo_id: veicoloId,
      tipo_tariffa: "giornaliero",
      importo: 90,
      descrizione: "150 km inclusi / Assicurazione base",
      attivo: true,
    });
    if (error) throw error;
  }

  const foto = [
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/renault-trafic-9-posti-noleggio-trieste.webp",
      url_pubblico: "/images/veicoli/renault-trafic-9-posti-noleggio-trieste.webp",
      alt_text: "Noleggio Renault Trafic 9 posti LILO Autonoleggio Viale Campi Elisi 38/b Trieste",
      titolo: "Renault Trafic 9 posti — esterno Trieste",
      ordine: 0,
      is_copertina: true,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/renault-trafic-9-posti-guida.webp",
      url_pubblico: "/images/veicoli/renault-trafic-9-posti-guida.webp",
      alt_text: "Posto di guida confortevole e plancia Renault Trafic 9 posti noleggio a Trieste",
      titolo: "Plancia e posto guida Renault Trafic 9 posti",
      ordine: 1,
      is_copertina: false,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/renault-trafic-9-posti-abitacolo.webp",
      url_pubblico: "/images/veicoli/renault-trafic-9-posti-abitacolo.webp",
      alt_text: "Abitacolo anteriore e sedili passeggeri Renault Trafic LILO Autonoleggio Trieste",
      titolo: "Interni anteriori Renault Trafic 9 posti",
      ordine: 2,
      is_copertina: false,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/renault-trafic-9-posti-file-sedili.webp",
      url_pubblico: "/images/veicoli/renault-trafic-9-posti-file-sedili.webp",
      alt_text:
        "Configurazione file di sedili posteriori per pulmino 9 posti ideale per gruppi a Trieste",
      titolo: "Spazio e comodi sedili posteriori Renault Trafic",
      ordine: 3,
      is_copertina: false,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/renault-trafic-9-posti-posteriore-trieste.webp",
      url_pubblico: "/images/veicoli/renault-trafic-9-posti-posteriore-trieste.webp",
      alt_text: "Vista posteriore Renault Trafic 9 posti noleggio Trieste LILO",
      titolo: "Renault Trafic 9 posti — posteriore",
      ordine: 4,
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

  console.log("OK — Renault Trafic 9 posti pubblicato su Supabase");
  console.log("Scheda: http://localhost:3000/flotta/renault-trafic-9-posti");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
