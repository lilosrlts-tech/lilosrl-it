import type { Metadata } from "next";
import { Suspense } from "react";
import { HomePageAsync } from "@/components/home/HomePageContent";
import { HomePageShell } from "@/components/home/HomePageShell";
import { getPageMetadata } from "@/lib/seo-settings";
import { buildHomeJsonLd } from "@/lib/json-ld";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("home");
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeJsonLd()) }}
      />
      <Suspense fallback={<HomePageShell />}>
        <HomePageAsync />
      </Suspense>
    </>
  );
}
