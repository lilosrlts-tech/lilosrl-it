/**
 * Inserisce/aggiorna Citroën C3 — categoria Auto.
 * Uso: cd web && node scripts/seed-citroen-c3.mjs
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

const SLUG = "citroen-c3";

const HIGHLIGHTS = [
  "🚗 City-Car Compatta e Moderna: Design iconico, dimensioni ideali per muoversi e parcheggiare agevolmente nel centro di Trieste.",
  "⛽ Consumi Ridotti ed Efficienza: Motorizzazione brillante e dai consumi contenuti, perfetta per spostamenti urbani ed extraurbani.",
  "🛋️ Comfort di Bordo Advanced Comfort: Sedili accoglienti, plancia intuitiva e guida riposante anche su lunghi tragitti.",
  "📍 Ritiro e Consegna in Sede: Presso la sede LILO S.r.l. di Viale Campi Elisi 38/b a Trieste.",
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
    targa: "C3-ND-01",
    marca: "Citroën",
    modello: "C3",
    versione: "Utilitaria",
    anno_immatricolazione: 2019,
    colore: "Grigio metallizzato",
    alimentazione: "Benzina",
    cambio: "Manuale",
    posti: 5,
    porte: 5,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 2,
    titolo_pubblico: "Citroën C3 — Noleggio auto utilitaria Trieste",
    sottotitolo: "City-car compatta, moderna e comoda per Trieste e dintorni",
    descrizione_breve:
      "Noleggio Citroën C3 a Trieste: utilitaria grigio metallizzato, ideale per città e spostamenti quotidiani. Ritiro in Viale Campi Elisi 38/b.",
    descrizione_completa:
      "La Citroën C3 è la city-car utilitaria di LILO S.r.l.: design iconico, dimensioni ideali per muoversi e parcheggiare nel centro di Trieste, consumi contenuti e comfort Advanced Comfort con sedili accoglienti e plancia intuitiva. Perfetta per spostamenti urbani ed extraurbani. Ritiro e riconsegna presso la sede di Viale Campi Elisi 38/b a Trieste.",
    seo_title: "Noleggio Citroën C3 Trieste | Auto Utilitaria | LILO Autonoleggio",
    seo_description:
      "Noleggia la Citroën C3 a Trieste (Viale Campi Elisi 38/b). City-car compatta, consumi ridotti e comfort Advanced Comfort. LILO Autonoleggio.",
    ai_summary:
      "Citroën C3 — utilitaria city-car a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b.",
    ai_highlights: HIGHLIGHTS,
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
    og_image_url: "/images/veicoli/citroen-c3-grigia-trieste.webp",
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
        importo: 40,
        descrizione: "100 km inclusi / Assicurazione base",
        attivo: true,
      })
      .eq("id", prezzoExists.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("prezzi").insert({
      veicolo_id: veicoloId,
      tipo_tariffa: "giornaliero",
      importo: 40,
      descrizione: "100 km inclusi / Assicurazione base",
      attivo: true,
    });
    if (error) throw error;
  }

  const foto = [
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/citroen-c3-grigia-trieste.webp",
      url_pubblico: "/images/veicoli/citroen-c3-grigia-trieste.webp",
      alt_text:
        "Noleggio autovettura Citroën C3 grigio metallizzato a Trieste presso LILO Autonoleggio in Viale Campi Elisi 38/b",
      titolo: "Citroën C3 noleggio auto Trieste",
      ordine: 0,
      is_copertina: true,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/citroen-c3-grigia-retro.webp",
      url_pubblico: "/images/veicoli/citroen-c3-grigia-retro.webp",
      alt_text:
        "Vista laterale e posteriore Citroën C3 per noleggio a breve e medio termine a Trieste",
      titolo: "Noleggio Citroën C3 utilitaria Trieste",
      ordine: 1,
      is_copertina: false,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/citroen-c3-interni-guida.webp",
      url_pubblico: "/images/veicoli/citroen-c3-interni-guida.webp",
      alt_text: "Posto di guida moderno e plancia ergonomica Citroën C3",
      titolo: "Interni e posto guida Citroën C3",
      ordine: 2,
      is_copertina: false,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/citroen-c3-interni-posteriori.webp",
      url_pubblico: "/images/veicoli/citroen-c3-interni-posteriori.webp",
      alt_text: "Sedili posteriori confortevoli e abitacolo spazioso Citroën C3",
      titolo: "Abitacolo e sedili posteriori Citroën C3",
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

  console.log("OK — Citroën C3 pubblicato su Supabase");
  console.log("Scheda: http://localhost:3000/flotta/citroen-c3");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
