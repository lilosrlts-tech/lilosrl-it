"use client";

import { PhoneLink } from "@/components/shared/PhoneLink";
import { WhatsAppPreventivoCard } from "@/components/home/WhatsAppPreventivoCard";
import { COMPANY } from "@/lib/constants";

interface MobileHomePreventivoSectionProps {
  telefono?: string;
}

/**
 * Preventivo WhatsApp + Chiama — solo mobile, sotto le categorie flotta.
 */
export function MobileHomePreventivoSection({
  telefono = COMPANY.phone,
}: MobileHomePreventivoSectionProps) {
  return (
    <section className="border-b border-slate-200 bg-slate-50 px-4 py-6 md:hidden">
      <div className="mb-3 grid grid-cols-2 gap-2">
        <PhoneLink
          phone={telefono}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-3 py-3 text-sm font-bold text-slate-900 shadow-sm"
        >
          <span aria-hidden="true">☎</span>
          Chiama
        </PhoneLink>
        <a
          href="#preventivo-whatsapp"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3 text-sm font-bold text-white shadow-sm"
        >
          WhatsApp
        </a>
      </div>
      <WhatsAppPreventivoCard
        anchorId="preventivo-whatsapp"
        headingId="whatsapp-preventivo-heading-mobile"
      />
    </section>
  );
}
