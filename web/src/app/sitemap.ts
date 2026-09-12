import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import {
  FLOTTA_CATEGORIA_SLUGS,
  isFlottaCategoriaSlug,
} from "@/lib/flotta-categoria-config";
import { getExactPathRedirectMap } from "@/lib/legacy-redirects";
import { canonicalUrl } from "@/lib/seo";
import { getPublishedSlugs } from "@/lib/veicoli";
import { getGuideSlugs } from "@/lib/guide";
import { VEICOLO_SLUG_REDIRECTS_301 } from "@/lib/veicolo-slug-renames";
import { getSeoSettings, isSeoPageNoindex } from "@/lib/seo-settings";
import { SEO_PAGE_PATHS, type SeoPageKey } from "@/types/seo";

const STATIC_PRIORITIES: Partial<Record<SeoPageKey, number>> = {
  home: 1,
  flotta: 0.95,
  tariffe: 0.85,
  contatti: 0.85,
  "chi-siamo": 0.8,
  autolavaggio: 0.8,
  offerte: 0.75,
};

/**
 * Pagine legali: indexabili (trust) ma priorità bassa in sitemap.
 * Incluse esplicitamente sotto (non via SEO_PAGE_PATHS default 0.6).
 */
const LEGAL_PATHS = [
  "/privacy",
  "/cookie-policy",
  "/termini-condizioni",
] as const;

const SITEMAP_EXCLUDED_FROM_STATIC = new Set<string>(LEGAL_PATHS);

export const revalidate = 3600;

const REDIRECTED_VEHICLE_SLUGS = new Set(VEICOLO_SLUG_REDIRECTS_301.map((r) => r.from));
const REDIRECT_PATHS = getExactPathRedirectMap();

/**
 * Solo URL canonici www attivi: niente redirect 301, host non canonici, slug vuoti.
 */
function sitemapEntry(
  path: string,
  extras: Omit<MetadataRoute.Sitemap[number], "url">,
): MetadataRoute.Sitemap[number] | null {
  const url = canonicalUrl(path);
  if (!url.startsWith(`${SITE_URL}/`) && url !== `${SITE_URL}/`) {
    return null;
  }

  const pathname = new URL(url).pathname.replace(/\/+$/, "") || "/";

  // Escludi path che esistono solo come sorgente di redirect legacy.
  if (pathname !== "/" && REDIRECT_PATHS.has(pathname)) {
    return null;
  }

  // Mai includere vecchi slug veicolo (targa / alias).
  if (pathname.startsWith("/flotta/")) {
    const slug = pathname.slice("/flotta/".length);
    if (!slug || REDIRECTED_VEHICLE_SLUGS.has(slug)) {
      return null;
    }
  }

  return { url, ...extras };
}

function uniqueEntries(entries: Array<MetadataRoute.Sitemap[number] | null>): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];
  for (const entry of entries) {
    if (!entry?.url || seen.has(entry.url)) continue;
    if (!entry.url.startsWith("https://www.lilosrl.it")) continue;
    seen.add(entry.url);
    out.push(entry);
  }
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, seoRows] = await Promise.all([
    getPublishedSlugs(),
    Promise.all(
      (Object.keys(SEO_PAGE_PATHS) as SeoPageKey[]).map(async (key) => ({
        key,
        path: SEO_PAGE_PATHS[key],
        seo: await getSeoSettings(key),
      })),
    ),
  ]);
  const now = new Date();

  const staticEntries = seoRows
    .filter(({ path, seo }) => {
      if (SITEMAP_EXCLUDED_FROM_STATIC.has(path)) return false;
      if (isSeoPageNoindex(seo)) return false;
      return true;
    })
    .map(({ key, path }) =>
      sitemapEntry(path, {
        lastModified: now,
        changeFrequency: key === "home" || key === "flotta" ? "daily" : "weekly",
        priority: STATIC_PRIORITIES[key] ?? 0.6,
      }),
    );

  const categoryEntries = FLOTTA_CATEGORIA_SLUGS.map((slug) =>
    sitemapEntry(`/flotta/${slug}`, {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.92,
    }),
  );

  const vehicleEntries = slugs
    .filter((slug) => {
      const clean = slug?.trim();
      if (!clean) return false;
      if (isFlottaCategoriaSlug(clean)) return false;
      if (REDIRECTED_VEHICLE_SLUGS.has(clean)) return false;
      if (REDIRECT_PATHS.has(`/flotta/${clean}`)) return false;
      return true;
    })
    .map((slug) =>
      sitemapEntry(`/flotta/${slug.trim()}`, {
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      }),
    );

  const guidaEntries = [
    sitemapEntry("/cosa-trasporti", {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.88,
    }),
    sitemapEntry("/noleggio-furgoni-trieste", {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.93,
    }),
    sitemapEntry("/noleggio-auto-trieste", {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.92,
    }),
    sitemapEntry("/noleggio-pulmini-9-posti-trieste", {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.92,
    }),
    sitemapEntry("/guide", {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.86,
    }),
    ...getGuideSlugs().map((slug) =>
      sitemapEntry(`/guide/${slug}`, {
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }),
    ),
  ];

  const legalEntries = LEGAL_PATHS.map((path) =>
    sitemapEntry(path, {
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    }),
  );

  return uniqueEntries([
    ...staticEntries,
    ...categoryEntries,
    ...vehicleEntries,
    ...guidaEntries,
    ...legalEntries,
  ]);
}
