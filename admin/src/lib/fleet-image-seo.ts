import { slugify } from "@/lib/slug";

type FleetImageBase = {
  marca: string;
  modello: string;
  categoriaNome?: string | null;
  categoriaSlug?: string | null;
  isCopertina?: boolean;
};

function vehicleLabel(marca: string, modello: string): string {
  return `${marca} ${modello}`.replace(/\s+/g, " ").trim();
}

function categoriaLabel(categoriaNome?: string | null, categoriaSlug?: string | null): string {
  if (categoriaNome?.trim()) return categoriaNome.trim();
  if (!categoriaSlug) return "veicolo";
  return categoriaSlug.replace(/-/g, " ");
}

/**
 * Nome file SEO per upload admin in Storage.
 * Es. ford-transit-custom-noleggio-furgoni-medi-trieste-front.webp
 */
export function buildAdminFleetImageFilename(params: FleetImageBase & { ext: string }): string {
  const marca = slugify(params.marca) || "veicolo";
  const modello = slugify(params.modello) || "modello";
  const cat = slugify(params.categoriaSlug || params.categoriaNome || "flotta") || "flotta";
  const view = params.isCopertina ? "front" : "gallery";
  const stamp = Date.now().toString(36);
  const ext = (params.ext || "jpg").replace(/^\./, "").toLowerCase();
  return `${marca}-${modello}-noleggio-${cat}-trieste-${view}-${stamp}.${ext}`;
}

/** Alt text SEO per foto flotta. */
export function buildAdminFleetFotoAlt(params: FleetImageBase): string {
  const vehicle = vehicleLabel(params.marca, params.modello);
  const cat = categoriaLabel(params.categoriaNome, params.categoriaSlug);
  const view = params.isCopertina ? "vista anteriore" : "foto";
  return `Noleggio ${cat} ${vehicle} a Trieste — ${view} | LILO Autonoleggio Viale Campi Elisi`;
}

/** Title SEO per foto flotta. */
export function buildAdminFleetFotoTitle(params: FleetImageBase): string {
  const vehicle = vehicleLabel(params.marca, params.modello);
  const cat = categoriaLabel(params.categoriaNome, params.categoriaSlug);
  return `${vehicle} — noleggio ${cat} Trieste | LILO`;
}
