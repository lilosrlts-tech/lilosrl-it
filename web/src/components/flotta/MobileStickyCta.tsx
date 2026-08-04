"use client";

import { PhoneLink } from "@/components/shared/PhoneLink";
import { COMPANY } from "@/lib/constants";
import { telefonoE164 } from "@/lib/impostazioni";

interface MobileStickyCtaProps {
  telefono: string;
  /** Prezzo giornaliero opzionale da mostrare sul CTA preventivo */
  prezzoGiorno?: number | null;
  /** Testo precompilato WhatsApp */
  veicoloName?: string;
}

function whatsappHref(phone: string, veicoloName?: string): string {
  const digits = telefonoE164(phone).replace(/\D/g, "");
  const text = veicoloName
    ? `Ciao, vorrei informazioni sul noleggio di: ${veicoloName}`
    : "Ciao, vorrei informazioni sul noleggio";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/**
 * Barra CTA fissa su mobile e tablet (scheda veicolo).
 * Da lg in su: sidebar sticky PreventivoForm.
 */
export function MobileStickyCta({
  telefono,
  prezzoGiorno,
  veicoloName,
}: MobileStickyCtaProps) {
  const phone = telefono || COMPANY.phone;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden"
      role="navigation"
      aria-label="Azioni rapide mobile"
    >
      <p className="mb-1.5 text-center text-[10px] leading-tight text-slate-500">
        Giornata noleggio 08:30 → 08:30 · Preventivo senza impegno
      </p>
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
        <PhoneLink
          phone={phone}
          className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-1 py-2 text-center text-[11px] font-semibold leading-tight text-slate-800"
        >
          <span className="text-base leading-none" aria-hidden="true">
            ☎
          </span>
          <span className="mt-1">Chiama</span>
        </PhoneLink>

        <a
          href={whatsappHref(phone, veicoloName)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-1 py-2 text-center text-[11px] font-semibold leading-tight text-emerald-900"
        >
          <span className="text-base leading-none" aria-hidden="true">
            WA
          </span>
          <span className="mt-1">WhatsApp</span>
        </a>

        <a
          href="#preventivo"
          className="flex flex-col items-center justify-center rounded-xl bg-brand-600 px-1 py-2 text-center text-[11px] font-semibold leading-tight text-white shadow-sm"
        >
          <span className="text-base leading-none" aria-hidden="true">
            ✉
          </span>
          <span className="mt-1">
            Preventivo
            {prezzoGiorno != null ? ` €${Math.round(prezzoGiorno)}` : ""}
          </span>
        </a>
      </div>
    </div>
  );
}
