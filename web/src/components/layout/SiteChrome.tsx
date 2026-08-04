import Link from "next/link";

import { LiloLogo } from "@/components/layout/LiloLogo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Navbar } from "@/components/Navbar";
import type { ImpostazioniSito } from "@/types/impostazioni";
import { COMPANY } from "@/lib/constants";

function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("39") && digits.length >= 11) {
    const local = digits.slice(2);
    if (local.length === 10) {
      return `+39 ${local.slice(0, 3)} ${local.slice(3, 6)}${local.slice(6)}`;
    }
  }
  if (digits.length === 10 && digits.startsWith("0")) {
    return `+39 ${digits.slice(0, 3)} ${digits.slice(3, 6)}${digits.slice(6)}`;
  }
  return phone.startsWith("+") ? phone : `+39 ${phone}`;
}

interface SiteHeaderProps {
  impostazioni: ImpostazioniSito;
}

export function SiteHeader({ impostazioni }: SiteHeaderProps) {
  const tel = impostazioni.telefono_noleggio;
  const phoneDisplay = formatPhoneDisplay(tel || COMPANY.phone);

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
