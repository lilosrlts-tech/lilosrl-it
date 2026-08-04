import type { TariffaCategoriaSlug } from "@/lib/tariffe-categoria";

/**
 * L’Offerta del Mese / Promo Weekend vale SOLO per questa categoria.
 * Non applicare copy, CTA o badge promo ad altre categorie flotta.
 */
export const OFFERTA_PROMO_CATEGORIA_SLUG =
  "furgoni-grandi-citta" as const satisfies TariffaCategoriaSlug;

export const OFFERTA_PROMO_CATEGORIA_LABEL = "Furgoni grandi (uso città)";

export const OFFERTA_PROMO_CATEGORIA_HREF = `/flotta/${OFFERTA_PROMO_CATEGORIA_SLUG}`;

export function isOffertaPromoCategoria(slug: string | null | undefined): boolean {
  return slug === OFFERTA_PROMO_CATEGORIA_SLUG;
}
