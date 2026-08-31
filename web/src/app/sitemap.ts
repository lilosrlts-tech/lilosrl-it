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

/** Pagine legali: indicizzabili ma priorità bassa (non sono landing commerciali). */
const LOW_PRIORITY_PATHS = new Set([
  "/privacy",
  "/cookie-policy",
  "/termini-condizioni",
]);

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
    // Doppio check host dopo dedupe
    if (!entry.url.startsWith("https://www.lilosrl.it")) continue;
    seen.add(entry.url);
    out.push(entry);
  }
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPublishedSlugs();
  const now = new Date();

  const staticEntries = (Object.entries(SEO_PAGE_PATHS) as [SeoPageKey, string][]).map(
    ([key, path]) =>
      sitemapEntry(path, {
        lastModified: now,
        changeFrequency: key === "home" || key === "flotta" ? "daily" : "weekly",
        priority: LOW_PRIORITY_PATHS.has(path)
          ? 0.3
          : (STATIC_PRIORITIES[key] ?? 0.6),
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
      // Path /flotta/{slug} non deve essere una sorgente di redirect.
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

  return uniqueEntries([...staticEntries, ...categoryEntries, ...vehicleEntries, ...guidaEntries]);
}
