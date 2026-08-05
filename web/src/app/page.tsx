import type { Metadata } from "next";
import { HomePageAsync } from "@/components/home/HomePageContent";
import { getPageMetadata } from "@/lib/seo-settings";
import { buildHomeJsonLd } from "@/lib/json-ld";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("home");
}

/**
 * Niente Suspense+HomePageShell: lo shell di fallback restava nel HTML finale
 * (2× header/main/H1) e i crawler segnalavano Multiple H1.
 */
export default async function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeJsonLd()) }}
      />
      <HomePageAsync />
    </>
  );
}
