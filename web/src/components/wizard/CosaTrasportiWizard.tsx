"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  COSA_TRASPORTI_USE_CASES,
  type CosaTrasportiCandidate,
  type CosaTrasportiId,
} from "@/lib/cosa-trasporti";
import { CosaTrasportiIcon } from "@/components/wizard/CosaTrasportiIcons";

export type CosaTrasportiRecommendations = Record<
  CosaTrasportiId,
  CosaTrasportiCandidate[]
>;

interface CosaTrasportiWizardProps {
  recommendations: CosaTrasportiRecommendations;
  compact?: boolean;
}

function formatMc(v: number): string {
  return String(v).replace(".", ",");
}

export function CosaTrasportiWizard({
  recommendations,
  compact = false,
}: CosaTrasportiWizardProps) {
  const [selected, setSelected] = useState<CosaTrasportiId | null>(null);

  const results = useMemo(() => {
    if (!selected) return [];
    return recommendations[selected] ?? [];
  }, [recommendations, selected]);

  const selectedUseCase = COSA_TRASPORTI_USE_CASES.find((u) => u.id === selected);

  return (
    <div>
      <div
        className={`grid gap-2 ${compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}
        role="listbox"
        aria-label="Cosa trasporti"
      >
        {COSA_TRASPORTI_USE_CASES.map((useCase) => {
          const isActive = selected === useCase.id;
          return (
            <button
              key={useCase.id}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => setSelected(useCase.id)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                isActive
                  ? "border-brand-500 bg-brand-50 shadow-sm ring-1 ring-brand-500"
                  : "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50"
              }`}
            >
              <CosaTrasportiIcon id={useCase.id} active={isActive} />
              <span className="block text-sm font-semibold text-slate-900">{useCase.label}</span>
              <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                {useCase.descrizione}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-8" aria-live="polite">
          <h3 className="text-lg font-semibold text-slate-900">
            {selectedUseCase
              ? `Consigliati per: ${selectedUseCase.label}`
              : "Veicoli consigliati"}
          </h3>
          {selectedUseCase && (
            <p className="mt-1 text-sm text-slate-600">{selectedUseCase.perché}</p>
          )}

          {results.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
              Nessun furgone in flotta corrisponde bene a questo carico.{" "}
              <Link href="/contatti" className="font-semibold text-brand-600 hover:underline">
                Contattaci
              </Link>{" "}
              e ti aiutiamo a scegliere.
            </p>
          ) : (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {results.map((item) => (
                <li key={item.slug}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative aspect-[16/10] bg-slate-100">
                      {item.coverUrl ? (
                        <Image
                          src={item.coverUrl}
                          alt={`Noleggio ${item.name} Trieste`}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {item.categoriaNome ?? "Furgone"}
                      </p>
                      <h4 className="mt-1 text-base font-bold text-slate-900">{item.name}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.motivo}</p>
                      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        {item.volumeMc != null && (
                          <div>
                            <dt className="inline">Volume: </dt>
                            <dd className="inline font-semibold text-slate-700">
                              {formatMc(item.volumeMc)} m³
                            </dd>
                          </div>
                        )}
                        {item.altezzaVanoMm != null && (
                          <div>
                            <dt className="inline">Altezza: </dt>
                            <dd className="inline font-semibold text-slate-700">
                              {item.altezzaVanoMm} mm
                            </dd>
                          </div>
                        )}
                        {item.portataKg != null && (
                          <div>
                            <dt className="inline">Portata: </dt>
                            <dd className="inline font-semibold text-slate-700">
                              {item.portataKg} kg
                            </dd>
                          </div>
                        )}
                      </dl>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {item.prezzoDa != null && (
                          <div>
                            <p className="text-sm text-slate-700">
                              <span className="text-lg font-extrabold text-slate-900">
                                €{Math.round(item.prezzoDa)}
                              </span>
                              /giorno
                            </p>
                            {item.prezzoPromoLine && (
                              <p className="text-xs text-emerald-700">{item.prezzoPromoLine}</p>
                            )}
                          </div>
                        )}
                        <Link
                          href={`/flotta/${item.slug}`}
                          className="ml-auto inline-flex rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                        >
                          Vedi scheda
                        </Link>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}

          {selected === "moto" && (
            <p className="mt-4 text-sm text-slate-600">
              Il <span className="font-semibold text-slate-800">Fiat Ducato</span> ha la rampa moto
              dedicata. Sugli altri furgoni puoi aggiungere l’extra{" "}
              <span className="font-semibold text-slate-800">Rampa carico moto</span> nel preventivo.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
