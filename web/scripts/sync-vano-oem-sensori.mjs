/**
 * Allinea vano di carico ai dati ufficiali casa madre (per configurazione L/H)
 * e sensori parcheggio verificati dalle foto posteriori.
 *
 * Uso: cd web && node scripts/sync-vano-oem-sensori.mjs
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

/**
 * Misure vano = schede tecniche OEM (lunghezza a pavimento × larghezza max × altezza max).
 * Fonte tipica: Sevel (Boxer/Jumper/Ducato), Ford Transit/Custom, Renault Master III, Iveco Daily, Jumpy/Expert, Vivaro B, Doblò Cargo.
 */
function vano(L, W, H, arches, vol) {
  return {
    vano_lunghezza_mm: L,
    vano_larghezza_mm: W,
    vano_altezza_mm: H,
    lunghezza_vano_mm: L,
    larghezza_vano_mm: W,
    altezza_vano_mm: H,
    larghezza_tra_passaruota_mm: arches,
    volume_metri_cubi: vol,
    volume_carico_mc: vol,
  };
}

/** @type {Record<string, Record<string, number|boolean|null>>} */
const BY_SLUG = {
  // ——— Sevel (Boxer / Jumper / Ducato) ———
  "peugeot-boxer-l3h3": {
    ...vano(3705, 1870, 2172, 1422, 15),
    sensori_parcheggio: true, // foto retro: sensori su paraurti
  },
  "peugeot-boxer-l2h2": {
    ...vano(3120, 1870, 1932, 1422, 11.5),
    sensori_parcheggio: true,
  },
  "citroen-jumper-l2h2": {
    ...vano(3120, 1870, 1932, 1422, 11.5),
    sensori_parcheggio: true, // foto retro FT240AN
  },
  "citroen-jumper-l1h1": {
    ...vano(2670, 1870, 1662, 1422, 8),
    sensori_parcheggio: true,
  },
  "fiat-ducato-l1h1": {
    ...vano(2670, 1870, 1662, 1422, 8),
    sensori_parcheggio: true,
  },

  // ——— Ford Transit Custom L1H1 (gen. precedente, ~6 m³) ———
  "ford-transit-custom-l1h1": {
    ...vano(2555, 1775, 1406, 1390, 6),
    sensori_parcheggio: true,
  },
  "ford-transit-custom-l1h1-ibrido": {
    ...vano(2555, 1775, 1406, 1390, 6),
    sensori_parcheggio: true,
  },

  // ——— Ford Transit grande ———
  // GG551RD: esterni 5531 → L2; volume 10 → H2 FWD OEM
  "ford-transit-l2h2": {
    ...vano(3044, 1784, 1886, 1392, 10),
    sensori_parcheggio: true,
  },
  // DV344HD Mk7 MWB (~5230): carico MWB tetto alto
  "ford-transit-l2h2": {
    ...vano(2949, 1762, 1886, 1390, 10),
    sensori_parcheggio: true, // foto retro DV344HD
  },
  // Etich. L3H2 ma volume/altezza flotta ≈ L3H3 FWD (13 m³ / ~2125)
  "ford-transit-l3h2": {
    ...vano(3494, 1784, 2125, 1392, 13),
    sensori_parcheggio: true,
  },

  // ——— Master / Movano / Interstar ———
  "renault-master-l2h2": {
    ...vano(3083, 1765, 1894, 1380, 10.8),
    sensori_parcheggio: true,
  },
  "opel-movano-l2h2": {
    ...vano(3083, 1765, 1894, 1380, 10.8),
    sensori_parcheggio: true,
  },
  // Versione L3H2: volume corretto 13 m³ (14,8 = L3H3)
  "nissan-interstar-l3h2": {
    ...vano(3733, 1765, 1894, 1380, 13),
    sensori_parcheggio: true,
  },

  // ——— Iveco Daily L2H2 (~10.8 m³) ———
  "iveco-daily-35-12": {
    ...vano(3130, 1800, 1900, 1320, 10.8),
    sensori_parcheggio: true,
  },

  // ——— Medi / piccoli ———
  "citroen-jumpy-l1h1": {
    ...vano(2512, 1636, 1397, 1258, 5.3),
    sensori_parcheggio: true,
  },
  // Doblò Cargo SWB (esterno 4406): lunghezza utile OEM 1820
  "fiat-doblo-cargo": {
    ...vano(1820, 1714, 1305, 1230, 3.4),
    sensori_parcheggio: true,
  },
  // Proace City L1 (SWB): 3.3 m³ (fino a 3.8 con Smart Cargo)
  "toyota-proace-city": {
    ...vano(1817, 1527, 1200, 1229, 3.3),
    sensori_parcheggio: false,
  },
  // Vivaro B L1H1
  "opel-vivaro": {
    ...vano(2537, 1662, 1387, 1268, 5.2),
    sensori_parcheggio: true, // foto retro FB728FR
  },

  // ——— Auto / pulmini: solo sensori (niente vano furgone) ———
  "citroen-c3": { sensori_parcheggio: true },
  "nissan-primastar-9-posti": { sensori_parcheggio: true },
  "renault-trafic-9-posti": { sensori_parcheggio: true },
  "volvo-s40": { sensori_parcheggio: true },
};

async function main() {
  const { data: veicoli, error } = await supabase
    .from("veicoli")
    .select("id,slug")
    .eq("pubblicato", true);

  if (error) throw error;

  let ok = 0;
  let skip = 0;
  for (const v of veicoli) {
    const patch = BY_SLUG[v.slug];
    if (!patch) {
      console.log("skip (no OEM map):", v.slug);
      skip++;
      continue;
    }
    const { error: upErr } = await supabase.from("veicoli").update(patch).eq("id", v.id);
    if (upErr) {
      console.error("FAIL", v.slug, upErr.message);
      continue;
    }
    const dims =
      patch.lunghezza_vano_mm != null
        ? `vano ${patch.lunghezza_vano_mm}×${patch.larghezza_vano_mm}×${patch.altezza_vano_mm} / ${patch.volume_metri_cubi} m³`
        : "solo sensori";
    console.log("OK", v.slug, dims, "sens=" + patch.sensori_parcheggio);
    ok++;
  }
  console.log(`\nDone: ${ok} updated, ${skip} skipped`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
