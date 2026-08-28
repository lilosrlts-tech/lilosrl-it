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
 * URL canonico definitivo per GSC: sempre https://www.lilosrl.it,
 * senza query string, hash o trailing slash (home esclusa).
 */
export function canonicalUrl(pathOrUrl: string): string {
  let pathname = "/";
  const raw = pathOrUrl.trim();
  try {
    const u = /^https?:\/\//i.test(raw) ? new URL(raw) : new URL(raw || "/", SITE_URL);
    pathname = u.pathname;
  } catch {
    pathname = raw.split("?")[0].split("#")[0];
    if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  }

  pathname = pathname.replace(/\/+$/, "") || "/";
  if (pathname === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${pathname}`;
}

/**
 * Normalizza un canonical da DB (o assoluto) al formato pubblico univoco.
 * Query string e host non canonici vengono scartati; se il path non coincide
 * con `fallbackPath`, si usa il path atteso della pagina.
 */
export function resolvePageCanonical(
  candidate: string | null | undefined,
  fallbackPath: string,
): string {
  const fallback = canonicalUrl(fallbackPath);
  if (!candidate?.trim()) return fallback;

  const resolved = canonicalUrl(candidate);
  const expectedPath = new URL(fallback).pathname.replace(/\/+$/, "") || "/";
  const resolvedPath = new URL(resolved).pathname.replace(/\/+$/, "") || "/";
  return resolvedPath === expectedPath ? resolved : fallback;
}

export function veicoloCanonicalUrl(slug: string): string {
  return canonicalUrl(`/flotta/${slug}`);
}

export function buildFlottaMetadata(): Metadata {
  const canonical = canonicalUrl("/flotta");
  const title = "Flotta noleggio furgoni e auto Trieste | LILO";
  const description =
    "Scopri la flotta LILO S.r.l. a Trieste: auto, pulmini 9 posti e furgoni da piccoli a XL. Tariffe trasparenti, ritiro in sede. Prenota il veicolo ideale per te.";

  return {
    title: resolveMetadataTitle(title),
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
          url: `${SITE_URL}/logo-lilo.webp`,
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
      images: [`${SITE_URL}/logo-lilo.webp`],
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
  // Canonical = URL pulito della scheda (slug), mai query string / canonical_url DB sporco.
  const canonical = veicoloCanonicalUrl(veicolo.slug);

  const descriptionFromDb =
    veicolo.descrizione_breve?.trim() ||
    veicolo.descrizione_completa?.split("\n").map((l) => l.trim()).find(Boolean);

  const descriptionFallback = buildVeicoloSeoDescription(veicolo);
  const slugOverride =
    veicolo.slug === "ford-transit-custom-l1h1-ibrido"
      ? descriptionFallback
      : null;
  const description = fitSeoDescription(
    stripTargaFromPublicCopy(
      slugOverride ||
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
    robots: parseRobots(veicolo.meta_robots ?? "index, follow"),
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
