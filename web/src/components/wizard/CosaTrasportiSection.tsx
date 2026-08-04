import Link from "next/link";
import {
  CosaTrasportiWizard,
  type CosaTrasportiRecommendations,
} from "@/components/wizard/CosaTrasportiWizard";
import {
  COSA_TRASPORTI_USE_CASES,
  matchCosaTrasporti,
  type CosaTrasportiId,
} from "@/lib/cosa-trasporti";
import { getPublishedVeicoli } from "@/lib/veicoli";

async function loadRecommendations(): Promise<CosaTrasportiRecommendations> {
  const veicoli = await getPublishedVeicoli();
  const entries = COSA_TRASPORTI_USE_CASES.map((useCase) => {
    const id = useCase.id as CosaTrasportiId;
    return [id, matchCosaTrasporti(veicoli, id, 2)] as const;
  });
  return Object.fromEntries(entries) as CosaTrasportiRecommendations;
}

interface CosaTrasportiSectionProps {
  /** Link alla pagina dedicata (home). */
  showPageLink?: boolean;
  compact?: boolean;
}

export async function CosaTrasportiSection({
  showPageLink = true,
  compact = false,
}: CosaTrasportiSectionProps) {
  const recommendations = await loadRecommendations();

  return (
    <section
      className="border-y border-slate-200 bg-gradient-to-b from-slate-50 to-white py-14 sm:py-16"
      aria-labelledby="cosa-trasporti-heading"
      id="cosa-trasporti"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
            Guida al mezzo giusto
          </p>
          <h2
            id="cosa-trasporti-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Cosa trasporti?
          </h2>
          <p className="mt-2 text-base leading-relaxed text-slate-600">
            Non partire dalla categoria: dimmi il carico (frigo, armadio, trasloco, moto…) e ti
            proponiamo i furgoni più adatti, in base a volume, altezza vano e portata reali.
          </p>
          {showPageLink && (
            <p className="mt-3">
              <Link
                href="/cosa-trasporti"
                className="text-sm font-semibold text-brand-600 hover:underline"
              >
                Apri la guida completa →
              </Link>
            </p>
          )}
        </div>

        <CosaTrasportiWizard recommendations={recommendations} compact={compact} />
      </div>
    </section>
  );
}
