import Link from "next/link";
import {
  FleetPreviewGrid,
  type FleetPreviewCardData,
} from "@/components/home/FleetPreviewGrid";
import {
  FLOTTA_CATEGORIA_IMAGES,
  FLOTTA_CATEGORIA_SLUGS,
} from "@/lib/flotta-categoria-config";
import { pickCategoriaHubCover, pickCategoriaVetrinaVeicolo } from "@/lib/fleet-photo-utils";
import { flottaCategoriaHref } from "@/lib/nav-config";
import { labelPromoDurataSecondario } from "@/lib/promozioni-durata";
import { TARIFFE_CATEGORIA } from "@/lib/tariffe-categoria";
import {
  getDisplayName,
  getPrezzoCommercialNote,
  getPrezzoGiornaliero,
  getUnitaDisponibiliLabel,
  getVeicoloCardSpec,
  getVeicoloCoverAlt,
  getVeicoloCoverUrl,
  getVeicoloCoverFallbackUrl,
  getVeicoloImageVariant,
} from "@/lib/veicolo-utils";
import { getPublishedVeicoli } from "@/lib/veicoli";

export async function FleetPreviewSection() {
  const veicoli = await getPublishedVeicoli();

  const cards: FleetPreviewCardData[] = FLOTTA_CATEGORIA_SLUGS.map((slug) => {
    const tariffa = TARIFFE_CATEGORIA[slug];
    const veicolo = pickCategoriaVetrinaVeicolo(slug, veicoli);
    const href = veicolo ? `/flotta/${veicolo.slug}` : flottaCategoriaHref(slug);
    const cover = veicolo
      ? pickCategoriaHubCover(slug, veicoli, FLOTTA_CATEGORIA_IMAGES[slug]) ||
        getVeicoloCoverUrl(veicolo)
      : FLOTTA_CATEGORIA_IMAGES[slug];
    const fallback = veicolo
      ? getVeicoloCoverFallbackUrl(veicolo)
      : FLOTTA_CATEGORIA_IMAGES[slug];
    const title = veicolo ? getDisplayName(veicolo) : tariffa.label;
    const spec = veicolo ? getVeicoloCardSpec(veicolo) : "Tariffe giornaliere trasparenti";
    const alt = veicolo
      ? getVeicoloCoverAlt(veicolo)
      : `Noleggio ${tariffa.label} Trieste — LILO S.r.l.`;

    const listino = veicolo ? getPrezzoGiornaliero(veicolo) : null;
    const promo = veicolo?.prezzo_promo;
    const giornaliero = promo?.giornaliero ?? listino?.importo ?? null;

    return {
      id: slug,
      href,
      title,
      spec,
      alt,
      cover,
      fallback,
      categoryLabel: tariffa.label,
      variant: veicolo
        ? getVeicoloImageVariant(veicolo)
        : slug === "auto"
          ? "auto"
          : slug === "pulmini-9-posti"
            ? "pulmino"
            : "furgone",
      prezzoGiornaliero: giornaliero,
      promoLine: promo ? labelPromoDurataSecondario(promo) : null,
      notaCommerciale: veicolo ? getPrezzoCommercialNote(veicolo) : null,
      prezzoCategoriaFallback: tariffa.prezzoGiornaliero,
      unitaLabel: veicolo ? getUnitaDisponibiliLabel(veicolo) : null,
    };
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">La nostra flotta</h2>
          <p className="mt-1 text-slate-600">Auto e furgoni disponibili a noleggio a Trieste</p>
        </div>
        <Link
          href="/flotta"
          className="hidden text-sm font-semibold text-brand-600 hover:underline md:inline"
        >
          Vedi tutti →
        </Link>
      </div>

      <FleetPreviewGrid cards={cards} showWhatsAppCard />
    </section>
  );
}
