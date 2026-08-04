"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FLOTTA_CATEGORIE_NAV,
  flottaCategoriaHref,
} from "@/lib/nav-config";
import { FLOTTA_CATEGORIA_IMAGES } from "@/lib/flotta-categoria-config";
import { FLEET_VEHICLE_IMG } from "@/lib/fleet-photo-utils";
import { TARIFFE_CATEGORIA } from "@/lib/tariffe-categoria";
import type { TariffaCategoriaSlug } from "@/lib/tariffe-categoria";

/** Griglia categorie flotta — solo mobile, subito sotto l'hero. */
export function MobileFlottaCategoriaGrid() {
  return (
    <section
      className="border-b border-slate-200 bg-white px-4 py-6 md:hidden"
      aria-labelledby="mobile-flotta-categorie-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
        Flotta noleggio
      </p>
      <h2
        id="mobile-flotta-categorie-heading"
        className="mt-1 text-xl font-bold tracking-tight text-slate-900"
      >
        Scegli la categoria
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Tocca per vedere i mezzi e i prezzi a Trieste.
      </p>

      <ul className="mt-4 grid grid-cols-2 gap-2.5">
        {FLOTTA_CATEGORIE_NAV.map((cat) => {
          const slug = cat.slug as TariffaCategoriaSlug;
          const tariffa = TARIFFE_CATEGORIA[slug];
          const image = FLOTTA_CATEGORIA_IMAGES[slug];
          return (
            <li key={cat.slug}>
              <Link
                href={flottaCategoriaHref(cat.slug)}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition active:scale-[0.98]"
              >
                <div className="relative aspect-[16/10] bg-white">
                  <Image
                    src={image}
                    alt={`Noleggio ${cat.label} Trieste`}
                    fill
                    sizes="45vw"
                    className={FLEET_VEHICLE_IMG.categoryThumb}
                  />
                </div>
                <div className="flex flex-1 flex-col p-2.5">
                  <span className="text-sm font-bold leading-snug text-slate-900">
                    {cat.label}
                  </span>
                  {tariffa && (
                    <span className="mt-0.5 text-xs font-semibold text-brand-700">
                      da €{tariffa.prezzoGiornaliero}/giorno
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href="/flotta"
        className="mt-4 block text-center text-sm font-semibold text-brand-600 hover:underline"
      >
        Vedi tutta la flotta →
      </Link>
    </section>
  );
}
