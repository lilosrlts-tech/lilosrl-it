import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { canonicalUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/.gestionale", "/.gestionale/"],
      },
    ],
    sitemap: canonicalUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
