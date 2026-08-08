import type { Metadata } from "next";
import { preload } from "react-dom";
import { HomePageAsync } from "@/components/home/HomePageContent";
import { HomeHeroPreloads, HERO_640 } from "@/components/home/HeroSection";
import { getPageMetadata } from "@/lib/seo-settings";
import { buildHomeJsonLd } from "@/lib/json-ld";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("home");
}

/**
 * Niente Suspense+HomePageShell: lo shell di fallback restava nel HTML finale
 * (2× header/main/H1) e i crawler segnalavano Multiple H1.
 */
export default async function HomePage() {
  // Preload LCP mobile prima di qualsiasi await/stream del body.
  preload(`${SITE_URL}${HERO_640}`, {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
  });

  return (
    <>
      {/* React 19: <link rel="preload"> hoisted in <head> */}
      <HomeHeroPreloads />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeJsonLd()) }}
      />
      <HomePageAsync />
    </>
  );
}
