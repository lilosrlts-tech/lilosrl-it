/**
 * Allinea portata utile, misure e anagrafica ai libretti di circolazione.
 * Uso: cd web && node scripts/sync-libretti-dati.mjs
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

/** Dati estratti dai libretti (scansioni). Volume carico NON è sul libretto → non toccato. */
const BY_SLUG = {
  "peugeot-boxer-l3h3": {
    targa: "GB762PM",
    marca: "Peugeot",
    modello: "Boxer",
    versione: "L3H3",
    anno_immatricolazione: 2020,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    porte: 4,
    colore: "Bianco",
    portata_utile_kg: 1395,
    portata_kg: 1395,
    lunghezza_mm: 5998,
    larghezza_mm: 2050,
  },
  "citroen-jumpy-l1h1": {
    targa: "FR523SW",
    marca: "Citroën",
    modello: "Jumpy",
    versione: "L1 H1",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    portata_utile_kg: 1043,
    portata_kg: 1043,
    lunghezza_mm: 4959,
    larghezza_mm: 1920,
  },
  "fiat-doblo-cargo": {
    targa: "GH618PT",
    marca: "Fiat",
    modello: "Doblò",
    versione: "Cargo",
    anno_immatricolazione: 2021,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 2,
    portata_utile_kg: 586,
    portata_kg: 586,
    lunghezza_mm: 4406,
    larghezza_mm: 1832,
  },
  "fiat-doblo": {
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
    portata_utile_kg: 705,
    portata_kg: 705,
    lunghezza_mm: 4406,
    larghezza_mm: 1832,
  },
  "toyota-proace-city": {
    targa: "GJ996JJ",
    marca: "Toyota",
    modello: "Proace City",
    versione: "L1 / Van",
    anno_immatricolazione: 2022,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 2,
    porte: 4,
    colore: "Bianco",
    portata_utile_kg: 583,
    portata_kg: 583,
    lunghezza_mm: 4403,
    larghezza_mm: 1848,
  },
  "fiat-ducato-l1h1": {
    targa: "FG289KB",
    marca: "Fiat",
    modello: "Ducato",
    versione: "L1H1",
    anno_immatricolazione: 2017,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    portata_utile_kg: 640,
    portata_kg: 640,
    lunghezza_mm: 4963,
    larghezza_mm: 2050,
  },
  "ford-transit-l2h2": {
    targa: "DV344HD",
    marca: "Ford",
    modello: "Transit",
    versione: "L2H2 / 350M",
    anno_immatricolazione: 2009,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    portata_utile_kg: 1600,
    portata_kg: 1600,
    lunghezza_mm: 5230,
    larghezza_mm: 1974,
  },
  "citroen-jumper-l1h1": {
    targa: "ES772TN",
    marca: "Citroën",
    modello: "Jumper",
    versione: "L1H1",
    anno_immatricolazione: 2013,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    portata_utile_kg: 880,
    portata_kg: 880,
    lunghezza_mm: 4963,
    larghezza_mm: 2050,
  },
  "ford-transit-custom-l1h1-ibrido": {
    targa: "GJ446AK",
    marca: "Ford",
    modello: "Transit Custom",
    versione: "L1 H1",
    alimentazione: "Ibrido Diesel/Elettrico",
    cambio: "Manuale",
    posti: 3,
    portata_utile_kg: 735,
    portata_kg: 735,
    lunghezza_mm: 4972,
    larghezza_mm: 2032,
  },
  "ford-transit-l2h2": {
    targa: "GG551RD",
    marca: "Ford",
    modello: "Transit",
    versione: "L2H2",
    anno_immatricolazione: 2021,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    portata_utile_kg: 1166,
    portata_kg: 1166,
    lunghezza_mm: 5531,
    larghezza_mm: 2059,
    altezza_mm: 2470,
    titolo_pubblico: "Ford Transit L2H2 — Furgone grande Trieste",
    sottotitolo: "Ideale per traslochi e trasporto merci",
  },
  "ford-transit-l3h2": {
    targa: "FT407CY",
    marca: "Ford",
    modello: "Transit",
    versione: "L3H2",
    anno_immatricolazione: 2018,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    portata_utile_kg: 1230,
    portata_kg: 1230,
    lunghezza_mm: 5981,
    larghezza_mm: 2059,
    titolo_pubblico: "Ford Transit L3H2 — Furgone XL Trieste",
    sottotitolo: "Passo lungo, gran volume per traslochi e carichi massimi",
  },
  "peugeot-boxer-l2h2": {
    targa: "EW858WC",
    marca: "Peugeot",
    modello: "Boxer",
    versione: "L2H2",
    anno_immatricolazione: 2014,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    portata_utile_kg: 1315,
    portata_kg: 1315,
    lunghezza_mm: 5413,
    larghezza_mm: 2050,
  },
  "renault-master-l2h2": {
    targa: "GF883SB",
    marca: "Renault",
    modello: "Master",
    versione: "L2H2",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    portata_utile_kg: 1451,
    portata_kg: 1451,
    lunghezza_mm: 5548,
    larghezza_mm: 2070,
  },
  "nissan-interstar-l3h2": {
    targa: "GT436ZP",
    marca: "Nissan",
    modello: "Interstar",
    versione: "L3H2",
    anno_immatricolazione: 2024,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    portata_utile_kg: 1353,
    portata_kg: 1353,
    lunghezza_mm: 6198,
    larghezza_mm: 2070,
  },
  "nissan-primastar-9-posti": {
    targa: "GK420DW",
    marca: "Nissan",
    modello: "Primastar",
    versione: "9 posti Combi",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 9,
    porte: 5,
    portata_utile_kg: 1057,
    portata_kg: 1057,
    lunghezza_mm: 5080,
    larghezza_mm: 1956,
    passo: "Normale",
  },
  "opel-movano-l2h2": {
    targa: "GC328PK",
    marca: "Opel",
    modello: "Movano",
    versione: "F 3500",
    anno_immatricolazione: 2020,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    portata_utile_kg: 1454,
    portata_kg: 1454,
    lunghezza_mm: 5548,
    larghezza_mm: 2070,
  },
  "renault-master-l2h3": {
    targa: "GG290XM",
    marca: "Renault",
    modello: "Master",
    anno_immatricolazione: 2022,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    portata_utile_kg: 1251,
    portata_kg: 1251,
    lunghezza_mm: 5548,
    larghezza_mm: 2070,
  },
  "renault-trafic-9-posti": {
    targa: "GL555VT",
    marca: "Renault",
    modello: "Trafic",
    versione: "9 posti",
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 9,
    porte: 5,
    portata_utile_kg: 1057,
    portata_kg: 1057,
    lunghezza_mm: 5080,
    larghezza_mm: 1956,
    passo: "Normale",
  },
  "citroen-jumper-l2h2": {
    targa: "FT240AN",
    marca: "Citroën",
    modello: "Jumper",
    versione: "L2H2",
    anno_immatricolazione: 2018,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    portata_utile_kg: 1300,
    portata_kg: 1300,
    lunghezza_mm: 5413,
    larghezza_mm: 2050,
  },
  "opel-vivaro": {
    targa: "FB728FR",
    marca: "Opel",
    modello: "Vivaro",
    versione: "Van",
    anno_immatricolazione: 2015,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    portata_utile_kg: 1000,
    portata_kg: 1000,
    lunghezza_mm: 4999,
    larghezza_mm: 1956,
  },
  "iveco-daily-35-12": {
    targa: "EV840AM",
    marca: "Iveco",
    modello: "Daily",
    versione: "L2H2 / 35S13",
    anno_immatricolazione: 2014,
    alimentazione: "Diesel",
    cambio: "Manuale",
    posti: 3,
    porte: 4,
    colore: "Bianco",
    portata_utile_kg: 1420,
    portata_kg: 1420,
    lunghezza_mm: 5401,
    larghezza_mm: 1996,
  },
  "opel-karl": {
    targa: "FX170RW",
    marca: "Opel",
    modello: "Karl",
    versione: "Rocks",
    anno_immatricolazione: 2019,
    alimentazione: "Benzina",
    cambio: "Manuale",
    posti: 5,
    porte: 5,
    classe_ambientale: "Euro 6d-TEMP",
    lunghezza_mm: 3676,
    larghezza_mm: 1632,
  },
  "volkswagen-polo": {
    targa: "FW152KR",
    marca: "Volkswagen",
    modello: "Polo",
    versione: "1.0 59 kW",
    anno_immatricolazione: 2019,
    colore: "Rosso",
    alimentazione: "Benzina",
    cambio: "Manuale",
    posti: 5,
    porte: 5,
    lunghezza_mm: 4053,
    larghezza_mm: 1751,
  },
};

async function main() {
  const results = [];
  for (const [slug, patch] of Object.entries(BY_SLUG)) {
    const { data: existing, error: findErr } = await supabase
      .from("veicoli")
      .select("id,targa,portata_utile_kg,portata_kg,lunghezza_mm,posti")
      .eq("slug", slug)
      .maybeSingle();
    if (findErr) throw findErr;
    if (!existing) {
      results.push({ slug, status: "MISSING" });
      continue;
    }

    const { error } = await supabase.from("veicoli").update(patch).eq("id", existing.id);
    if (error) {
      results.push({ slug, status: "ERROR", message: error.message });
      continue;
    }
    results.push({
      slug,
      status: "OK",
      before: {
        targa: existing.targa,
        portata: existing.portata_utile_kg ?? existing.portata_kg,
        L: existing.lunghezza_mm,
        posti: existing.posti,
      },
      after: {
        targa: patch.targa,
        portata: patch.portata_utile_kg,
        L: patch.lunghezza_mm,
        posti: patch.posti,
      },
    });
  }

  for (const r of results) {
    if (r.status === "OK") {
      console.log(
        `OK ${r.slug}: targa ${r.before.targa}→${r.after.targa} | portata ${r.before.portata}→${r.after.portata} kg | L ${r.before.L}→${r.after.L} | posti ${r.before.posti}→${r.after.posti}`,
      );
    } else {
      console.log(r.status, r.slug, r.message || "");
    }
  }
  console.log(`Done: ${results.filter((r) => r.status === "OK").length}/${results.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
