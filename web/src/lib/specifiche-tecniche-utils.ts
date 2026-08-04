import type { SpecificheTecniche, VeicoloPubblico } from "@/types/veicolo";

export const EMPTY_SPECIFICHE: SpecificheTecniche = {
  volume_metri_cubi: null,
  portata_utile_kg: null,
  lunghezza_vano_mm: null,
  larghezza_vano_mm: null,
  altezza_vano_mm: null,
  larghezza_tra_passaruota_mm: null,
  capacita_bagagliaio_valigie: null,
  classe_ambientale: null,
  connessione_smartphone: null,
  configurazione_sedili: null,
  climatizzazione_posteriore: null,
  portata_kg: null,
  volume_carico_mc: null,
  trazione: null,
  passo: null,
  tetto: null,
  sensori_parcheggio: null,
  lunghezza_mm: null,
  larghezza_mm: null,
  altezza_mm: null,
  vano_lunghezza_mm: null,
  vano_larghezza_mm: null,
  vano_altezza_mm: null,
};

function readNumber(raw: Record<string, unknown>, key: string): number | null {
  const value = raw[key];
  if (value == null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function readBoolean(raw: Record<string, unknown>, key: string): boolean | null {
  const value = raw[key];
  if (value === true) return true;
  if (value === false) return false;
  return null;
}

export function mapSpecificheFromRaw(raw: Record<string, unknown>): SpecificheTecniche {
  const volume_carico_mc = readNumber(raw, "volume_carico_mc");
  const portata_kg = readNumber(raw, "portata_kg");
  const vano_lunghezza_mm = readNumber(raw, "vano_lunghezza_mm");
  const vano_larghezza_mm = readNumber(raw, "vano_larghezza_mm");
  const vano_altezza_mm = readNumber(raw, "vano_altezza_mm");

  return {
    volume_metri_cubi: readNumber(raw, "volume_metri_cubi") ?? volume_carico_mc,
    portata_utile_kg: readNumber(raw, "portata_utile_kg") ?? portata_kg,
    lunghezza_vano_mm: readNumber(raw, "lunghezza_vano_mm") ?? vano_lunghezza_mm,
    larghezza_vano_mm: readNumber(raw, "larghezza_vano_mm") ?? vano_larghezza_mm,
    altezza_vano_mm: readNumber(raw, "altezza_vano_mm") ?? vano_altezza_mm,
    larghezza_tra_passaruota_mm: readNumber(raw, "larghezza_tra_passaruota_mm"),
    capacita_bagagliaio_valigie: readNumber(raw, "capacita_bagagliaio_valigie"),
    classe_ambientale: (raw.classe_ambientale as string) ?? null,
    connessione_smartphone: (raw.connessione_smartphone as string) ?? null,
    configurazione_sedili: (raw.configurazione_sedili as string) ?? null,
    climatizzazione_posteriore: readBoolean(raw, "climatizzazione_posteriore"),
    portata_kg,
    volume_carico_mc,
    trazione: (raw.trazione as string) ?? null,
    passo: (raw.passo as string) ?? null,
    tetto: (raw.tetto as string) ?? null,
    sensori_parcheggio: readBoolean(raw, "sensori_parcheggio"),
    lunghezza_mm: readNumber(raw, "lunghezza_mm"),
    larghezza_mm: readNumber(raw, "larghezza_mm"),
    altezza_mm: readNumber(raw, "altezza_mm"),
    vano_lunghezza_mm,
    vano_larghezza_mm,
    vano_altezza_mm,
  };
}

export function mergeSpecifiche(partial: Partial<SpecificheTecniche>): SpecificheTecniche {
  return { ...EMPTY_SPECIFICHE, ...partial };
}

export interface SpecItem {
  label: string;
  value: string;
  highlight?: boolean;
}

function formatKg(kg: number): string {
  return `${kg.toLocaleString("it-IT")} kg`;
}

function formatMc(mc: number): string {
  const formatted = Number.isInteger(mc) ? String(mc) : mc.toFixed(2).replace(/\.?0+$/, "");
  return `${formatted.replace(".", ",")} m³`;
}

function formatMm(mm: number): string {
  return `${mm.toLocaleString("it-IT")} mm`;
}

function formatSiNo(value: boolean): string {
  return value ? "Sì" : "No";
}

function formatValigie(count: number): string {
  return count === 1 ? "1 valigia" : `${count} valigie`;
}

export function isFurgoneCategory(veicolo: VeicoloPubblico): boolean {
  const slug = veicolo.categoria?.slug ?? "";
  const nome = veicolo.categoria?.nome?.toLowerCase() ?? "";
  return slug.includes("furgon") || nome.includes("furgon");
}

export function isAutoCategory(veicolo: VeicoloPubblico): boolean {
  const slug = veicolo.categoria?.slug ?? "";
  const nome = veicolo.categoria?.nome?.toLowerCase() ?? "";
  return slug === "auto" || nome === "auto";
}

export function isPulminoCategory(veicolo: VeicoloPubblico): boolean {
  const slug = veicolo.categoria?.slug ?? "";
  const nome = veicolo.categoria?.nome?.toLowerCase() ?? "";
  return slug.includes("pulmin") || nome.includes("pulmin");
}

/** Campi principali furgone — evidenziati in scheda pubblica. */
export function buildFurgoneHighlightSpecs(spec: SpecificheTecniche): SpecItem[] {
  const items: SpecItem[] = [];
  if (spec.volume_metri_cubi != null) {
    items.push({
      label: "Volume di carico",
      value: formatMc(spec.volume_metri_cubi),
      highlight: true,
    });
  }
  if (spec.portata_utile_kg != null) {
    items.push({
      label: "Portata utile",
      value: formatKg(spec.portata_utile_kg),
      highlight: true,
    });
  }
  if (spec.lunghezza_vano_mm != null) {
    items.push({
      label: "Lunghezza vano",
      value: formatMm(spec.lunghezza_vano_mm),
      highlight: true,
    });
  }
  const larghezzaVano = spec.larghezza_vano_mm ?? spec.vano_larghezza_mm;
  if (larghezzaVano != null) {
    items.push({
      label: "Larghezza vano",
      value: formatMm(larghezzaVano),
      highlight: true,
    });
  }
  if (spec.altezza_vano_mm != null) {
    items.push({
      label: "Altezza vano",
      value: formatMm(spec.altezza_vano_mm),
      highlight: true,
    });
  }
  return items;
}

export function buildAutoCategorySpecs(spec: SpecificheTecniche): SpecItem[] {
  const items: SpecItem[] = [];
  if (spec.capacita_bagagliaio_valigie != null) {
    items.push({
      label: "Bagagliaio",
      value: formatValigie(spec.capacita_bagagliaio_valigie),
      highlight: true,
    });
  }
  if (spec.classe_ambientale) {
    items.push({ label: "Classe ambientale", value: spec.classe_ambientale, highlight: true });
  }
  if (spec.connessione_smartphone) {
    items.push({
      label: "Connessione smartphone",
      value: spec.connessione_smartphone,
      highlight: true,
    });
  }
  return items;
}

export function buildPulminoCategorySpecs(spec: SpecificheTecniche): SpecItem[] {
  const items: SpecItem[] = [];
  if (spec.configurazione_sedili) {
    items.push({
      label: "Configurazione sedili",
      value: spec.configurazione_sedili,
      highlight: true,
    });
  }
  if (spec.climatizzazione_posteriore != null) {
    items.push({
      label: "Climatizzazione posteriore",
      value: formatSiNo(spec.climatizzazione_posteriore),
      highlight: true,
    });
  }
  return items;
}

export function buildCaratteristicheGenerali(spec: SpecificheTecniche): SpecItem[] {
  const items: SpecItem[] = [];
  if (spec.trazione) items.push({ label: "Trazione", value: spec.trazione });
  if (spec.passo) items.push({ label: "Passo", value: spec.passo });
  if (spec.tetto) items.push({ label: "Tetto", value: spec.tetto });
  if (spec.sensori_parcheggio != null) {
    items.push({ label: "Sensori parcheggio", value: formatSiNo(spec.sensori_parcheggio) });
  }
  return items;
}

export function buildDimensioniEsterne(spec: SpecificheTecniche): SpecItem[] {
  const items: SpecItem[] = [];
  if (spec.lunghezza_mm != null) {
    items.push({ label: "Lunghezza esterna", value: formatMm(spec.lunghezza_mm) });
  }
  if (spec.larghezza_mm != null) {
    items.push({ label: "Larghezza esterna", value: formatMm(spec.larghezza_mm) });
  }
  if (spec.altezza_mm != null) {
    items.push({ label: "Altezza esterna", value: formatMm(spec.altezza_mm) });
  }
  return items;
}

export function buildVanoCarico(spec: SpecificheTecniche): SpecItem[] {
  return buildFurgoneVanoInterno(spec);
}

/** Unica sezione vano per furgoni — volume, portata e misure interne reali. */
export function buildFurgoneVanoInterno(spec: SpecificheTecniche): SpecItem[] {
  const items: SpecItem[] = [];

  if (spec.volume_metri_cubi != null) {
    items.push({ label: "Volume utile", value: formatMc(spec.volume_metri_cubi) });
  }
  if (spec.portata_utile_kg != null) {
    items.push({ label: "Portata utile", value: formatKg(spec.portata_utile_kg) });
  }

  const lunghezza = spec.lunghezza_vano_mm ?? spec.vano_lunghezza_mm;
  if (lunghezza != null) {
    items.push({ label: "Lunghezza interna", value: formatMm(lunghezza) });
  }

  const larghezzaPassaruota =
    spec.larghezza_tra_passaruota_mm ?? spec.larghezza_vano_mm ?? spec.vano_larghezza_mm;
  if (larghezzaPassaruota != null) {
    items.push({
      label: "Larghezza tra i passaruota",
      value: formatMm(larghezzaPassaruota),
    });
  }

  const larghezzaVano = spec.larghezza_vano_mm ?? spec.vano_larghezza_mm;
  if (
    larghezzaVano != null &&
    larghezzaVano !== spec.larghezza_tra_passaruota_mm
  ) {
    items.push({
      label: "Larghezza vano",
      value: formatMm(larghezzaVano),
    });
  }

  const altezza = spec.altezza_vano_mm ?? spec.vano_altezza_mm;
  if (altezza != null) {
    items.push({ label: "Altezza interna", value: formatMm(altezza) });
  }

  return items;
}

export function buildCategorySpecificSpecs(veicolo: VeicoloPubblico): SpecItem[] {
  const spec = veicolo.specifiche_tecniche;
  if (isFurgoneCategory(veicolo)) return buildFurgoneHighlightSpecs(spec);
  if (isAutoCategory(veicolo)) return buildAutoCategorySpecs(spec);
  if (isPulminoCategory(veicolo)) return buildPulminoCategorySpecs(spec);
  return [];
}

export function hasCategorySpecificSpecs(veicolo: VeicoloPubblico): boolean {
  return buildCategorySpecificSpecs(veicolo).length > 0;
}

export function hasSpecificheTecniche(spec: SpecificheTecniche): boolean {
  return (
    buildCaratteristicheGenerali(spec).length > 0 ||
    buildDimensioniEsterne(spec).length > 0 ||
    buildVanoCarico(spec).length > 0 ||
    buildFurgoneHighlightSpecs(spec).length > 0 ||
    buildAutoCategorySpecs(spec).length > 0 ||
    buildPulminoCategorySpecs(spec).length > 0
  );
}

export function getSpecificheSectionTitle(veicolo: VeicoloPubblico): string {
  if (isFurgoneCategory(veicolo)) return "Dati di carico e vano";
  if (isAutoCategory(veicolo)) return "Comfort e omologazione";
  if (isPulminoCategory(veicolo)) return "Configurazione passeggeri";
  const cat = veicolo.categoria?.nome;
  if (cat) return `Specifiche — ${cat}`;
  return "Specifiche tecniche";
}
