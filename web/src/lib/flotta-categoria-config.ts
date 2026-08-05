import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import { resolveMetadataTitle } from "@/lib/metadata-title";
import { fitSeoDescription, fitSeoTitle } from "@/lib/seo-limits";
import { FLOTTA_CATEGORIE_NAV } from "@/lib/nav-config";
import {
  TARIFFE_CATEGORIA,
  getNotaCauzione,
  getNotaKmInclusi,
  type TariffaCategoriaSlug,
} from "@/lib/tariffe-categoria";

export const FLOTTA_CATEGORIA_SLUGS = FLOTTA_CATEGORIE_NAV.map(
  (categoria) => categoria.slug,
) as TariffaCategoriaSlug[];

export function isFlottaCategoriaSlug(slug: string): slug is TariffaCategoriaSlug {
  return FLOTTA_CATEGORIA_SLUGS.includes(slug as TariffaCategoriaSlug);
}

export function flottaCategoriaCanonical(slug: TariffaCategoriaSlug): string {
  return canonicalUrl(`/flotta/${slug}`);
}

/** Immagini di fallback per le card hub (foto rappresentative LILO). */
export const FLOTTA_CATEGORIA_IMAGES: Record<TariffaCategoriaSlug, string> = {
  auto: "/images/veicoli/volvo-s40-noleggio-trieste.webp",
  "pulmini-9-posti": "/images/veicoli/renault-trafic-9-posti-noleggio-trieste.webp",
  "furgoni-piccoli":
    "/images/flotta/furgone-piccolo-toyota-proace-city-trieste-front.webp",
  "furgoni-medi":
    "/images/veicoli/ford-transit-custom-noleggio-trieste-viale-campi-elisi.webp",
  "furgoni-grandi":
    "/images/veicoli/ford-transit-gg551rd-noleggio-furgoni-grandi-trieste.webp",
  "furgoni-grandi-citta":
    "/images/flotta/furgone-grande-iveco-daily-l2h2-trieste-front.webp",
  "furgoni-xl": "/images/veicoli/furgone-peugeot-boxer-l3h3-trieste.webp",
};

interface CategoriaCopy {
  hubDescription: string;
  pageIntro: string;
  seoTitle: string;
  seoDescription: string;
}

export const FLOTTA_CATEGORIA_COPY: Record<TariffaCategoriaSlug, CategoriaCopy> = {
  auto: {
    hubDescription: "Mobilità urbana ed extraurbana con tariffe chiare e ritiro in sede a Trieste.",
    pageIntro:
      "Auto disponibili a noleggio a Trieste: ideali per spostamenti in città, viaggi brevi e sostituzione temporanea del proprio veicolo.",
    seoTitle: "Noleggio Auto Trieste | LILO S.r.l.",
    seoDescription:
      "Noleggio auto a Trieste con LILO S.r.l.: tariffe giornaliere IVA inclusa, ritiro in sede e cauzione flessibile per uso in città.",
  },
  "pulmini-9-posti": {
    hubDescription: "Per gruppi, eventi e trasferimenti fino a 9 passeggeri.",
    pageIntro:
      "Pulmini 9 posti a noleggio a Trieste: soluzione ideale per viaggi di gruppo, gite, eventi e trasferimenti con tutta la comodità di un unico mezzo.",
    seoTitle: "Noleggio Pulmini 9 Posti Trieste | LILO S.r.l.",
    seoDescription:
      "Noleggio pulmini 9 posti a Trieste con LILO S.r.l.: mezzi spaziosi per gruppi ed eventi, tariffe IVA inclusa e ritiro in sede.",
  },
  "furgoni-piccoli": {
    hubDescription: "Compatti e maneggevoli per lavoro e traslochi leggeri in città.",
    pageIntro:
      "Furgoni piccoli a noleggio a Trieste: perfetti per consegne urbane, piccoli traslochi e lavori artigianali con vano di carico pratico.",
    seoTitle: "Noleggio Furgoni Piccoli Trieste | LILO S.r.l.",
    seoDescription:
      "Noleggio furgoni piccoli a Trieste: mezzi compatti per lavoro e traslochi. Tariffe giornaliere IVA inclusa e ritiro in sede LILO.",
  },
  "furgoni-medi": {
    hubDescription: "L'equilibrio ideale tra capacità di carico e facilità di guida.",
    pageIntro:
      "Furgoni medi a noleggio a Trieste: la scelta più versatile per artigiani, commercianti e traslochi di media entità.",
    seoTitle: "Noleggio Furgoni Medi Trieste | LILO S.r.l.",
    seoDescription:
      "Noleggio furgoni medi a Trieste con LILO S.r.l.: capacità di carico generosa, tariffe giornaliere IVA inclusa e assistenza dedicata.",
  },
  "furgoni-grandi": {
    hubDescription: "Massimo spazio di carico per traslochi e trasporti professionali.",
    pageIntro:
      "Furgoni grandi a noleggio a Trieste: vano di carico ampio per traslochi, logistica e trasporto merci su lunga percorrenza.",
    seoTitle: "Noleggio Furgoni Grandi Trieste | LILO S.r.l.",
    seoDescription:
      "Noleggio furgoni grandi a Trieste: capacità di carico elevata per professionisti e privati. Tariffe IVA inclusa, ritiro in sede LILO.",
  },
  "furgoni-grandi-citta": {
    hubDescription:
      "Tariffa città Trieste (50 km) e unica categoria della Promo Weekend / Offerta del Mese.",
    pageIntro:
      "Furgoni grandi dedicati all'uso cittadino a Trieste: tariffa con 50 km inclusi. È l’unica categoria a cui si applica l’Offerta del Mese / Promo Weekend (48 ore sabato–lunedì a 83€).",
    seoTitle: "Noleggio Furgoni Grandi Uso Città Trieste | LILO",
    seoDescription:
      "Noleggio furgoni grandi uso città a Trieste: 50 km inclusi, cauzione flessibile e Promo Weekend 83€ IVA inclusa con LILO S.r.l.",
  },
  "furgoni-xl": {
    hubDescription: "La massima capacità per carichi voluminosi e trasporti speciali.",
    pageIntro:
      "Furgoni XL a noleggio a Trieste: la soluzione per chi necessita del massimo volume di carico e spazio utile.",
    seoTitle: "Noleggio Furgoni XL Trieste | LILO S.r.l.",
    seoDescription:
      "Noleggio furgoni XL a Trieste: massima capacità di carico per professionisti e traslochi. Tariffe IVA inclusa, flotta LILO, ritiro in sede.",
  },
};

export function getFlottaCategoriaNavLabel(slug: TariffaCategoriaSlug): string {
  return FLOTTA_CATEGORIE_NAV.find((categoria) => categoria.slug === slug)?.label ?? slug;
}

export function buildFlottaCategoriaMetadata(slug: TariffaCategoriaSlug): Metadata {
  const copy = FLOTTA_CATEGORIA_COPY[slug];
  const tariffa = TARIFFE_CATEGORIA[slug];
  const canonical = flottaCategoriaCanonical(slug);
  const ogImage = canonicalUrl(FLOTTA_CATEGORIA_IMAGES[slug]);
  const title = fitSeoTitle(copy.seoTitle, copy.seoTitle);
  const description = fitSeoDescription(copy.seoDescription, copy.seoDescription);

  return {
    title: resolveMetadataTitle(title),
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: "it_IT",
      siteName: "LILO S.r.l. — Autonoleggio Trieste",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    keywords: [
      getFlottaCategoriaNavLabel(slug).toLowerCase(),
      "noleggio trieste",
      `€${tariffa.prezzoGiornaliero} giorno`,
    ],
  };
}

export function getFlottaCategoriaTariffaNote(slug: TariffaCategoriaSlug): {
  prezzo: number;
  km: string;
  cauzione: string;
} {
  const tariffa = TARIFFE_CATEGORIA[slug];
  return {
    prezzo: tariffa.prezzoGiornaliero,
    km: getNotaKmInclusi(tariffa),
    cauzione: getNotaCauzione(tariffa),
  };
}
