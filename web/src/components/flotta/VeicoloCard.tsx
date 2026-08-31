"use client";

import Link from "next/link";
import { VeicoloCoverImage } from "@/components/flotta/VeicoloCoverImage";
import { VeicoloPrezzoBlock } from "@/components/flotta/VeicoloPrezzoBlock";
import {
  getDisplayName,
  getUnitaDisponibiliLabel,
  getVeicoloCardBadges,
  getVeicoloCardSpec,
  getVeicoloCoverAlt,
  getVeicoloCoverUrl,
  getVeicoloCoverFallbackUrl,
  getVeicoloImageVariant,
} from "@/lib/veicolo-utils";
import { resolvePublicVeicoloSlug } from "@/lib/veicolo-slug-renames";
import type { VeicoloPubblico } from "@/types/veicolo";

interface VeicoloCardProps {
  veicolo: VeicoloPubblico;
}

export function VeicoloCard({ veicolo }: VeicoloCardProps) {
  const name = getDisplayName(veicolo);
  const spec = getVeicoloCardSpec(veicolo);
  const badges = getVeicoloCardBadges(veicolo);
  const unitaLabel = getUnitaDisponibiliLabel(veicolo);
  const coverUrl = getVeicoloCoverUrl(veicolo);
  const coverFallbackUrl = getVeicoloCoverFallbackUrl(veicolo);
  const coverAlt = getVeicoloCoverAlt(veicolo);
  const imageVariant = getVeicoloImageVariant(veicolo);
  const href = `/flotta/${resolvePublicVeicoloSlug(veicolo.slug)}`;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-brand-200 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      aria-label={
        unitaLabel ? `${name} — ${unitaLabel}` : `${name} — visualizza dettagli`
      }
    >
      <article className="flex h-full flex-col">
        <div className="relative">
          <VeicoloCoverImage
            src={coverUrl}
            fallbackSrc={
              coverFallbackUrl && coverFallbackUrl !== coverUrl ? coverFallbackUrl : null
            }
            alt={coverAlt}
            variant={imageVariant}
            placeholderLabel={`${veicolo.marca} ${veicolo.modello}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {veicolo.categoria && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              {veicolo.categoria.nome}
            </span>
          )}
          {unitaLabel && (
            <span className="absolute bottom-3 left-3 z-10 rounded-full bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              {unitaLabel}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h2 className="line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-snug text-slate-900 group-hover:text-brand-700">
            {name}
          </h2>

          {badges.length > 0 && (
            <ul
              className="mt-2 flex min-h-[1.5rem] flex-wrap gap-1.5"
              aria-label="Caratteristiche principali"
            >
              {badges.map((badge) => (
                <li
                  key={badge}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                >
                  {badge}
                </li>
              ))}
            </ul>
          )}

          <div className="flex-1" aria-hidden="true" />

          <p className="min-h-[1.25rem] text-sm font-medium text-slate-600">
            {spec || "\u00a0"}
          </p>

          <div className="mt-3 border-t border-slate-100 pt-4">
            <div className="flex flex-col gap-3">
              <VeicoloPrezzoBlock veicolo={veicolo} />

              <span className="w-full rounded-xl bg-brand-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition group-hover:bg-brand-700">
                Visualizza Dettagli
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
