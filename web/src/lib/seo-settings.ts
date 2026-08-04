import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import { createPublicClient, isSupabaseConfigured } from "@/lib/supabase";
import { isDemoMode } from "@/lib/demo-veicolo";
import { canonicalUrl, parseRobots } from "@/lib/seo";
import { resolveMetadataTitle } from "@/lib/metadata-title";
import { SITE_URL } from "@/lib/constants";
import type { SeoPageKey, SeoSettings } from "@/types/seo";
import { SEO_PAGE_PATHS } from "@/types/seo";

const DEMO_SEO: Record<SeoPageKey, SeoSettings> = {
  home: {
    page_key: "home",
    seo_title: "Noleggio Furgoni e Auto a Trieste | LILO S.r.l.",
    seo_description:
      "Noleggio auto e furgoni a Trieste: flotta moderna, tariffe trasparenti, ritiro in sede. LILO S.r.l. dal 2003 al servizio di privati e aziende.",
    seo_keywords: ["noleggio auto trieste", "noleggio furgoni trieste", "autonoleggio trieste", "LILO S.r.l."],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    updated_at: "",
  },
  flotta: {
    page_key: "flotta",
    seo_title: "Flotta Noleggio Furgoni e Auto a Trieste | Lilo Srl",
    seo_description:
      "Scopri la flotta LILO S.r.l. a Trieste: auto, pulmini 9 posti e furgoni da piccoli a XL. Tariffe trasparenti, ritiro in sede.",
    seo_keywords: ["flotta noleggio trieste", "furgoni noleggio", "pulmini 9 posti trieste"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    updated_at: "",
  },
  autolavaggio: {
    page_key: "autolavaggio",
    seo_title: "Autolavaggio Trieste | LILO S.r.l.",
    seo_description:
      "Autolavaggio self-service e professionale a Trieste. Lavaggio interno ed esterno, ingresso Via Schiaparelli, uscita Via De Coletti.",
    seo_keywords: ["autolavaggio trieste", "lavaggio auto trieste", "LILO autolavaggio"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    updated_at: "",
  },
  tariffe: {
    page_key: "tariffe",
    seo_title: "Prezzi Noleggio Auto e Furgoni Trieste | LILO S.r.l.",
    seo_description:
      "Listino prezzi noleggio auto e furgoni a Trieste aggiornato dalla flotta LILO. Tariffe giornaliere trasparenti.",
    seo_keywords: ["prezzi noleggio furgoni trieste", "tariffe autonoleggio trieste"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    updated_at: "",
  },
  offerte: {
    page_key: "offerte",
    seo_title: "Noleggio Furgone Uso Città Weekend Trieste da 83€ | Promo LILO",
    seo_description:
      "Promo Weekend riservata ai Furgoni grandi (uso città): dal sabato al lunedì a 83€ IVA inclusa. Paghi 1 giorno e mezzo, tieni il mezzo 48 ore!",
    seo_keywords: [
      "noleggio furgone weekend trieste",
      "furgoni grandi uso città",
      "promo trasloco weekend",
      "furgone grande L2H2",
      "offerta weekend LILO",
    ],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: "Noleggio Furgone Uso Città Weekend Trieste da 83€ | Promo LILO",
    og_description:
      "Promo Weekend riservata ai Furgoni grandi (uso città): dal sabato al lunedì a 83€ IVA inclusa. Paghi 1 giorno e mezzo, tieni il mezzo 48 ore!",
    updated_at: "",
  },
  "chi-siamo": {
    page_key: "chi-siamo",
    seo_title: "Chi Siamo — LILO SRL | 20 Anni di Esperienza a Trieste",
    seo_description:
      "Dal 2003 LILO S.r.l. è leader a Trieste in trasporti, noleggio furgoni e auto, autolavaggio professionale.",
    seo_keywords: ["LILO S.r.l.", "noleggio trieste", "trasporti trieste"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    updated_at: "",
  },
  contatti: {
    page_key: "contatti",
    seo_title: "Contatti — LILO Autonoleggio Trieste",
    seo_description:
      "Contatta LILO S.r.l. per noleggio auto e furgoni a Trieste. Telefono, email, sede in Viale Campi Elisi.",
    seo_keywords: ["contatti LILO trieste", "noleggio auto trieste contatti"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    updated_at: "",
  },
  privacy: {
    page_key: "privacy",
    seo_title: "Privacy Policy | LILO S.r.l. Autonoleggio Trieste",
    seo_description:
      "Informativa privacy e trattamento dati personali di LILO S.r.l. — noleggio auto e furgoni a Trieste.",
    seo_keywords: ["privacy LILO", "GDPR autonoleggio trieste"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    updated_at: "",
  },
  "cookie-policy": {
    page_key: "cookie-policy",
    seo_title: "Cookie Policy | LILO S.r.l.",
    seo_description:
      "Informativa sui cookie utilizzati dal sito LILO S.r.l. e gestione del consenso.",
    seo_keywords: ["cookie policy", "consenso cookie LILO"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    updated_at: "",
  },
  "termini-condizioni": {
    page_key: "termini-condizioni",
    seo_title: "Termini e Condizioni | LILO Autonoleggio Trieste",
    seo_description:
      "Termini e condizioni di utilizzo del sito e dei servizi di noleggio veicoli LILO S.r.l. a Trieste.",
    seo_keywords: ["termini noleggio", "condizioni LILO trieste"],
    meta_robots: "index, follow",
    canonical_url: null,
    og_title: null,
    og_description: null,
    updated_at: "",
  },
};

export async function getSeoSettings(pageKey: SeoPageKey): Promise<SeoSettings> {
  if (isDemoMode() || !isSupabaseConfigured()) {
    return { ...DEMO_SEO[pageKey] };
  }

  return unstable_cache(
    async () => {
      try {
        const supabase = createPublicClient();
        const { data, error } = await supabase
          .from("seo_settings")
          .select(
            "page_key, seo_title, seo_description, seo_keywords, meta_robots, canonical_url, og_title, og_description, updated_at",
          )
          .eq("page_key", pageKey)
          .maybeSingle();

        if (error || !data) {
          console.error("[seo_settings]", error?.message ?? "missing row");
          return { ...DEMO_SEO[pageKey] };
        }

        return data as SeoSettings;
      } catch (err) {
        console.error("[seo_settings]", err);
        return { ...DEMO_SEO[pageKey] };
      }
    },
    ["seo-settings", pageKey],
    { revalidate: 300 },
  )();
}

export function buildPageMetadata(seo: SeoSettings, pageKey?: SeoPageKey): Metadata {
  const path = pageKey ? SEO_PAGE_PATHS[pageKey] : "/";
  const canonical = seo.canonical_url ?? canonicalUrl(path);
  const title = seo.seo_title;
  const description = seo.seo_description;
  const ogTitle = seo.og_title ?? title;
  const ogDescription = seo.og_description ?? description;

  return {
    title: resolveMetadataTitle(title),
    description,
    keywords: seo.seo_keywords,
    alternates: { canonical },
    robots: parseRobots(seo.meta_robots),
    openGraph: {
      type: "website",
      locale: "it_IT",
      url: canonical,
      siteName: "LILO S.r.l. — Autonoleggio Trieste",
      title: ogTitle,
      description: ogDescription,
      images: [{ url: `${SITE_URL}/logo-lilo.jpg`, alt: "LILO S.R.L." }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [`${SITE_URL}/logo-lilo.jpg`],
    },
    other: {
      "geo.region": "IT-TS",
      "geo.placename": "Trieste",
    },
  };
}

export async function getPageMetadata(pageKey: SeoPageKey): Promise<Metadata> {
  const seo = await getSeoSettings(pageKey);
  return buildPageMetadata(seo, pageKey);
}
