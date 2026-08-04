import type { Metadata } from "next";
import { ContattiContent } from "@/components/contatti/ContattiContent";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import { buildContattiJsonLd } from "@/lib/json-ld";
import { getPageMetadata } from "@/lib/seo-settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("contatti");
}

export default async function ContattiPage() {
  const impostazioni = await loadImpostazioni();
  const jsonLd = buildContattiJsonLd(impostazioni);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SitePageWrapper impostazioni={impostazioni}>
        <ContattiContent impostazioni={impostazioni} />
      </SitePageWrapper>
    </>
  );
}
