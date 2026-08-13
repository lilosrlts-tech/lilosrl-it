import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { resolveMetadataTitle } from "@/lib/metadata-title";
import {
  resolveVeicoloSeoTitle,
  fitSeoDescription,
  fitSeoTitle,
} from "@/lib/seo-limits";
import { buildVeicoloSeoDescription, getVeicoloFotoAlt, stripTargaFromPublicCopy, toAbsoluteAssetUrl } from "@/lib/veicolo-seo";
import {
  getCoverImage,
  getPrezzoGiornaliero,
} from "@/lib/veicoli";
import type { VeicoloPubblico } from "@/types/veicolo";

/**
 * Forza sempre il dominio canonico www.lilosrl.it (HTTPS, no duplicati).
 * Home → slash finale; altre path → senza slash finale.
 */
export function canonicalUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/" || normalized === "") {
    return `${SITE_URL}/`;
  }
  const bare = normalized.replace(/\/+$/, "") || "/";
  return `${SITE_URL}${bare}`;
}

/**
 * Normalizza un canonical da DB (o assoluto) al formato pubblico univoco.
 * Se punta a un path diverso da `fallbackPath`, si ignora e si usa il path atteso.
 */
export function resolvePageCanonical(
  candidate: string | null | undefined,
  fallbackPath: string,
): string {
  const fallback = canonicalUrl(fallbackPath);
  if (!candidate?.trim()) return fallback;

  try {
    const raw = candidate.trim();
    const absolute = /^https?:\/\//i.test(raw)
      ? raw
      : `${SITE_URL}${raw.startsWith("/") ? raw : `/${raw}`}`;
    const u = new URL(absolute);
    const path = u.pathname.replace(/\/+$/, "") || "/";
    const expected = new URL(fallback).pathname.replace(/\/+$/, "") || "/";
    if (path !== expected) return fallback;
    return canonicalUrl(path);
  } catch {
    return fallback;
  }
}

export function veicoloCanonicalUrl(slug: string): string {
  return canonicalUrl(`/flotta/${slug}`);
}

export function buildFlottaMetadata(): Metadata {
  const canonical = canonicalUrl("/flotta");
  const title = "Flotta Noleggio Furgoni e Auto a Trieste | Lilo Srl";
  const description =
    "Scopri la flotta LILO S.r.l. a Trieste: auto, pulmini 9 posti e furgoni da piccoli a XL. Tariffe trasparenti, ritiro in sede. Prenota il veicolo ideale per te.";

  return {
    title,
    description,
    keywords: [
      "noleggio furgoni trieste",
      "noleggio auto trieste",
      "flotta autonoleggio",
      "pulmini 9 posti trieste",
      "furgoni noleggio",
      "LILO S.r.l.",
    ],
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "it_IT",
      url: canonical,
      siteName: "LILO S.r.l. — Autonoleggio Trieste",
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/logo-lilo.jpg`,
          width: 1200,
          height: 630,
          alt: "LILO S.r.l. — Autonoleggio Trieste",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/logo-lilo.jpg`],
    },
    other: {
      "geo.region": "IT-TS",
      "geo.placename": "Trieste",
    },
  };
}

export function parseRobots(metaRobots: string | null): Metadata["robots"] {
  const value = (metaRobots ?? "index, follow").toLowerCase();
  return {
    index: !value.includes("noindex"),
    follow: !value.includes("nofollow"),
    googleBot: { index: !value.includes("noindex"), follow: !value.includes("nofollow") },
  };
}

export function buildVeicoloMetadata(veicolo: VeicoloPubblico): Metadata {
  const canonical = resolvePageCanonical(
    veicolo.canonical_url,
    `/flotta/${veicolo.slug}`,
  );

  const descriptionFromDb =
    veicolo.descrizione_breve?.trim() ||
    veicolo.descrizione_completa?.split("\n").map((l) => l.trim()).find(Boolean);

  const descriptionFallback = buildVeicoloSeoDescription(veicolo);
  const description = fitSeoDescription(
    stripTargaFromPublicCopy(
      veicolo.seo_description?.trim() ||
        descriptionFromDb ||
        veicolo.ai_summary ||
        descriptionFallback,
    ),
    descriptionFallback,
  );

  const titleFallback = resolveVeicoloSeoTitle(null, veicolo.marca, veicolo.modello, {
    versione: veicolo.versione,
    slug: veicolo.slug,
  });
  const title = fitSeoTitle(
    resolveVeicoloSeoTitle(veicolo.seo_title, veicolo.marca, veicolo.modello, {
      versione: veicolo.versione,
      slug: veicolo.slug,
    }),
    titleFallback,
  );

  // Ahrefs: <title> e og:title devono coincidere esattamente.
  const ogTitle = title;
  const ogDescription = fitSeoDescription(
    stripTargaFromPublicCopy(veicolo.og_description ?? description),
    description,
  );
  // Preferisci og_image_url esplicito, poi copertina flotta
  const imageAbsolute =
    toAbsoluteAssetUrl(veicolo.og_image_url) ?? toAbsoluteAssetUrl(getCoverImage(veicolo));
  const coverFoto =
    veicolo.foto.find((f) => f.is_copertina) ?? veicolo.foto[0] ?? null;
  const imageAlt = getVeicoloFotoAlt(veicolo, coverFoto);
  const prezzo = getPrezzoGiornaliero(veicolo);

  const keywords = [
    ...veicolo.seo_keywords,
    `noleggio ${veicolo.categoria?.nome?.toLowerCase() ?? "auto"} trieste`,
    veicolo.marca,
    veicolo.modello,
    "LILO autonoleggio",
  ].filter((k): k is string => Boolean(k) && !/^[A-Z]{2}\d{3}[A-Z]{2}$/i.test(k.trim()));

  const other: Record<string, string> = {
    "geo.region": "IT-TS",
    "geo.placename": "Trieste",
  };
  if (prezzo) {
    other["product:price:amount"] = String(prezzo.importo);
    other["product:price:currency"] = prezzo.valuta;
  }

  return {
    title: resolveMetadataTitle(title),
    description,
    keywords,
    alternates: {
      canonical,
    },
    robots: parseRobots(veicolo.meta_robots),
    openGraph: {
      type: "website",
      locale: "it_IT",
      url: canonical,
      siteName: "LILO S.r.l. — Autonoleggio Trieste",
      title: ogTitle,
      description: ogDescription,
      images: imageAbsolute
        ? [
            {
              url: imageAbsolute,
              width: 1200,
              height: 630,
              alt: imageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: fitSeoDescription(
        veicolo.twitter_description?.trim() || ogDescription,
        ogDescription,
      ),
      images: imageAbsolute ? [imageAbsolute] : undefined,
    },
    other,
  };
}
