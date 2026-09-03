/**
 * Specifiche tecniche per targa.
 * Esterni / portata: libretti di circolazione.
 * Vano interno L×W×H e volume: schede tecniche casa madre per configurazione (L/H).
 */
import type { SpecificheTecniche } from "@/types/veicolo";

export interface FleetVehicleSpecRecord {
  slug: string;
  targa: string;
  marca: string;
  modello: string;
  versione: string;
  anno_immatricolazione: number | null;
  lunghezza_mm: number;
  larghezza_mm: number;
  altezza_mm: number | null;
  lunghezza_vano_mm: number | null;
  larghezza_vano_mm: number | null;
  altezza_vano_mm: number | null;
  volume_metri_cubi: number | null;
  portata_utile_kg: number;
  posti: number;
  alimentazione: string;
}

export const FLEET_SPECS_BY_TARGA: Record<string, FleetVehicleSpecRecord> = {
  GB762PM: {
    slug: "peugeot-boxer-l3h3",
    targa: "GB762PM",
    marca: "Peugeot",
    modello: "Boxer",
    versione: "L3H3",
    anno_immatricolazione: 2020,
    lunghezza_mm: 5998,
    larghezza_mm: 2050,
    altezza_mm: null,
    lunghezza_vano_mm: 3705,
    larghezza_vano_mm: 1870,
    altezza_vano_mm: 2172,
    volume_metri_cubi: 15,
    portata_utile_kg: 1395,
    posti: 3,
    alimentazione: "Diesel",
  },
  FR523SW: {
    slug: "citroen-jumpy-l1h1",
    targa: "FR523SW",
    marca: "Citroën",
    modello: "Jumpy",
    versione: "L1 H1",
    anno_immatricolazione: null,
    lunghezza_mm: 4959,
    larghezza_mm: 1920,
    altezza_mm: null,
    lunghezza_vano_mm: 2512,
    larghezza_vano_mm: 1636,
    altezza_vano_mm: 1397,
    volume_metri_cubi: 5.3,
    portata_utile_kg: 1043,
    posti: 3,
    alimentazione: "Diesel",
  },
  GH618PT: {
    slug: "fiat-doblo-cargo",
    targa: "GH618PT",
    marca: "Fiat",
    modello: "Doblò",
    versione: "Cargo",
    anno_immatricolazione: 2021,
    lunghezza_mm: 4406,
    larghezza_mm: 1832,
    altezza_mm: null,
    lunghezza_vano_mm: 1820,
    larghezza_vano_mm: 1714,
    altezza_vano_mm: 1305,
    volume_metri_cubi: 3.4,
    portata_utile_kg: 586,
    posti: 2,
    alimentazione: "Diesel",
  },
  FE648PP: {
    slug: "fiat-doblo",
    targa: "FE648PP",
    marca: "Fiat",
    modello: "Doblò",
    versione: "Cargo 1.6 Multijet",
    anno_immatricolazione: 2016,
    lunghezza_mm: 4406,
    larghezza_mm: 1832,
    altezza_mm: null,
    lunghezza_vano_mm: 1820,
    larghezza_vano_mm: 1714,
    altezza_vano_mm: 1305,
    volume_metri_cubi: 3.4,
    portata_utile_kg: 705,
    posti: 3,
    alimentazione: "Diesel",
  },
  FG289KB: {
    slug: "fiat-ducato-l1h1",
    targa: "FG289KB",
    marca: "Fiat",
    modello: "Ducato",
    versione: "L1H1",
    anno_immatricolazione: 2017,
    lunghezza_mm: 4963,
    larghezza_mm: 2050,
    altezza_mm: null,
    lunghezza_vano_mm: 2670,
    larghezza_vano_mm: 1870,
    altezza_vano_mm: 1662,
    volume_metri_cubi: 8,
    portata_utile_kg: 640,
    posti: 3,
    alimentazione: "Diesel",
  },
  DV344HD: {
    slug: "ford-transit-l2h2-citta",
    targa: "DV344HD",
    marca: "Ford",
    modello: "Transit",
    versione: "L2H2 / 350M",
    anno_immatricolazione: 2009,
    lunghezza_mm: 5230,
    larghezza_mm: 1974,
    altezza_mm: null,
    lunghezza_vano_mm: 2949,
    larghezza_vano_mm: 1762,
    altezza_vano_mm: 1886,
    volume_metri_cubi: 10,
    portata_utile_kg: 1600,
    posti: 3,
    alimentazione: "Diesel",
  },
  ES772TN: {
    slug: "citroen-jumper-l1h1",
    targa: "ES772TN",
    marca: "Citroën",
    modello: "Jumper",
    versione: "L1H1",
    anno_immatricolazione: 2013,
    lunghezza_mm: 4963,
    larghezza_mm: 2050,
    altezza_mm: null,
    lunghezza_vano_mm: 2670,
    larghezza_vano_mm: 1870,
    altezza_vano_mm: 1662,
    volume_metri_cubi: 8,
    portata_utile_kg: 880,
    posti: 3,
    alimentazione: "Diesel",
  },
  GJ446AK: {
    slug: "ford-transit-custom-l1h1-ibrido",
    targa: "GJ446AK",
    marca: "Ford",
    modello: "Transit Custom",
    versione: "L1 H1",
    anno_immatricolazione: null,
    lunghezza_mm: 4972,
    larghezza_mm: 2032,
    altezza_mm: null,
    lunghezza_vano_mm: 2555,
    larghezza_vano_mm: 1775,
    altezza_vano_mm: 1406,
    volume_metri_cubi: 6,
    portata_utile_kg: 735,
    posti: 3,
    alimentazione: "Ibrido Diesel/Elettrico",
  },
  GG551RD: {
    slug: "ford-transit-l2h2",
    targa: "GG551RD",
    marca: "Ford",
    modello: "Transit",
    versione: "L2H2",
    anno_immatricolazione: 2021,
    lunghezza_mm: 5531,
    larghezza_mm: 2059,
    altezza_mm: 2470,
    lunghezza_vano_mm: 3044,
    larghezza_vano_mm: 1784,
    altezza_vano_mm: 1886,
    volume_metri_cubi: 10,
    /** Portata da libretto GG551RD (massa vuoto 2124 → portata 1166). */
    portata_utile_kg: 1166,
    posti: 3,
    alimentazione: "Diesel",
  },
  FT407CY: {
    slug: "ford-transit-l3h2",
    targa: "FT407CY",
    marca: "Ford",
    modello: "Transit",
    versione: "L3H2",
    anno_immatricolazione: 2018,
    lunghezza_mm: 5981,
    larghezza_mm: 2059,
    altezza_mm: null,
    lunghezza_vano_mm: null,
    larghezza_vano_mm: 1784,
    altezza_vano_mm: null,
    volume_metri_cubi: null,
    /** Portata da libretto FT407CY. */
    portata_utile_kg: 1230,
    posti: 3,
    alimentazione: "Diesel",
  },
  EW858WC: {
    slug: "peugeot-boxer-l2h2",
    targa: "EW858WC",
    marca: "Peugeot",
    modello: "Boxer",
    versione: "L2H2",
    anno_immatricolazione: 2014,
    lunghezza_mm: 5413,
    larghezza_mm: 2050,
    altezza_mm: null,
    lunghezza_vano_mm: 3120,
    larghezza_vano_mm: 1870,
    altezza_vano_mm: 1932,
    volume_metri_cubi: 11.5,
    portata_utile_kg: 1315,
    posti: 3,
    alimentazione: "Diesel",
  },
  GF883SB: {
    slug: "renault-master-l2h2",
    targa: "GF883SB",
    marca: "Renault",
    modello: "Master",
    versione: "L2H2",
    anno_immatricolazione: null,
    lunghezza_mm: 5548,
    larghezza_mm: 2070,
    altezza_mm: null,
    lunghezza_vano_mm: 3083,
    larghezza_vano_mm: 1765,
    altezza_vano_mm: 1894,
    volume_metri_cubi: 10.8,
    portata_utile_kg: 1451,
    posti: 3,
    alimentazione: "Diesel",
  },
  GT436ZP: {
    slug: "nissan-interstar-l3h2",
    targa: "GT436ZP",
    marca: "Nissan",
    modello: "Interstar",
    versione: "L3H2",
    anno_immatricolazione: 2024,
    lunghezza_mm: 6198,
    larghezza_mm: 2070,
    altezza_mm: null,
    lunghezza_vano_mm: 3733,
    larghezza_vano_mm: 1765,
    altezza_vano_mm: 1894,
    volume_metri_cubi: 13,
    portata_utile_kg: 1353,
    posti: 3,
    alimentazione: "Diesel",
  },
  GK420DW: {
    slug: "nissan-primastar-9-posti",
    targa: "GK420DW",
    marca: "Nissan",
    modello: "Primastar",
    versione: "9 posti Combi",
    anno_immatricolazione: null,
    lunghezza_mm: 5080,
    larghezza_mm: 1956,
    altezza_mm: null,
    lunghezza_vano_mm: null,
    larghezza_vano_mm: null,
    altezza_vano_mm: null,
    volume_metri_cubi: null,
    portata_utile_kg: 1057,
    posti: 9,
    alimentazione: "Diesel",
  },
  GC328PK: {
    slug: "opel-movano-l2h2",
    targa: "GC328PK",
    marca: "Opel",
    modello: "Movano",
    versione: "F 3500",
    anno_immatricolazione: 2020,
    lunghezza_mm: 5548,
    larghezza_mm: 2070,
    altezza_mm: null,
    lunghezza_vano_mm: 3083,
    larghezza_vano_mm: 1765,
    altezza_vano_mm: 1894,
    volume_metri_cubi: 10.8,
    portata_utile_kg: 1454,
    posti: 3,
    alimentazione: "Diesel",
  },
  GG290XM: {
    slug: "renault-master-l2h2",
    targa: "GG290XM",
    marca: "Renault",
    modello: "Master",
    versione: "L2H2",
    anno_immatricolazione: 2022,
    lunghezza_mm: 5548,
    larghezza_mm: 2070,
    altezza_mm: null,
    lunghezza_vano_mm: 3083,
    larghezza_vano_mm: 1765,
    altezza_vano_mm: 1894,
    volume_metri_cubi: 10.8,
    portata_utile_kg: 1251,
    posti: 3,
    alimentazione: "Diesel",
  },
  GL555VT: {
    slug: "renault-trafic-9-posti",
    targa: "GL555VT",
    marca: "Renault",
    modello: "Trafic",
    versione: "9 posti",
    anno_immatricolazione: null,
    lunghezza_mm: 5080,
    larghezza_mm: 1956,
    altezza_mm: null,
    lunghezza_vano_mm: null,
    larghezza_vano_mm: null,
    altezza_vano_mm: null,
    volume_metri_cubi: null,
    portata_utile_kg: 1057,
    posti: 9,
    alimentazione: "Diesel",
  },
  FT240AN: {
    slug: "citroen-jumper-l2h2",
    targa: "FT240AN",
    marca: "Citroën",
    modello: "Jumper",
    versione: "L2H2",
    anno_immatricolazione: 2018,
    lunghezza_mm: 5413,
    larghezza_mm: 2050,
    altezza_mm: null,
    lunghezza_vano_mm: 3120,
    larghezza_vano_mm: 1870,
    altezza_vano_mm: 1932,
    volume_metri_cubi: 11.5,
    portata_utile_kg: 1300,
    posti: 3,
    alimentazione: "Diesel",
  },
  FB728FR: {
    slug: "opel-vivaro",
    targa: "FB728FR",
    marca: "Opel",
    modello: "Vivaro",
    versione: "Van",
    anno_immatricolazione: 2015,
    lunghezza_mm: 4999,
    larghezza_mm: 1956,
    altezza_mm: null,
    lunghezza_vano_mm: 2537,
    larghezza_vano_mm: 1662,
    altezza_vano_mm: 1387,
    volume_metri_cubi: 5.2,
    portata_utile_kg: 1000,
    posti: 3,
    alimentazione: "Diesel",
  },
};

export function getFleetSpecByTarga(targa: string): FleetVehicleSpecRecord | null {
  return FLEET_SPECS_BY_TARGA[targa.trim().toUpperCase()] ?? null;
}

export function getFleetSpecBySlug(slug: string): FleetVehicleSpecRecord | null {
  return Object.values(FLEET_SPECS_BY_TARGA).find((r) => r.slug === slug) ?? null;
}

/** Applica libretto / scheda ufficiale sopra i dati DB (fonte unica portata e misure). */
export function applyFleetSpecToSpecifiche(
  targa: string | null | undefined,
  slug: string,
  specifiche: SpecificheTecniche,
): SpecificheTecniche {
  const fleet =
    (targa ? getFleetSpecByTarga(targa) : null) ?? getFleetSpecBySlug(slug);
  if (!fleet) return specifiche;

  return {
    ...specifiche,
    lunghezza_mm: fleet.lunghezza_mm,
    larghezza_mm: fleet.larghezza_mm,
    altezza_mm: fleet.altezza_mm ?? specifiche.altezza_mm,
    lunghezza_vano_mm: fleet.lunghezza_vano_mm ?? specifiche.lunghezza_vano_mm,
    larghezza_vano_mm: fleet.larghezza_vano_mm ?? specifiche.larghezza_vano_mm,
    altezza_vano_mm: fleet.altezza_vano_mm ?? specifiche.altezza_vano_mm,
    vano_lunghezza_mm: fleet.lunghezza_vano_mm ?? specifiche.vano_lunghezza_mm,
    vano_larghezza_mm: fleet.larghezza_vano_mm ?? specifiche.vano_larghezza_mm,
    vano_altezza_mm: fleet.altezza_vano_mm ?? specifiche.vano_altezza_mm,
    volume_metri_cubi: fleet.volume_metri_cubi ?? specifiche.volume_metri_cubi,
    volume_carico_mc: fleet.volume_metri_cubi ?? specifiche.volume_carico_mc,
    portata_utile_kg: fleet.portata_utile_kg,
    portata_kg: fleet.portata_utile_kg,
  };
}

/** Allinea highlight «Portata utile …» al valore ufficiale. */
export function syncPortataHighlight(
  highlights: string[],
  portataUtileKg: number | null | undefined,
): string[] {
  if (portataUtileKg == null || !Number.isFinite(portataUtileKg)) {
    return highlights.filter((h) => !/^portata\s+utile\b/i.test(h.trim()));
  }
  const label = `Portata utile ${Math.round(portataUtileKg).toLocaleString("it-IT")} kg`;
  let replaced = false;
  const next = highlights.map((h) => {
    if (/portata\s+utile/i.test(h)) {
      replaced = true;
      return label;
    }
    return h;
  });
  if (!replaced && highlights.length > 0) {
    // inserisci dopo alimentazione/categoria se presenti
    const insertAt = Math.min(2, next.length);
    next.splice(insertAt, 0, label);
  }
  return next;
}
