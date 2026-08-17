import type { MetadataRoute } from "next";
import {
  FLOTTA_CATEGORIA_SLUGS,
  isFlottaCategoriaSlug,
} from "@/lib/flotta-categoria-config";
import { getExactPathRedirectMap } from "@/lib/legacy-redirects";
import { canonicalUrl } from "@/lib/seo";
import { getPublishedSlugs } from "@/lib/veicoli";
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

export const revalidate = 3600;

const REDIRECTED_VEHICLE_SLUGS = new Set(VEICOLO_SLUG_REDIRECTS_301.map((r) => r.from));

function sitemapEntry(
  path: string,
  extras: Omit<MetadataRoute.Sitemap[number], "url">,
): MetadataRoute.Sitemap[number] | null {
  const url = canonicalUrl(path);
  const pathname = new URL(url).pathname.replace(/\/+$/, "") || "/";
  if (getExactPathRedirectMap().has(pathname) && pathname !== "/") {
    return null;
  }
  return { url, ...extras };
}

function uniqueEntries(entries: Array<MetadataRoute.Sitemap[number] | null>): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];
  for (const entry of entries) {
    if (!entry?.url || seen.has(entry.url)) continue;
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
      return true;
    })
    .map((slug) =>
      sitemapEntry(`/flotta/${slug}`, {
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
  ];

  return uniqueEntries([...staticEntries, ...categoryEntries, ...vehicleEntries, ...guidaEntries]);
}
