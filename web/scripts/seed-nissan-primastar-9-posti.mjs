/**
 * Inserisce/aggiorna Nissan Primastar 9 posti (GK420DW) — Pulmini 9 posti.
 * Uso: cd web && node scripts/seed-nissan-primastar-9-posti.mjs
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

const SLUG = "nissan-primastar-9-posti";

const HIGHLIGHTS = [
  "👥 9 Posti Full-Comfort: Spazio abbondante per tutti i passeggeri, ideale per trasferte aziendali, gruppi sportivi o vacanze in famiglia.",
  "🧳 Vano Bagagli Capiente: Ampio volume di carico posteriore per valigie ingombranti e attrezzature sportive.",
  "🛡️ Tecnologia e Sicurezza Nissan: Posizione di guida rialzata, visibilità ottima e moderni sistemi di assistenza alla guida.",
  "🧼 Sanificazione Garantita: Interni igienizzati a fondo prima di ogni consegna per la massima sicurezza dei passeggeri.",
  "📍 Ritiro in Sede: Disponibile presso la sede LILO Autonoleggio di Viale Campi Elisi 38/b a Trieste.",
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
    targa: "GK420DW",
    marca: "Nissan",
    modello: "Primastar",
    versione: "9 posti Combi",
    anno_immatricolazione: 2018,
    colore: "Grigio metallizzato",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 9,
    porte: 5,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 2,
    titolo_pubblico: "Nissan Primastar 9 posti — Pulmino Trieste",
    sottotitolo: "Combi 9 posti per gruppi, trasferte e vacanze in famiglia",
    descrizione_breve:
      "Noleggio Nissan Primastar 9 posti a Trieste: pulmino Combi grigio metallizzato, vano bagagli capiente. Ritiro in Viale Campi Elisi 38/b. Targa GK420DW.",
    descrizione_completa:
      "Il Nissan Primastar 9 posti Combi (targa GK420DW) è il pulmino LILO S.r.l. per trasporto persone: spazio full-comfort per trasferte aziendali, gruppi sportivi e vacanze in famiglia, con vano bagagli capiente per valigie e attrezzature. Posizione di guida rialzata e interni sanificati prima di ogni consegna. Ritiro e riconsegna presso la sede di Viale Campi Elisi 38/b a Trieste.",
    seo_title: "Noleggio Nissan Primastar 9 posti Trieste | Pulmini | LILO",
    seo_description:
      "Noleggia il Nissan Primastar 9 posti a Trieste (Viale Campi Elisi 38/b). Pulmino Combi per gruppi e vacanze. LILO Autonoleggio.",
    ai_summary:
      "Nissan Primastar 9 posti Combi — pulmino a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b. Targa GK420DW.",
    ai_highlights: HIGHLIGHTS,
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste. Cauzione solo con carta.",
    og_image_url: "/images/veicoli/nissan-primastar-9-posti-frontale.webp",
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
        importo: 90,
        descrizione: "150 km inclusi / Assicurazione base — cauzione solo carta",
        attivo: true,
      })
      .eq("id", prezzoExists.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("prezzi").insert({
      veicolo_id: veicoloId,
      tipo_tariffa: "giornaliero",
      importo: 90,
      descrizione: "150 km inclusi / Assicurazione base — cauzione solo carta",
      attivo: true,
    });
    if (error) throw error;
  }

  const foto = [
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/nissan-primastar-9-posti-frontale.webp",
      url_pubblico: "/images/veicoli/nissan-primastar-9-posti-frontale.webp",
      alt_text:
        "Noleggio pulmino 9 posti Nissan Primastar grigio metallizzato a Trieste presso LILO Autonoleggio in Viale Campi Elisi 38/b",
      titolo: "Nissan Primastar 9 posti noleggio pulmino Trieste",
      ordine: 0,
      is_copertina: true,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/nissan-primastar-9-posti-retro.webp",
      url_pubblico: "/images/veicoli/nissan-primastar-9-posti-retro.webp",
      alt_text:
        "Vista laterale e posteriore Nissan Primastar Combi 9 posti per viaggi di gruppo e vacanze a Trieste",
      titolo: "Noleggio Nissan Primastar Combi Trieste",
      ordine: 1,
      is_copertina: false,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/nissan-primastar-9-posti-guida.webp",
      url_pubblico: "/images/veicoli/nissan-primastar-9-posti-guida.webp",
      alt_text: "Posto di guida moderno, plancia ed ergonomia Nissan Primastar 9 posti",
      titolo: "Plancia e posto guida Nissan Primastar",
      ordine: 2,
      is_copertina: false,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/nissan-primastar-9-posti-interni.webp",
      url_pubblico: "/images/veicoli/nissan-primastar-9-posti-interni.webp",
      alt_text: "Abitacolo spazioso e configurazione sedili passeggeri Nissan Primastar 9 posti",
      titolo: "Interni comodi passeggeri Nissan Primastar 9 posti",
      ordine: 3,
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

  console.log("OK — Nissan Primastar 9 posti pubblicato su Supabase");
  console.log("Scheda: http://localhost:3000/flotta/nissan-primastar-9-posti");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
