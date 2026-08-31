"use client";

import { Truck } from "lucide-react";

const GALLERY = [
  {
    id: "iveco",
    src: "/images/promo-weekend-iveco-daily-l2h2-trieste.webp",
    alt: "Noleggio Furgone Grande Iveco Daily L2H2 Trieste - Promo Weekend Lilo SRL",
  },
  {
    id: "transit",
    src: "/images/promo-weekend-ford-transit-l2h2-trieste.webp",
    alt: "Noleggio Furgone Grande Ford Transit Trieste - Promo Weekend Lilo SRL",
  },
  {
    id: "jumper",
    src: "/images/promo-weekend-citroen-jumper-l2h2-trieste.webp",
    alt: "Flotta Furgoni Grandi per Traslochi Trieste - Lilo SRL",
  },
] as const;

/** Tre foto una sopra l'altra nella colonna sinistra della Promo Weekend. */
export function PromoWeekendGallery() {
  return (
    <div className="flex h-full flex-col gap-1.5 bg-slate-950 p-1.5 sm:gap-2 sm:p-2">
      <p className="flex shrink-0 items-start gap-2 rounded-lg border border-lime-400/25 bg-slate-900/90 px-2.5 py-1.5 text-xs leading-snug text-lime-400 sm:text-sm">
        <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" strokeWidth={2} />
        <span>
          Modelli Furgone Grande in catalogo: Iveco Daily, Ford Transit, Citroën Jumper
        </span>
      </p>
      {GALLERY.map((item, index) => (
        <figure
          key={item.id}
          className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-slate-900"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={item.alt}
            width={1024}
            height={682}
            className="absolute inset-0 h-full w-full object-cover object-center"
            fetchPriority={index === 0 ? "high" : "auto"}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        </figure>
      ))}
    </div>
  );
}
