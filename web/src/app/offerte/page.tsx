import type { Metadata } from "next";
import Link from "next/link";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import { getPageMetadata } from "@/lib/seo-settings";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { PromoWeekendCard } from "@/components/offerte/PromoWeekendCard";
import { VeicoloFaq } from "@/components/flotta/VeicoloFaq";
import { buildOfferteJsonLd } from "@/lib/json-ld";
import { resolveMetadataTitle } from "@/lib/metadata-title";
import { SITE_URL } from "@/lib/constants";
import {
  OFFERTA_PROMO_CATEGORIA_HREF,
  OFFERTA_PROMO_CATEGORIA_LABEL,
} from "@/lib/offerta-promo";
import type { AiFaqItem } from "@/types/veicolo";

export const dynamic = "force-dynamic";

const PROMO_WEEKEND_FAQ: AiFaqItem[] = [
  {
    q: "Quanto costa noleggiare un furgone per il weekend a Trieste?",
    a: `Da LILO S.r.l. a Trieste il noleggio weekend (Sabato 08:30 → Lunedì 08:30) costa 83€ IVA inclusa con 75 km inclusi, ed è riservato esclusivamente alla categoria ${OFFERTA_PROMO_CATEGORIA_LABEL}.`,
  },
  {
    q: "Su quali veicoli vale l’Offerta del Mese / Promo Weekend?",
    a: `Solo sui ${OFFERTA_PROMO_CATEGORIA_LABEL} (configurazione L2H2). Non si applica alle altre categorie della flotta (auto, furgoni piccoli/medi/grandi standard, XL, pulmini).`,
  },
  {
    q: "Serve la carta di credito per la Promo Weekend Furgone?",
    a: "No, con LILO S.r.l. puoi noleggiare il furgone per il tuo trasloco nel fine settimana anche senza carta di credito.",
  },
];

const META_TITLE = "Noleggio Furgone Weekend Trieste 83€ | LILO";
const META_DESCRIPTION =
  "Promo Weekend furgoni grandi uso città a Trieste: sabato–lunedì a 83€ IVA inclusa, 75 km. Paghi 1 giorno e mezzo, tieni il mezzo 48 ore.";
const OG_IMAGE = `${SITE_URL}/images/promo-weekend-iveco-daily-l2h2-trieste.webp`;

export async function generateMetadata(): Promise<Metadata> {
  const base = await getPageMetadata("offerte");
  return {
    ...base,
    title: resolveMetadataTitle(META_TITLE),
    description: META_DESCRIPTION,
    keywords: [
      "noleggio furgone weekend trieste",
      "furgoni grandi uso città",
      "promo trasloco weekend",
      "furgone grande L2H2",
      "noleggio senza carta di credito trieste",
      "offerta weekend LILO",
    ],
    openGraph: {
      ...base.openGraph,
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: [
        {
          url: OG_IMAGE,
          alt: "Noleggio Furgone Grande Uso Città Iveco Daily L2H2 Trieste - Promo Weekend Lilo SRL",
        },
      ],
    },
    twitter: {
      ...base.twitter,
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: [OG_IMAGE],
    },
  };
}

export default async function OffertePage() {
  const impostazioni = await loadImpostazioni();
  const jsonLd = buildOfferteJsonLd(PROMO_WEEKEND_FAQ);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SitePageWrapper impostazioni={impostazioni}>
        <main className="mx-auto max-w-5xl px-4 pb-10 pt-10 sm:pb-14 sm:pt-14">
          <header className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#84CC16]">
              LILO Autonoleggio Trieste
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {impostazioni.offerta_titolo}
            </h1>
            {!impostazioni.offerta_attiva ? (
              <p className="mt-4 leading-relaxed text-slate-600">
                Al momento non ci sono promozioni attive. Contattaci al{" "}
                <PhoneLink
                  phone={impostazioni.telefono_noleggio}
                  className="font-semibold text-brand-600 hover:underline"
                >
                  {impostazioni.telefono_noleggio}
                </PhoneLink>{" "}
                per un preventivo personalizzato o consulta la flotta online.
              </p>
            ) : (
              <p className="mt-4 leading-relaxed text-slate-600">
                {impostazioni.offerta_descrizione} Valida esclusivamente sulla categoria{" "}
                <Link
                  href={OFFERTA_PROMO_CATEGORIA_HREF}
                  className="font-semibold text-brand-600 hover:underline"
                >
                  {OFFERTA_PROMO_CATEGORIA_LABEL}
                </Link>
                . Prenota al{" "}
                <PhoneLink
                  phone={impostazioni.telefono_noleggio}
                  className="font-semibold text-brand-600 hover:underline"
                >
                  {impostazioni.telefono_noleggio}
                </PhoneLink>
                .
              </p>
            )}
          </header>

          {impostazioni.offerta_attiva ? (
            <div className="mt-10 space-y-10">
              <PromoWeekendCard phone={impostazioni.telefono_noleggio} />
              <VeicoloFaq items={PROMO_WEEKEND_FAQ} />
            </div>
          ) : null}

          <Link
            href={OFFERTA_PROMO_CATEGORIA_HREF}
            className="mt-8 inline-block font-semibold text-[#84CC16] hover:underline"
          >
            Vedi i {OFFERTA_PROMO_CATEGORIA_LABEL} →
          </Link>
        </main>
      </SitePageWrapper>
    </>
  );
}
