import dynamic from "next/dynamic";
import { Suspense } from "react";
import { FleetPreviewSection } from "@/components/home/FleetPreviewSection";
import { HeroSection } from "@/components/home/HeroSection";
import { MobileFlottaCategoriaGrid } from "@/components/home/MobileFlottaCategoriaGrid";
import { MobileHomePreventivoSection } from "@/components/home/MobileHomePreventivoSection";
import {
  FleetPreviewSkeleton,
  HomeBelowFoldSkeleton,
} from "@/components/home/HomeSectionSkeleton";
import { CosaTrasportiSection } from "@/components/wizard/CosaTrasportiSection";
import { SitePageWrapper } from "@/components/layout/SitePageWrapper";
import { loadImpostazioni } from "@/lib/site-page";
import type { ImpostazioniSito } from "@/types/impostazioni";

const HomeBelowFoldLazy = dynamic(
  () =>
    import("@/components/home/HomeBelowFoldSections").then((mod) => ({
      default: mod.HomeBelowFoldSections,
    })),
  { loading: () => <HomeBelowFoldSkeleton /> },
);

const cosaTrasportiFallback = (
  <div className="border-y border-slate-200 bg-slate-50 py-14">
    <div className="mx-auto max-w-6xl animate-pulse px-4">
      <div className="h-8 w-64 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-200" />
      <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-slate-200" />
        ))}
      </div>
    </div>
  </div>
);

interface HomePageContentProps {
  impostazioni: ImpostazioniSito;
}

export function HomePageContent({ impostazioni }: HomePageContentProps) {
  return (
    <SitePageWrapper impostazioni={impostazioni}>
      {/*
        Una sola «Cosa trasporti» nel DOM (no duplicato SEO).
        Ordine mobile: Hero → categorie → WA → guida → rest
        Ordine desktop: Hero → guida → flotta → rest
      */}
      <main className="flex flex-col">
        <div className="order-1">
          <HeroSection impostazioni={impostazioni} />
        </div>

        <div className="order-2 md:hidden">
          <MobileFlottaCategoriaGrid />
        </div>
        <div className="order-3 md:hidden">
          <MobileHomePreventivoSection telefono={impostazioni.telefono_noleggio} />
        </div>

        <div className="order-4 md:order-2">
          <Suspense fallback={cosaTrasportiFallback}>
            <CosaTrasportiSection />
          </Suspense>
        </div>

        <div className="order-5 hidden md:order-3 md:block">
          <Suspense fallback={<FleetPreviewSkeleton />}>
            <FleetPreviewSection />
          </Suspense>
        </div>

        <div className="order-6 md:order-4">
          <HomeBelowFoldLazy impostazioni={impostazioni} />
        </div>
      </main>
    </SitePageWrapper>
  );
}

export async function HomePageAsync() {
  const impostazioni = await loadImpostazioni();
  return <HomePageContent impostazioni={impostazioni} />;
}
