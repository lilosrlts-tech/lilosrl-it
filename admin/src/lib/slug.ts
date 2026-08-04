export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function buildVeicoloSlug(
  marca: string,
  modello: string,
  targa: string
): string {
  const base = slugify(`${marca}-${modello}-${targa}`);
  return base || slugify(targa);
}

export function buildCategoriaSlug(nome: string): string {
  return slugify(nome) || "categoria";
}
