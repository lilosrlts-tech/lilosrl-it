import { resolveVeicoloCoverUrl } from "@/lib/fleet-image-url";
import type { VeicoloPubblico } from "@/types/veicolo";

/** Foto reali (in loco / upload) vs. ritagli studio in /images/flotta/. */
export function isEnvironmentalFleetPhoto(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  const normalized = url.trim().toLowerCase();
  if (normalized.includes("/images/veicoli/")) return true;
  if (normalized.includes("supabase.co/storage")) return true;
  // Foto in loco salvate sotto /images/flotta/ (non ritagli studio)
  if (
    normalized.includes("/images/flotta/") &&
    (normalized.includes("trieste") ||
      normalized.includes("campi-elisi") ||
      normalized.includes("toyota-proace") ||
      normalized.includes("iveco-daily-l2h2") ||
      normalized.includes("promo-weekend"))
  ) {
    return true;
  }
  return false;
}

/** Ritagli studio (sfondo nero/bianco) usati solo come ultima riserva. */
export function isHubCategoryStudioPhoto(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  if (isEnvironmentalFleetPhoto(url)) return false;
  const normalized = url.trim().toLowerCase();
  if (normalized.includes("/images/flotta/")) return true;
  if (normalized.includes("lilosrl.it/wp-content")) return true;
  return false;
}

/**
 * Cover card hub/home per categoria.
 * Priorità: immagine vetrina curata (FLOTTA_CATEGORIA_IMAGES), poi foto reali in categoria.
 */
export function pickCategoriaHubCover(
  categorySlug: string,
  veicoli: VeicoloPubblico[],
  fallback: string,
): string {
  if (fallback?.trim()) return fallback;

  const inCat = veicoli.filter((veicolo) => veicolo.categoria?.slug === categorySlug);
  const covers = inCat
    .map((veicolo) => resolveVeicoloCoverUrl(veicolo))
    .filter((url): url is string => Boolean(url));

  const real = covers.find((url) => isEnvironmentalFleetPhoto(url) && !isHubCategoryStudioPhoto(url));
  if (real) return real;

  const anyNonStudio = covers.find((url) => !isHubCategoryStudioPhoto(url));
  if (anyNonStudio) return anyNonStudio;

  if (covers[0]) return covers[0];
  return fallback;
}

/** Slug veicolo preferito in vetrina home per categoria (foto + titolo card). */
export const CATEGORIA_VETRINA_VEICOLO_SLUG: Record<string, string> = {
  auto: "volkswagen-polo",
  "furgoni-piccoli": "toyota-proace-city",
  "furgoni-medi": "ford-transit-custom-l1h1-ibrido",
  "furgoni-grandi": "ford-transit-l2h2",
};

export function pickCategoriaVetrinaVeicolo(
  categorySlug: string,
  veicoli: VeicoloPubblico[],
): VeicoloPubblico | null {
  const inCat = veicoli.filter((veicolo) => veicolo.categoria?.slug === categorySlug);
  if (inCat.length === 0) return null;

  const preferredSlug = CATEGORIA_VETRINA_VEICOLO_SLUG[categorySlug];
  if (preferredSlug) {
    const preferred = inCat.find((veicolo) => veicolo.slug === preferredSlug);
    if (preferred) return preferred;
  }

  const featured = inCat.find((veicolo) => (veicolo as { in_evidenza?: boolean }).in_evidenza);
  if (featured) return featured;

  let best = inCat[0]!;
  for (const veicolo of inCat.slice(1)) {
    const existingCover = resolveVeicoloCoverUrl(best);
    const nextCover = resolveVeicoloCoverUrl(veicolo);
    const existingReal = isEnvironmentalFleetPhoto(existingCover);
    const nextReal = isEnvironmentalFleetPhoto(nextCover);
    if (!existingReal && nextReal) best = veicolo;
  }
  return best;
}

export const FLEET_PHOTO_FRAME = {
  outer: "overflow-hidden bg-gradient-to-b from-slate-50 to-white",
  inner: "flex h-full w-full items-center justify-center p-2 sm:p-3",
  img: "max-h-full max-w-full object-contain object-center transition duration-300 group-hover:scale-[1.02]",
  environmentalImg:
    "max-h-full max-w-full object-contain object-center transition duration-300 group-hover:scale-[1.02] saturate-[0.94] contrast-[1.03]",
  environmentalOverlay:
    "pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-slate-50/30",
} as const;

/**
 * Regola unica foto mezzi (mobile + desktop): sempre intero veicolo, mai tagliato.
 * object-contain + padding leggero nello frame bianco.
 */
export const FLEET_VEHICLE_IMG = {
  environmental:
    "object-contain object-center p-1.5 transition duration-300 group-hover:scale-[1.02] saturate-[0.94] contrast-[1.03] sm:p-2",
  environmentalHub:
    "object-contain object-center p-1.5 transition duration-300 group-hover:scale-[1.03] saturate-[0.96] contrast-[1.02] sm:p-2",
  studio:
    "object-contain object-center p-1.5 transition duration-300 group-hover:scale-[1.02] sm:p-2",
  studioHub: "object-contain object-center p-2 sm:p-3",
  /** Thumb griglia categorie home (solo mobile). */
  categoryThumb: "object-contain object-center p-1",
  /** Risultati wizard / card compatte. */
  resultThumb: "object-contain object-center p-1.5 sm:p-2",
} as const;

export type FleetPhotoAspect = "4/3" | "16/10";

export function fleetPhotoAspectClass(aspect: FleetPhotoAspect): string {
  return aspect === "16/10" ? "aspect-[16/10]" : "aspect-[4/3]";
}
