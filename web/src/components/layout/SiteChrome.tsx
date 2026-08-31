import Link from "next/link";

import { LiloLogo } from "@/components/layout/LiloLogo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Navbar } from "@/components/Navbar";
import type { ImpostazioniSito } from "@/types/impostazioni";
import { COMPANY } from "@/lib/constants";
import { formatPhoneDisplayIntl } from "@/lib/nap";

interface SiteHeaderProps {
  impostazioni: ImpostazioniSito;
}

export function SiteHeader({ impostazioni }: SiteHeaderProps) {
  const tel = impostazioni.telefono_noleggio;
  const phoneDisplay = formatPhoneDisplayIntl(tel || COMPANY.phone);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <LiloLogo />
        <Navbar
          phone={tel || COMPANY.phone}
          phoneDisplay={phoneDisplay}
          offertaAttiva={impostazioni.offerta_attiva}
        />
      </div>
    </header>
  );
}

export { SiteFooter };
