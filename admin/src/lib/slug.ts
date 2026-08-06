export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * Slug pubblico stabile: marca + modello + eventuale taglia/versione (es. L2H2).
 * La targa NON entra nell’URL (si aggiorna il mezzo senza cambiare link SEO).
 */
export function buildVeicoloSlug(
  marca: string,
  modello: string,
  versione?: string | null,
): string {
  const parts = [marca, modello];
  const v = versione?.trim();
  if (v) parts.push(v);
  const base = slugify(parts.join("-"));
  return base || slugify(`${marca}-${modello}`) || "veicolo";
}

export function buildCategoriaSlug(nome: string): string {
  return slugify(nome) || "categoria";
}
