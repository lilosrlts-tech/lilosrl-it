import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { FLOTTA_CATEGORIA_SLUGS } from "@/lib/flotta-categoria-config";
import { getPublishedSlugs } from "@/lib/veicoli";
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPublishedSlugs();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = (
    Object.entries(SEO_PAGE_PATHS) as [SeoPageKey, string][]
  ).map(([key, path]) => ({
    url: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: key === "home" || key === "flotta" ? "daily" : "weekly",
    priority: STATIC_PRIORITIES[key] ?? 0.6,
  }));

  const categoryEntries: MetadataRoute.Sitemap = FLOTTA_CATEGORIA_SLUGS.map((slug) => ({
    url: `${SITE_URL}/flotta/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.92,
  }));

  const vehicleEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/flotta/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const guidaEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/cosa-trasporti`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.88,
    },
  ];

  return [...staticEntries, ...categoryEntries, ...vehicleEntries, ...guidaEntries];
}
