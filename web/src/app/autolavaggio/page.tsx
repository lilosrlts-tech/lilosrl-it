import type { Metadata } from "next";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import { getPageMetadata } from "@/lib/seo-settings";
import { AutolavaggioContent } from "@/components/autolavaggio/AutolavaggioContent";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("autolavaggio");
}

export default async function AutolavaggioPage() {
  const impostazioni = await loadImpostazioni();

  return (
    <SitePageWrapper impostazioni={impostazioni}>
      <AutolavaggioContent impostazioni={impostazioni} />
    </SitePageWrapper>
  );
}
