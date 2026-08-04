import type { VeicoloPubblico } from "@/types/veicolo";

import type { SpecItem } from "@/lib/specifiche-tecniche-utils";

import {
  buildAutoCategorySpecs,
  buildCaratteristicheGenerali,
  buildCategorySpecificSpecs,
  buildDimensioniEsterne,
  buildFurgoneVanoInterno,
  buildPulminoCategorySpecs,
  getSpecificheSectionTitle,
  hasCategorySpecificSpecs,
  hasSpecificheTecniche,
  isAutoCategory,
  isFurgoneCategory,
  isPulminoCategory,
} from "@/lib/specifiche-tecniche-utils";

interface VeicoloSpecsProps {
  veicolo: VeicoloPubblico;
}

function buildBaseSpecs(veicolo: VeicoloPubblico): SpecItem[] {
  const items: SpecItem[] = [
    { label: "Categoria", value: veicolo.categoria?.nome ?? "—" },
    { label: "Marca", value: veicolo.marca },
    { label: "Modello", value: veicolo.modello },
  ];

  if (veicolo.versione) items.push({ label: "Versione", value: veicolo.versione });
  if (veicolo.alimentazione) items.push({ label: "Alimentazione", value: veicolo.alimentazione });
  if (veicolo.cambio) items.push({ label: "Cambio", value: veicolo.cambio });
  if (veicolo.posti) items.push({ label: "Posti", value: String(veicolo.posti) });
  if (veicolo.porte) items.push({ label: "Porte", value: String(veicolo.porte) });
  if (veicolo.colore) items.push({ label: "Colore", value: veicolo.colore });

  return items;
}

function SpecGrid({ items, highlighted = false }: { items: SpecItem[]; highlighted?: boolean }) {
  if (items.length === 0) return null;

  return (
    <dl
      className={
        highlighted
          ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          : "grid grid-cols-2 gap-3 sm:grid-cols-3"
      }
    >
      {items.map((spec) => (
        <div
          key={spec.label}
          className={
            spec.highlight || highlighted
              ? "rounded-xl border-2 border-brand-200 bg-brand-50/60 px-4 py-3 shadow-sm"
              : "rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          }
        >
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {spec.label}
          </dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SpecSection({ title, items, highlighted = false }: { title: string; items: SpecItem[]; highlighted?: boolean }) {
  if (items.length === 0) return null;

  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
        {title}
      </h3>
      <SpecGrid items={items} highlighted={highlighted} />
    </section>
  );
}

export function VeicoloSpecs({ veicolo }: VeicoloSpecsProps) {
  const spec = veicolo.specifiche_tecniche;
  const isFurgone = isFurgoneCategory(veicolo);
  const generali = buildCaratteristicheGenerali(spec);
  const esterne = buildDimensioniEsterne(spec);
  const vanoInterno = isFurgone ? buildFurgoneVanoInterno(spec) : [];

  const showCategoryBlock =
    !isFurgone && hasCategorySpecificSpecs(veicolo);
  const categorySpecs = buildCategorySpecificSpecs(veicolo);

  const showTechnicalExtras =
    hasSpecificheTecniche(spec) &&
    (generali.length > 0 || esterne.length > 0 || vanoInterno.length > 0);

  return (
    <div className="space-y-8">
      <section aria-labelledby="specs-heading">
        <h2 id="specs-heading" className="mb-4 text-lg font-semibold text-slate-900">
          Caratteristiche
        </h2>
        <SpecGrid items={buildBaseSpecs(veicolo)} />
      </section>

      {showCategoryBlock && (
        <section aria-labelledby="category-specs-heading">
          <h2 id="category-specs-heading" className="mb-4 text-lg font-semibold text-slate-900">
            {getSpecificheSectionTitle(veicolo)}
          </h2>
          <SpecGrid
            items={categorySpecs}
            highlighted={isAutoCategory(veicolo) || isPulminoCategory(veicolo)}
          />
        </section>
      )}

      {showTechnicalExtras && (
        <section aria-labelledby="tech-specs-heading" className="space-y-6">
          <h2 id="tech-specs-heading" className="text-lg font-semibold text-slate-900">
            Specifiche tecniche
          </h2>

          {generali.length > 0 && (
            <SpecSection title="Caratteristiche generali" items={generali} />
          )}

          {isFurgone ? (
            <>
              <SpecSection title="Dimensioni esterne" items={esterne} />
              <SpecSection title="Vano di carico interno" items={vanoInterno} highlighted />
            </>
          ) : (
            esterne.length > 0 && <SpecSection title="Dimensioni esterne" items={esterne} />
          )}
        </section>
      )}
    </div>
  );
}
