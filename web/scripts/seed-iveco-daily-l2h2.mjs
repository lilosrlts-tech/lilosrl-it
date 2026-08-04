/**
 * Aggiorna Iveco Daily L2H2 (EV840AM) — Furgoni Grandi (Uso Città).
 * Libretto: misure esterne + portata; vano = casa madre L2H2.
 * Foto: sempre WebP.
 * Uso: cd web && node scripts/seed-iveco-daily-l2h2.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(
  readFileSync(join(__dirname, "..", "..", "supabase", "CREDENZIALI.env"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const SLUG = "iveco-daily-35-12";
const ALT =
  "Noleggio Furgone Grande Uso Città Iveco Daily L2H2 a Trieste - Lilo SRL";

const FRONT = "/images/flotta/furgone-grande-iveco-daily-l2h2-trieste-front.webp";
const REAR = "/images/flotta/furgone-grande-iveco-daily-l2h2-trieste-rear.webp";

const HIGHLIGHTS = [
  "Categoria Grande / Uso Città: Daily L2H2 manovrabile in città con vano ~10,8 m³.",
  "Libretto EV840AM: portata utile 1420 kg, lunghezza esterna 5401 mm.",
  "Vano casa madre L2H2: 3130 × 1800 × 1900 mm (~10,8 m³).",
  "Ritiro in sede: Viale Campi Elisi 38/b, Trieste.",
];

async function main() {
  const { data: categoria, error: catErr } = await supabase
    .from("categorie")
    .select("id")
    .eq("slug", "furgoni-grandi-citta")
    .single();
  if (catErr || !categoria) {
    throw new Error(`Categoria furgoni-grandi-citta non trovata: ${catErr?.message}`);
  }

  const { data: v, error } = await supabase
    .from("veicoli")
    .select("id")
    .eq("slug", SLUG)
    .single();
  if (error || !v) throw error || new Error("veicolo non trovato");

  const veicoloId = v.id;

  // Libretto EV840AM (01.10.2014): 35S13, L 5,401 m, l 1,996 m, portata 1420 kg (F.2 3500 − G 2080)
  // Vano OEM Daily L2H2: 3130 × 1800 × 1900, 10.8 m³
  const { error: upErr } = await supabase
    .from("veicoli")
    .update({
      categoria_id: categoria.id,
      targa: "EV840AM",
      marca: "Iveco",
      modello: "Daily",
      versione: "L2H2 / 35S13",
      anno_immatricolazione: 2014,
      colore: "Bianco",
      alimentazione: "Diesel",
      cambio: "Manuale",
      posti: 3,
      porte: 4,
      titolo_pubblico: "Iveco Daily L2H2 — Furgone grande uso città Trieste",
      sottotitolo: "Passo medio, tetto alto: ~10,8 m³ con manovrabilità urbana",
      descrizione_breve:
        "Noleggio Iveco Daily L2H2 a Trieste: furgone grande uso città (~10,8 m³), portata 1420 kg. Ritiro in Viale Campi Elisi 38/b. Targa EV840AM.",
      descrizione_completa:
        "L'Iveco Daily L2H2 35S13 (targa EV840AM) è il furgone grande uso città di LILO S.r.l.: passo medio e tetto alto con vano di carico circa 10,8 m³ (casa madre 3130 × 1800 × 1900 mm), ideale per traslochi urbani e trasporto merci a Trieste. Dati libretto: lunghezza 5401 mm, larghezza 1996 mm, portata utile 1420 kg. Ritiro e riconsegna presso Viale Campi Elisi 38/b.",
      seo_title: "Noleggio Iveco Daily L2H2 Trieste | Furgoni Grandi Città | LILO",
      seo_description:
        "Noleggia l'Iveco Daily L2H2 a Trieste (Viale Campi Elisi 38/b). Furgone grande uso città ~10,8 m³, portata 1420 kg. LILO Autonoleggio.",
      ai_summary:
        "Iveco Daily L2H2 35S13 — furgone grande uso città (~10,8 m³, portata 1420 kg) a noleggio a Trieste presso LILO S.r.l. Targa EV840AM.",
      ai_highlights: HIGHLIGHTS,
      ai_context: "Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.",
      passo: "Medio",
      tetto: "Alto",
      sensori_parcheggio: true,
      trazione: "Posteriore",
      volume_metri_cubi: 10.8,
      volume_carico_mc: 10.8,
      vano_lunghezza_mm: 3130,
      vano_larghezza_mm: 1800,
      vano_altezza_mm: 1900,
      lunghezza_vano_mm: 3130,
      larghezza_vano_mm: 1800,
      altezza_vano_mm: 1900,
      larghezza_tra_passaruota_mm: 1320,
      portata_utile_kg: 1420,
      portata_kg: 1420,
      lunghezza_mm: 5401,
      larghezza_mm: 1996,
      og_image_url: FRONT,
      pubblicato: true,
      attivo: true,
    })
    .eq("id", veicoloId);
  if (upErr) throw upErr;

  const { data: prezzoExists } = await supabase
    .from("prezzi")
    .select("id")
    .eq("veicolo_id", veicoloId)
    .eq("tipo_tariffa", "giornaliero")
    .maybeSingle();

  const prezzoPayload = {
    veicolo_id: veicoloId,
    tipo_tariffa: "giornaliero",
    importo: 55,
    valuta: "EUR",
    descrizione: "50 km inclusi / Assicurazione base — uso città",
  };

  if (prezzoExists?.id) {
    const { error: pErr } = await supabase
      .from("prezzi")
      .update(prezzoPayload)
      .eq("id", prezzoExists.id);
    if (pErr) throw pErr;
  } else {
    const { error: pErr } = await supabase.from("prezzi").insert(prezzoPayload);
    if (pErr) throw pErr;
  }

  await supabase.from("foto").update({ is_copertina: false }).eq("veicolo_id", veicoloId);

  const { data: existingFoto } = await supabase
    .from("foto")
    .select("id,url_pubblico,storage_path")
    .eq("veicolo_id", veicoloId);

  const foto = [
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/furgone-grande-iveco-daily-l2h2-trieste-front.webp",
      url_pubblico: FRONT,
      alt_text: ALT,
      titolo: "Iveco Daily L2H2 noleggio furgoni grandi uso città Trieste — frontale",
      ordine: 0,
      is_copertina: true,
    },
    {
      veicolo_id: veicoloId,
      storage_bucket: "veicoli",
      storage_path: "local/furgone-grande-iveco-daily-l2h2-trieste-rear.webp",
      url_pubblico: REAR,
      alt_text: ALT,
      titolo: "Iveco Daily L2H2 noleggio furgoni grandi uso città Trieste — posteriore",
      ordine: 1,
      is_copertina: false,
    },
  ];

  const usedIds = new Set();
  for (const f of foto) {
    const base = f.storage_path.replace(/\.webp$/, "");
    const found = (existingFoto || []).find((row) => {
      const p = row.storage_path || "";
      const u = row.url_pubblico || "";
      return (
        p.includes("iveco-daily-l2h2-trieste-front") && f.ordine === 0 ||
        p.includes("iveco-daily-l2h2-trieste-rear") && f.ordine === 1 ||
        u.includes("iveco-daily-l2h2-trieste-front") && f.ordine === 0 ||
        u.includes("iveco-daily-l2h2-trieste-rear") && f.ordine === 1
      );
    });

    if (found?.id) {
      usedIds.add(found.id);
      const { error: e } = await supabase.from("foto").update(f).eq("id", found.id);
      if (e) throw e;
    } else {
      const { data: inserted, error: e } = await supabase.from("foto").insert(f).select("id").single();
      if (e) throw e;
      if (inserted?.id) usedIds.add(inserted.id);
    }
  }

  for (const r of existingFoto || []) {
    if (usedIds.has(r.id)) continue;
    const url = r.url_pubblico || "";
    const path = r.storage_path || "";
    if (
      url.includes("wp-content") ||
      url.includes("iveco-daily-l2h2") ||
      path.includes("iveco-daily-l2h2")
    ) {
      await supabase.from("foto").delete().eq("id", r.id);
      console.log("deleted stale foto", r.id, url || path);
    }
  }

  console.log("OK — Iveco Daily L2H2 → furgoni-grandi-citta (libretto + vano OEM + webp)");
  console.log("Scheda: http://localhost:3000/flotta/iveco-daily-35-12");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
