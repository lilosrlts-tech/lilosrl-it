import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { FleetPreviewSkeleton } from "@/components/home/HomeSectionSkeleton";
import { LiloLogo } from "@/components/layout/LiloLogo";
import { DEMO_IMPOSTAZIONI } from "@/lib/impostazioni";
import { PhoneLink } from "@/components/shared/PhoneLink";

/** Shell istantaneo per streaming: hero visibile prima del fetch impostazioni. */
export function HomePageShell() {
  const impostazioni = DEMO_IMPOSTAZIONI;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4">
          <LiloLogo />
          <PhoneLink
            phone={impostazioni.telefono_noleggio}
            className="rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-slate-900"
          >
            {impostazioni.telefono_noleggio}
          </PhoneLink>
        </div>
      </header>
      <main>
        <HeroSection impostazioni={impostazioni} />
        <FleetPreviewSkeleton />
      </main>
      <footer className="border-t border-slate-200 bg-slate-950 py-8 text-center text-sm text-slate-500">
        <Link href="/contatti" className="hover:text-white">
          Contatti LILO S.r.l. — Trieste
        </Link>
      </footer>
    </>
  );
}
