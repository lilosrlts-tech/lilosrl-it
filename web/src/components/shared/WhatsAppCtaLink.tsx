import { COMPANY } from "@/lib/constants";
import { telefonoE164 } from "@/lib/impostazioni";
import type { ReactNode } from "react";

interface WhatsAppCtaLinkProps {
  /** Numero sede (default COMPANY.phone) */
  phone?: string;
  /** Messaggio precompilato */
  message?: string;
  className?: string;
  children?: ReactNode;
}

const DEFAULT_CLASS =
  "inline-flex items-center justify-center rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105";

/** CTA verde WhatsApp riutilizzabile (hub flotta, categorie, box aiuto). */
export function WhatsAppCtaLink({
  phone = COMPANY.phone,
  message = "Ciao, vorrei aiuto nella scelta del veicolo da noleggiare.",
  className = DEFAULT_CLASS,
  children = "WhatsApp",
}: WhatsAppCtaLinkProps) {
  const digits = telefonoE164(phone).replace(/\D/g, "");
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
