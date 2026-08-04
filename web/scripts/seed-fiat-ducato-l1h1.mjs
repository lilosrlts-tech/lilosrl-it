/**
 * Inserisce/aggiorna il Fiat Ducato L1H1 (FG289KB) su Supabase.
 * Uso: cd web && node scripts/seed-fiat-ducato-l1h1.mjs
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

const SLUG = "fiat-ducato-l1h1";

const HIGHLIGHTS = [
  "Rampa di carico moto: Dotato di rampa rinforzata in alluminio antiscivolo per il carico/scarico agevole e sicuro di motocicli.",
  "Rivestimento lavabile idoneo HACCP: Vano interno completamente rivestito con materiali lavabili e igienizzabili, conforme alle normative HACCP per il trasporto alimentare, catering e merci fresche.",
  "Vano ottimizzato: Fondo rinforzato e passaruota protetti per massima versatilità tra merci, moto e alimenti.",
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
    targa: "FG289KB",
    marca: "Fiat",
    modello: "Ducato",
    versione: "L1H1",
    anno_immatricolazione: 2018,
    colore: "Bianco",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    porte: 4,
    slug: SLUG,
    pubblicato: true,
    attivo: true,
    ordine: 3,
    titolo_pubblico: "Fiat Ducato L1H1 — Furgone grande Trieste",
    sottotitolo: "Con rampa moto e vano lavabile HACCP",
    descrizione_breve:
      "Noleggio Fiat Ducato L1H1 a Trieste: rampa di carico moto in alluminio, rivestimento interno lavabile idoneo HACCP e vano ottimizzato. Targa FG289KB.",
    descrizione_completa:
      "Il Fiat Ducato L1H1 (targa FG289KB) è un furgone grande ideale per chi deve caricare moto, attrezzature o merci alimentari. È dotato di rampa di carico rinforzata in alluminio antiscivolo, vano interno completamente rivestito con materiali lavabili e igienizzabili conformi alle normative HACCP, fondo rinforzato e passaruota protetti. Disponibile presso LILO S.r.l. a Trieste, Viale Campi Elisi 38/B.",
    seo_title: "Noleggio Fiat Ducato L1H1 Trieste | Rampa moto e HACCP | LILO",
    seo_description:
      "Noleggia il Fiat Ducato L1H1 a Trieste con rampa di carico moto e rivestimento lavabile HACCP. Ritiro in sede LILO S.r.l.",
    ai_summary:
      "Fiat Ducato L1H1 con rampa moto e vano lavabile HACCP — noleggio a Trieste presso LILO S.r.l. Targa FG289KB.",
    ai_highlights: HIGHLIGHTS,
    ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
    volume_metri_cubi: 8,
    portata_utile_kg: 1100,
    volume_carico_mc: 8,
    portata_kg: 1100,
    trazione: "Anteriore",
    passo: "Corto",
    tetto: "Basso",
    sensori_parcheggio: true,
    og_image_url: "/images/veicoli/fiat-ducato-l1h1-noleggio-trieste.webp",
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
        importo: 60,
        descrizione: "100 km inclusi / Assicurazione base",
        attivo: true,
      })
      .eq("id", prezzoExists.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("prezzi").insert({
      veicolo_id: veicoloId,
      tipo_tariffa: "giornaliero",
      importo: 60,
      descrizione: "100 km inclusi / Assicurazione base",
      attivo: true,
    });
    if (error) throw error;
  }

  const foto = [
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/fiat-ducato-l1h1-noleggio-trieste.webp",
      url_pubblico: "/images/veicoli/fiat-ducato-l1h1-noleggio-trieste.webp",
      alt_text: "Noleggio Fiat Ducato L1H1 Trieste — esterno principale LILO S.r.l.",
      titolo: "Esterno principale",
      ordine: 0,
      is_copertina: true,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/fiat-ducato-l1h1-rampa-moto-haccp.webp",
      url_pubblico: "/images/veicoli/fiat-ducato-l1h1-rampa-moto-haccp.webp",
      alt_text:
        "Fiat Ducato L1H1 con rampa di carico per moto e lavabile per trasporto alimentari HACCP",
      titolo: "Noleggio furgone Fiat Ducato L1H1 con rampa moto e idoneità HACCP Trieste",
      didascalia: "Rampa alluminio antiscivolo e vano rivestito HACCP",
      ordine: 1,
      is_copertina: false,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/fiat-ducato-l1h1-posteriore-noleggio-trieste.webp",
      url_pubblico: "/images/veicoli/fiat-ducato-l1h1-posteriore-noleggio-trieste.webp",
      alt_text: "Fiat Ducato L1H1 posteriore — noleggio furgone grande Trieste LILO",
      titolo: "Vista posteriore",
      ordine: 2,
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

  console.log("OK — Fiat Ducato L1H1 pubblicato su Supabase");
  console.log("Scheda: http://localhost:3000/flotta/fiat-ducato-l1h1");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
