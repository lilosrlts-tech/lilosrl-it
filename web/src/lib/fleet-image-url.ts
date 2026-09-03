import { DEMO_VEICOLI } from "@/lib/demo-veicolo";
import type { VeicoloPubblico } from "@/types/veicolo";

/** Immagini statiche in public/images/flotta/ e /images/veicoli/ */
export const LOCAL_FLEET_IMAGE_BY_SLUG: Record<string, string> = {
  ...Object.fromEntries(
    DEMO_VEICOLI.flatMap((veicolo) => {
      const cover =
        veicolo.foto.find((f) => f.is_copertina)?.url_pubblico ?? veicolo.foto[0]?.url_pubblico;
      return cover ? [[veicolo.slug, cover]] : [];
    }),
  ),
  "citroen-jumpy-l1h1": "/images/veicoli/citroen-jumpy-noleggio-furgoni-medi-trieste.webp",
  "fiat-doblo-cargo": "/images/veicoli/fiat-doblo-noleggio-furgoni-piccoli-trieste.webp",
  "fiat-doblo": "/images/veicoli/fiat-doblo-blu-noleggio-furgoni-piccoli-trieste.webp",
  "toyota-proace-city":
    "/images/flotta/furgone-piccolo-toyota-proace-city-trieste-front.webp",
  "fiat-ducato-l1h1": "/images/veicoli/fiat-ducato-l1h1-noleggio-trieste.webp",
  "ford-transit-custom-l1h1-ibrido":
    "/images/veicoli/ford-transit-custom-noleggio-trieste-viale-campi-elisi.webp",
  "ford-transit-custom-l1h1":
    "/images/veicoli/ford-transit-custom-noleggio-furgoni-medi-trieste.webp",
  "ford-transit-l2h2-citta": "/images/veicoli/ford-transit-l2h2-noleggio-trieste.webp",
  "ford-transit-l2h2":
    "/images/veicoli/ford-transit-gg551rd-noleggio-furgoni-grandi-trieste.webp",
  "citroen-jumper-l2h2": "/images/veicoli/furgone-citroen-jumper-l2h2-trieste.webp",
  "opel-vivaro": "/images/veicoli/furgone-opel-vivaro-trieste.webp",
  "ford-transit-l3h2": "/images/veicoli/ford-transit-l3h2-passo-lungo-noleggio.webp",
  "citroen-jumper-l1h1": "/images/veicoli/citroen-jumper-noleggio-furgoni-trieste.webp",
  "nissan-interstar-l3h2":
    "/images/veicoli/nissan-interstar-l3h2-noleggio-furgoni-xl-trieste.webp",
  "peugeot-boxer-l2h2":
    "/images/veicoli/peugeot-boxer-l2h2-noleggio-furgoni-grandi-citta-trieste.webp",
  "renault-master-l2h2": "/images/veicoli/renault-master-noleggio-furgoni-grandi-trieste.webp",
  "opel-movano-l2h2": "/images/veicoli/opel-movano-noleggio-furgoni-grandi-trieste.webp",
  "renault-trafic-9-posti": "/images/veicoli/renault-trafic-9-posti-noleggio-trieste.webp",
  "nissan-primastar-9-posti": "/images/veicoli/nissan-primastar-9-posti-frontale.webp",
  "volvo-s40": "/images/veicoli/volvo-s40-noleggio-trieste.webp",
  "citroen-c3": "/images/veicoli/citroen-c3-grigia-trieste.webp",
  "volkswagen-polo": "/images/veicoli/volkswagen-polo-noleggio-auto-trieste.webp",
  "opel-karl": "/images/veicoli/opel-karl-noleggio-auto-trieste.webp",
  "peugeot-boxer-l3h3": "/images/veicoli/furgone-peugeot-boxer-l3h3-trieste.webp",
  "iveco-daily-35-12": "/images/flotta/furgone-grande-iveco-daily-l2h2-trieste-front.webp",
  "iveco-daily-70-17": "/images/flotta/iveco-daily-noleggio-furgoni-xl-trieste.webp",
};

/** Fallback per categoria quando manca la foto specifica del veicolo. */
export const LOCAL_FLEET_IMAGE_BY_CATEGORY: Record<string, string> = {
  auto: "/images/veicoli/volkswagen-polo-noleggio-auto-trieste.webp",
  "pulmini-9-posti": "/images/veicoli/renault-trafic-9-posti-noleggio-trieste.webp",
  "furgoni-piccoli":
    "/images/flotta/furgone-piccolo-toyota-proace-city-trieste-front.webp",
  "furgoni-medi":
    "/images/veicoli/ford-transit-custom-noleggio-trieste-viale-campi-elisi.webp",
  "furgoni-grandi":
    "/images/veicoli/ford-transit-gg551rd-noleggio-furgoni-grandi-trieste.webp",
  "furgoni-grandi-citta":
    "/images/flotta/furgone-grande-iveco-daily-l2h2-trieste-front.webp",
  "furgoni-xl": "/images/veicoli/furgone-peugeot-boxer-l3h3-trieste.webp",
};

const REMOTE_URL_TO_REPLACE =
  /lilosrl\.it\/wp-content|unsplash\.com|images\.unsplash/i;

export function normalizePublicImageUrl(url: string | null | undefined): string | null {
  const trimmed = url?.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;

  if (trimmed.startsWith("/")) return trimmed;

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const withoutPublic = trimmed.replace(/^public\//, "");
  if (withoutPublic.startsWith("images/")) return `/${withoutPublic}`;

  return null;
}

export function shouldUseLocalFleetAsset(url: string): boolean {
  return REMOTE_URL_TO_REPLACE.test(url);
}

/** Risolve un candidato URL sostituendo link legacy con asset locali noti. */
export function resolveFleetImageCandidate(
  raw: string | null | undefined,
  slug: string,
  categorySlug?: string | null,
): string | null {
  const normalized = normalizePublicImageUrl(raw);
  if (!normalized) return null;

  if (shouldUseLocalFleetAsset(normalized)) {
    return (
      LOCAL_FLEET_IMAGE_BY_SLUG[slug] ??
      (categorySlug ? LOCAL_FLEET_IMAGE_BY_CATEGORY[categorySlug] : null) ??
      null
    );
  }

  return normalized;
}

/** URL locale di riserva (slug → categoria) senza usare sorgenti remote. */
export function getLocalFleetImageFallback(
  slug: string,
  categorySlug?: string | null,
): string | null {
  return (
    LOCAL_FLEET_IMAGE_BY_SLUG[slug] ??
    (categorySlug ? LOCAL_FLEET_IMAGE_BY_CATEGORY[categorySlug] : null) ??
    null
  );
}

/** URL copertina da usare nelle card e nella galleria. */
export function resolveVeicoloCoverUrl(veicolo: VeicoloPubblico): string | null {
  const cover = veicolo.foto.find((f) => f.is_copertina) ?? veicolo.foto[0];
  const slug = veicolo.slug;
  const categorySlug = veicolo.categoria?.slug;

  const candidates: (string | null | undefined)[] = [
    cover?.url_pubblico,
    veicolo.og_image_url,
    LOCAL_FLEET_IMAGE_BY_SLUG[slug],
    categorySlug ? LOCAL_FLEET_IMAGE_BY_CATEGORY[categorySlug] : null,
  ];

  for (const raw of candidates) {
    const resolved = resolveFleetImageCandidate(raw, slug, categorySlug);
    if (resolved) return resolved;
  }

  return null;
}

/** Allinea foto e og_image ai path locali quando le URL remote non sono affidabili. */
export function enrichVeicoloMedia(veicolo: VeicoloPubblico): VeicoloPubblico {
  const slug = veicolo.slug;
  const categorySlug = veicolo.categoria?.slug;
  const resolvedCover = resolveVeicoloCoverUrl(veicolo);

  const foto = veicolo.foto.map((f) => {
    const resolved =
      resolveFleetImageCandidate(f.url_pubblico, slug, categorySlug) ??
      (f.is_copertina ? resolvedCover : null);
    return resolved ? { ...f, url_pubblico: resolved } : f;
  });

  if (foto.length === 0 && resolvedCover) {
    return {
      ...veicolo,
      og_image_url: resolvedCover,
      foto: [
        {
          id: `${slug}-cover-local`,
          url_pubblico: resolvedCover,
          alt_text: `Noleggio ${veicolo.marca} ${veicolo.modello} a Trieste`,
          titolo: null,
          didascalia: null,
          ordine: 0,
          is_copertina: true,
        },
      ],
    };
  }

  const og =
    resolveFleetImageCandidate(veicolo.og_image_url, slug, categorySlug) ?? resolvedCover;

  return {
    ...veicolo,
    og_image_url: og,
    foto,
  };
}
