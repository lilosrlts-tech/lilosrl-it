/**
 * Inserisce/aggiorna Volvo S40 — categoria Auto.
 * Uso: cd web && node scripts/seed-volvo-s40.mjs
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

const SLUG = "volvo-s40";

const HIGHLIGHTS = [
  "Eleganza e Comfort: Berlina premium ideale per viaggi di lavoro, cerimonie o spostamenti a lungo raggio nel massimo relax.",
  "Sicurezza Volvo: Dotata dei rinomati sistemi di sicurezza attiva e passiva del marchio svedese.",
  "Interni Curati: Salotto di bordo accogliente con consolle centrale ultra-sottile e sedili ad altissimo livello di ergonomia.",
  "Ritiro in Sede: Disponibile per il ritiro immediato presso LILO Autonoleggio in Viale Campi Elisi 38/b a Trieste.",
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

  const veicoloPayload = {
    categoria_id: categoria.id,
    targa: "VS40TS",
    marca: "Volvo",
    modello: "S40",
    versione: "Berlina",
    anno_immatricolazione: 2011,
    colore: "Nero",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 5,
    porte: 4,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 1,
    titolo_pubblico: "Volvo S40 — Noleggio berlina Trieste",
    sottotitolo: "Eleganza, comfort e sicurezza per lavoro e turismo",
    descrizione_breve:
      "Noleggio Volvo S40 a Trieste: berlina premium nera, ideali per viaggi d'affari e turismo. Ritiro in Viale Campi Elisi 38/b.",
    descrizione_completa:
      "La Volvo S40 è la berlina premium di LILO Autonoleggio a Trieste: elegante e confortevole per viaggi di lavoro, cerimonie o spostamenti a lungo raggio. Offre i rinomati sistemi di sicurezza Volvo, interni curati con consolle centrale ultra-sottile e sedili ergonomici. Ritiro immediato presso la sede di Viale Campi Elisi 38/b.",
    seo_title: "Noleggio Volvo S40 Trieste | Berlina Premium | LILO",
    seo_description:
      "Noleggia la Volvo S40 a Trieste (Viale Campi Elisi 38/b). Berlina elegante per lavoro e turismo. LILO Autonoleggio.",
    ai_summary:
      "Volvo S40 — berlina premium a noleggio a Trieste presso LILO Autonoleggio, Viale Campi Elisi 38/b.",
    ai_highlights: HIGHLIGHTS,
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
    capacita_bagagliaio_valigie: 3,
    classe_ambientale: "Euro 5",
    connessione_smartphone: null,
    trazione: "Anteriore",
    sensori_parcheggio: true,
    og_image_url: "/images/veicoli/volvo-s40-noleggio-trieste.webp",
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
        importo: 45,
        descrizione: "100 km inclusi / Assicurazione base",
        attivo: true,
      })
      .eq("id", prezzoExists.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("prezzi").insert({
      veicolo_id: veicoloId,
      tipo_tariffa: "giornaliero",
      importo: 45,
      descrizione: "100 km inclusi / Assicurazione base",
      attivo: true,
    });
    if (error) throw error;
  }

  const foto = [
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/volvo-s40-noleggio-trieste.webp",
      url_pubblico: "/images/veicoli/volvo-s40-noleggio-trieste.webp",
      alt_text:
        "Noleggio berlina Volvo S40 nera a Trieste presso LILO Autonoleggio in Viale Campi Elisi 38/b",
      titolo: "Volvo S40 noleggio auto Trieste Viale Campi Elisi",
      ordine: 0,
      is_copertina: true,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/volvo-s40-retro-trieste.webp",
      url_pubblico: "/images/veicoli/volvo-s40-retro-trieste.webp",
      alt_text:
        "Vista posteriore Volvo S40 elegante ideale per viaggi d'affari e turismo a Trieste",
      titolo: "Noleggio Volvo S40 berlina Trieste",
      ordine: 1,
      is_copertina: false,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/volvo-s40-interni-guida.webp",
      url_pubblico: "/images/veicoli/volvo-s40-interni-guida.webp",
      alt_text: "Posto guida ed eleganti interni con consolle fluttuante Volvo S40",
      titolo: "Interni e plancia Volvo S40",
      ordine: 2,
      is_copertina: false,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/volvo-s40-sedili-posteriori.webp",
      url_pubblico: "/images/veicoli/volvo-s40-sedili-posteriori.webp",
      alt_text: "Sedili posteriori confortevoli ed eleganti per passeggeri Volvo S40",
      titolo: "Comfort passeggeri Volvo S40",
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

  console.log("OK — Volvo S40 pubblicata su Supabase");
  console.log("Scheda: http://localhost:3000/flotta/volvo-s40");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
