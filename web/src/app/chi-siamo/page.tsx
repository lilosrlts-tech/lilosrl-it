import type { Metadata } from "next";
import { ChiSiamoContent } from "@/components/chi-siamo/ChiSiamoContent";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import { CHI_SIAMO_FAQ } from "@/lib/chi-siamo-data";
import { buildChiSiamoJsonLd } from "@/lib/json-ld";
import { getPageMetadata } from "@/lib/seo-settings";

/** Cache pagina 1h — contenuto stabile, meno round-trip Supabase. */
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("chi-siamo");
}

export default async function ChiSiamoPage() {
  const impostazioni = await loadImpostazioni();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildChiSiamoJsonLd(CHI_SIAMO_FAQ)) }}
      />
      <SitePageWrapper impostazioni={impostazioni}>
        <ChiSiamoContent impostazioni={impostazioni} />
      </SitePageWrapper>
    </>
  );
}
