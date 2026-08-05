"use client";

import { useState } from "react";
import Link from "next/link";
import { VeicoloCoverImage } from "@/components/flotta/VeicoloCoverImage";
import { WhatsAppPreventivoCard } from "@/components/home/WhatsAppPreventivoCard";
import { PREZZO_IVA_DICITURA } from "@/lib/tariffe-categoria";
import type { VeicoloPlaceholderVariant } from "@/lib/veicolo-utils";

const MOBILE_VISIBLE = 3;

export interface FleetPreviewCardData {
  id: string;
  href: string;
  title: string;
  spec: string;
  alt: string;
  cover: string | null;
  fallback: string | null;
  categoryLabel: string;
  variant: VeicoloPlaceholderVariant;
  /** Listino giornaliero; se null mostra solo prezzoCategoria */
  prezzoGiornaliero: number | null;
  promoLine: string | null;
  notaCommerciale: string | null;
  prezzoCategoriaFallback: number;
  unitaLabel: string | null;
}

interface FleetPreviewGridProps {
  cards: FleetPreviewCardData[];
  /** Su mobile il form WA è già sopra le categorie — evita duplicato. */
  showWhatsAppCard?: boolean;
}

/**
 * Su smartphone: 3 card + «Mostra tutti».
 * Da md in su: griglia completa (+ WhatsApp se showWhatsAppCard).
 */
export function FleetPreviewGrid({
  cards,
  showWhatsAppCard = true,
}: FleetPreviewGridProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = cards.length > MOBILE_VISIBLE;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => {
        const hideOnMobile = !expanded && index >= MOBILE_VISIBLE;
        const importo =
          card.prezzoGiornaliero != null
            ? Math.round(card.prezzoGiornaliero)
            : card.prezzoCategoriaFallback;

        return (
          <div key={card.id} className={hideOnMobile ? "max-md:hidden" : undefined}>
            <Link
              href={card.href}
              className="group block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative">
                <VeicoloCoverImage
                  src={card.cover}
                  fallbackSrc={card.fallback}
                  alt={card.alt}
                  variant={card.variant}
                  placeholderLabel={card.title}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-700">
                  {card.categoryLabel}
                </span>
                {card.unitaLabel && (
                  <span className="absolute bottom-3 left-3 z-10 rounded-full bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                    {card.unitaLabel}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 group-hover:text-brand-700">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">{card.spec}</p>
                <div className="mt-3 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tariffa giornaliera
                  </p>
                  <p className="text-2xl font-extrabold leading-none tracking-tight text-slate-900">
                    € {importo}
                    <span className="text-base font-semibold text-slate-600">/giorno</span>
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {PREZZO_IVA_DICITURA}
                  </p>
                  {card.promoLine && (
                    <p className="mt-1 text-xs text-emerald-700">{card.promoLine}</p>
                  )}
                  {card.notaCommerciale && (
                    <p className="mt-1.5 max-w-[16rem] text-xs leading-snug text-slate-500">
                      {card.notaCommerciale}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </div>
        );
      })}

      {hasMore && !expanded ? (
        <div key="fleet-mostra-tutti" className="flex flex-col gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-brand-300 hover:bg-slate-50"
          >
            Mostra tutti ({cards.length})
          </button>
          <Link
            href="/flotta"
            className="text-center text-sm font-semibold text-brand-600 hover:underline"
          >
            Vedi tutta la flotta →
          </Link>
        </div>
      ) : null}

      {expanded && hasMore ? (
        <div key="fleet-mostra-meno" className="md:hidden">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Mostra meno
          </button>
        </div>
      ) : null}

      {showWhatsAppCard ? (
        <div className="max-md:hidden sm:col-span-2 lg:col-span-2">
          <WhatsAppPreventivoCard headingId="whatsapp-preventivo-heading-desktop" />
        </div>
      ) : null}
    </div>
  );
}

