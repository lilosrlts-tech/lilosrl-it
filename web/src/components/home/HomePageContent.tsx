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
      <main>
        <HeroSection impostazioni={impostazioni} />

        {/* Mobile: Hero → categorie → WA/Chiama → guida mezzo → rest */}
        <MobileFlottaCategoriaGrid />
        <MobileHomePreventivoSection telefono={impostazioni.telefono_noleggio} />
        <div className="md:hidden">
          <Suspense fallback={cosaTrasportiFallback}>
            <CosaTrasportiSection />
          </Suspense>
        </div>

        {/* Desktop: Hero → Cosa trasporti → La nostra flotta → rest */}
        <div className="hidden md:block">
          <Suspense fallback={cosaTrasportiFallback}>
            <CosaTrasportiSection />
          </Suspense>
        </div>
        <div className="hidden md:block">
          <Suspense fallback={<FleetPreviewSkeleton />}>
            <FleetPreviewSection />
          </Suspense>
        </div>

        <HomeBelowFoldLazy impostazioni={impostazioni} />
      </main>
    </SitePageWrapper>
  );
}

export async function HomePageAsync() {
  const impostazioni = await loadImpostazioni();
  return <HomePageContent impostazioni={impostazioni} />;
}
