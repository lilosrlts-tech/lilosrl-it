import Link from "next/link";
import { FlottaHubCategoryImage } from "@/components/flotta/VeicoloCoverImage";
import { pickCategoriaHubCover } from "@/lib/fleet-photo-utils";
import {
  FLOTTA_CATEGORIA_COPY,
  FLOTTA_CATEGORIA_IMAGES,
  FLOTTA_CATEGORIA_SLUGS,
} from "@/lib/flotta-categoria-config";
import { COMPANY } from "@/lib/constants";
import { flottaCategoriaHref } from "@/lib/nav-config";
import { PREZZO_IVA_DICITURA, TARIFFE_CATEGORIA } from "@/lib/tariffe-categoria";
import type { VeicoloPubblico } from "@/types/veicolo";

interface FlottaHubProps {
  veicoli: VeicoloPubblico[];
}

const CARD_SHELL =
  "flex w-full max-w-md sm:max-w-none sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]";

export function FlottaHub({ veicoli }: FlottaHubProps) {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-6">
      {FLOTTA_CATEGORIA_SLUGS.map((slug, index) => {
        const count = veicoli.filter((veicolo) => veicolo.categoria?.slug === slug).length;
        const tariffa = TARIFFE_CATEGORIA[slug];
        const copy = FLOTTA_CATEGORIA_COPY[slug];
        const cover = pickCategoriaHubCover(slug, veicoli, FLOTTA_CATEGORIA_IMAGES[slug]);
        const href = flottaCategoriaHref(slug);

        return (
          <article
            key={slug}
            className={`${CARD_SHELL} group flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-brand-200 hover:shadow-lg`}
          >
            <Link href={href} className="relative block overflow-hidden">
              <FlottaHubCategoryImage
                src={cover}
                alt={`Noleggio ${tariffa.label} Trieste — ${COMPANY.name}`}
                priority={index < 2}
              />
              <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                {count === 1 ? "1 veicolo" : `${count} veicoli`}
              </span>
            </Link>

            <div className="flex flex-1 flex-col p-5">
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-700">
                <Link href={href}>{tariffa.label}</Link>
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {copy.hubDescription}
              </p>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  A partire da
                </p>
                <p className="text-2xl font-extrabold text-brand-700">
                  € {tariffa.prezzoGiornaliero}
                  <span className="text-base font-semibold text-slate-600"> / giorno</span>
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {PREZZO_IVA_DICITURA}
                </p>
                <Link
                  href={href}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Vedi veicoli
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
