import { createPublicClient, logSupabaseError } from "@/lib/supabase";
import { DEMO_SLUGS, DEMO_VEICOLI, DEMO_CATEGORIE, isDemoMode } from "@/lib/demo-veicolo";
import { enrichVeicoloMedia } from "@/lib/fleet-image-url";
import {
  applyFleetSpecToSpecifiche,
  syncPortataHighlight,
} from "@/lib/fleet-vehicle-specs";
import { getAccessoriForVeicolo } from "@/lib/accessori";
import {
  getPromozioniDurataAttive,
  resolvePrezzoConPromo,
} from "@/lib/promozioni-durata";
import { mapSpecificheFromRaw } from "@/lib/specifiche-tecniche-utils";
import { resolveUnitaDisponibili } from "@/lib/unita-disponibili";
import { getPrezzoGiornaliero } from "@/lib/veicolo-utils";
import type { AiFaqItem, CategoriaPubblica, SpecificheTecniche, VeicoloPubblico } from "@/types/veicolo";

export {
  getCoverImage,
  getDisplayName,
  getPrezzoGiornaliero,
  getVeicoloCardSpec,
} from "@/lib/veicolo-utils";
export type { PrezzoGiornaliero } from "@/lib/veicolo-utils";

const VEICOLO_SELECT = `
  id, slug, targa, marca, modello, versione,
  anno_immatricolazione, colore, alimentazione, cambio, posti, porte,
  unita_disponibili,
  promo_durata_attiva,
  volume_metri_cubi, portata_utile_kg, lunghezza_vano_mm, larghezza_vano_mm, altezza_vano_mm,
  larghezza_tra_passaruota_mm,
  capacita_bagagliaio_valigie, classe_ambientale, connessione_smartphone,
  configurazione_sedili, climatizzazione_posteriore,
  portata_kg, volume_carico_mc, trazione, passo, tetto, sensori_parcheggio,
  lunghezza_mm, larghezza_mm, altezza_mm,
  vano_lunghezza_mm, vano_larghezza_mm, vano_altezza_mm,
  titolo_pubblico, sottotitolo, descrizione_breve, descrizione_completa,
  seo_title, seo_description, seo_keywords, meta_robots, canonical_url,
  og_title, og_description, og_image_url, twitter_title, twitter_description,
  json_ld, ai_summary, ai_highlights, ai_faq, ai_context,
  categoria:categorie!inner(id, nome, slug),
  prezzi(tipo_tariffa, importo, valuta, descrizione, attivo),
  foto(id, url_pubblico, alt_text, titolo, didascalia, ordine, is_copertina)
`;

function normalizeFaq(raw: unknown): AiFaqItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is AiFaqItem => {
      return (
        typeof item === "object" &&
        item !== null &&
        "q" in item &&
        "a" in item &&
        typeof (item as AiFaqItem).q === "string"
      );
    })
    .map((item) => ({ q: item.q, a: item.a }));
}

/** Integra specifiche demo solo per campi ancora vuoti nel record DB. */
function enrichSpecificheFromDemo(
  slug: string,
  specifiche: SpecificheTecniche,
): SpecificheTecniche {
  const demo = DEMO_VEICOLI.find((v) => v.slug === slug);
  if (!demo) return specifiche;

  const merged = { ...specifiche };
  for (const key of Object.keys(demo.specifiche_tecniche) as (keyof SpecificheTecniche)[]) {
    const demoValue = demo.specifiche_tecniche[key];
    if (merged[key] == null && demoValue != null) {
      (merged as Record<keyof SpecificheTecniche, SpecificheTecniche[keyof SpecificheTecniche]>)[key] =
        demoValue;
    }
  }
  return merged;
}

function mapVeicolo(raw: Record<string, unknown>): VeicoloPubblico {
  const categoria = raw.categoria as VeicoloPubblico["categoria"];
  const prezziRaw = (raw.prezzi as Array<Record<string, unknown>>) ?? [];
  const fotoRaw = (raw.foto as Array<Record<string, unknown>>) ?? [];
  const slug = String(raw.slug);
  const targa = String(raw.targa);

  const specifiche = applyFleetSpecToSpecifiche(
    targa,
    slug,
    enrichSpecificheFromDemo(slug, mapSpecificheFromRaw(raw)),
  );

  const highlights = syncPortataHighlight(
    (raw.ai_highlights as string[]) ?? [],
    specifiche.portata_utile_kg,
  );

  return enrichVeicoloMedia({
    id: String(raw.id),
    slug,
    targa,
    marca: String(raw.marca),
    modello: String(raw.modello),
    versione: (raw.versione as string) ?? null,
    anno_immatricolazione: (raw.anno_immatricolazione as number) ?? null,
    colore: (raw.colore as string) ?? null,
    alimentazione: (raw.alimentazione as string) ?? null,
    cambio: (raw.cambio as string) ?? null,
    posti: (raw.posti as number) ?? null,
    porte: (raw.porte as number) ?? null,
    titolo_pubblico: (raw.titolo_pubblico as string) ?? null,
    sottotitolo: (raw.sottotitolo as string) ?? null,
    descrizione_breve: (raw.descrizione_breve as string) ?? null,
    descrizione_completa: (raw.descrizione_completa as string) ?? null,
    seo_title: (raw.seo_title as string) ?? null,
    seo_description: (raw.seo_description as string) ?? null,
    seo_keywords: (raw.seo_keywords as string[]) ?? [],
    meta_robots: (raw.meta_robots as string) ?? null,
    canonical_url: (raw.canonical_url as string) ?? null,
    og_title: (raw.og_title as string) ?? null,
    og_description: (raw.og_description as string) ?? null,
    og_image_url: (raw.og_image_url as string) ?? null,
    twitter_title: (raw.twitter_title as string) ?? null,
    twitter_description: (raw.twitter_description as string) ?? null,
    json_ld: (raw.json_ld as Record<string, unknown>) ?? null,
    ai_summary: (raw.ai_summary as string) ?? null,
    ai_highlights: highlights,
    ai_faq: normalizeFaq(raw.ai_faq),
    ai_context: (raw.ai_context as string) ?? null,
    categoria: categoria ?? null,
    unita_disponibili: resolveUnitaDisponibili(
      slug,
      raw.unita_disponibili as number | null | undefined,
    ),
    promo_durata_attiva: raw.promo_durata_attiva !== false,
    specifiche_tecniche: specifiche,
    prezzi: prezziRaw
      .filter((p) => p.attivo !== false)
      .map((p) => ({
        tipo_tariffa: String(p.tipo_tariffa),
        importo: Number(p.importo),
        valuta: String(p.valuta ?? "EUR"),
        descrizione: (p.descrizione as string) ?? null,
      })),
    foto: fotoRaw
      .sort((a, b) => Number(a.ordine) - Number(b.ordine))
      .map((f) => ({
        id: String(f.id),
        url_pubblico: String(f.url_pubblico),
        alt_text: String(f.alt_text),
        titolo: (f.titolo as string) ?? null,
        didascalia: (f.didascalia as string) ?? null,
        ordine: Number(f.ordine),
        is_copertina: Boolean(f.is_copertina),
      })),
    accessori: [],
  });
}

/** Integra veicoli locali (foto reali / demo) solo in modalità demo esplicita. */
function supplementWithDemoVeicoli(dbVeicoli: VeicoloPubblico[]): VeicoloPubblico[] {
  if (isDemoMode()) {
    const dbSlugs = new Set(dbVeicoli.map((v) => v.slug));
    const supplemented = [...dbVeicoli];
    for (const demo of DEMO_VEICOLI) {
      if (dbSlugs.has(demo.slug)) continue;
      supplemented.push(withUnita(enrichVeicoloMedia(demo)));
      dbSlugs.add(demo.slug);
    }
    return supplemented.sort((a, b) => {
      const ordA = DEMO_CATEGORIE.findIndex((c) => c.slug === a.categoria?.slug);
      const ordB = DEMO_CATEGORIE.findIndex((c) => c.slug === b.categoria?.slug);
      if (ordA !== ordB) return (ordA === -1 ? 99 : ordA) - (ordB === -1 ? 99 : ordB);
      return a.slug.localeCompare(b.slug, "it");
    });
  }
  return dbVeicoli;
}

function withUnita(veicolo: VeicoloPubblico): VeicoloPubblico {
  return {
    ...veicolo,
    unita_disponibili: resolveUnitaDisponibili(veicolo.slug, veicolo.unita_disponibili),
  };
}

async function withPrezzoPromo(veicolo: VeicoloPubblico): Promise<VeicoloPubblico> {
  const base = getPrezzoGiornaliero(veicolo);
  if (!base) return { ...veicolo, prezzo_promo: null };

  const regole =
    veicolo.promo_durata_attiva === false ? [] : await getPromozioniDurataAttive();
  const prezzo_promo = resolvePrezzoConPromo(
    base.importo,
    base.valuta,
    veicolo.promo_durata_attiva !== false,
    regole,
  );

  return {
    ...veicolo,
    prezzo_promo: {
      ...prezzo_promo,
      regolaMigliore: prezzo_promo.regolaMigliore
        ? {
            id: prezzo_promo.regolaMigliore.id,
            nome: prezzo_promo.regolaMigliore.nome,
            descrizione_pubblica: prezzo_promo.regolaMigliore.descrizione_pubblica,
            giorni_minimo: prezzo_promo.regolaMigliore.giorni_minimo,
          }
        : null,
    },
  };
}

function demoVeicoloBySlug(slug: string): VeicoloPubblico | null {
  if (!isDemoMode()) return null;
  const found = DEMO_VEICOLI.find((v) => v.slug === slug);
  return found ? withUnita(enrichVeicoloMedia(found)) : null;
}

export async function getVeicoloBySlug(slug: string): Promise<VeicoloPubblico | null> {
  if (isDemoMode()) {
    return demoVeicoloBySlug(slug);
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("veicoli")
      .select(VEICOLO_SELECT)
      .eq("slug", slug)
      .eq("pubblicato", true)
      .eq("attivo", true)
      .maybeSingle();

    if (error) {
      logSupabaseError("getVeicoloBySlug", error.message);
      return demoVeicoloBySlug(slug);
    }
    if (!data) return demoVeicoloBySlug(slug);

    const mapped = mapVeicolo(data as Record<string, unknown>);
    const accessori = await getAccessoriForVeicolo(mapped.id);
    return withPrezzoPromo({ ...mapped, accessori });
  } catch (err) {
    logSupabaseError("getVeicoloBySlug", err instanceof Error ? err.message : String(err));
    return demoVeicoloBySlug(slug);
  }
}

export async function getPublishedSlugs(): Promise<string[]> {
  if (isDemoMode()) return DEMO_SLUGS;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("veicoli")
      .select("slug")
      .eq("pubblicato", true)
      .eq("attivo", true);

    if (error) {
      logSupabaseError("getPublishedSlugs", error.message);
      return DEMO_SLUGS;
    }
    const dbSlugs = (data ?? []).map((row) => row.slug as string);
    if (isDemoMode()) {
      const localSlugs = DEMO_VEICOLI.map((v) => v.slug).filter((slug) => !dbSlugs.includes(slug));
      return [...dbSlugs, ...localSlugs];
    }
    return dbSlugs;
  } catch (err) {
    logSupabaseError("getPublishedSlugs", err instanceof Error ? err.message : String(err));
    return DEMO_SLUGS;
  }
}

export async function getPublishedVeicoli(): Promise<VeicoloPubblico[]> {
  if (isDemoMode()) return DEMO_VEICOLI;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("veicoli")
      .select(VEICOLO_SELECT)
      .eq("pubblicato", true)
      .eq("attivo", true)
      .order("ordine", { ascending: true });

    if (error) {
      logSupabaseError("getPublishedVeicoli", error.message);
      return DEMO_VEICOLI;
    }

    const veicoli = (data ?? []).map((row) => mapVeicolo(row as Record<string, unknown>));
    if (veicoli.length === 0) return DEMO_VEICOLI;
    const supplemented = supplementWithDemoVeicoli(veicoli);
    return Promise.all(supplemented.map(withPrezzoPromo));
  } catch (err) {
    logSupabaseError("getPublishedVeicoli", err instanceof Error ? err.message : String(err));
    return DEMO_VEICOLI;
  }
}

export async function getCategorieFlotta(veicoli: VeicoloPubblico[]): Promise<CategoriaPubblica[]> {
  const ids = new Set(
    veicoli.map((v) => v.categoria?.id).filter((id): id is string => Boolean(id)),
  );
  if (ids.size === 0) return [];

  if (isDemoMode()) {
    return DEMO_CATEGORIE.filter((c) => ids.has(c.id)).sort(
      (a, b) => (a.ordine ?? 0) - (b.ordine ?? 0),
    );
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("categorie")
      .select("id, nome, slug, ordine")
      .eq("attivo", true)
      .in("id", [...ids])
      .order("ordine", { ascending: true });

    if (error) {
      logSupabaseError("getCategorieFlotta", error.message);
      return DEMO_CATEGORIE.filter((c) => ids.has(c.id)).sort(
        (a, b) => (a.ordine ?? 0) - (b.ordine ?? 0),
      );
    }

    return (data ?? []).map((row) => ({
      id: String(row.id),
      nome: String(row.nome),
      slug: String(row.slug),
      ordine: row.ordine != null ? Number(row.ordine) : undefined,
    }));
  } catch (err) {
    logSupabaseError("getCategorieFlotta", err instanceof Error ? err.message : String(err));
    return DEMO_CATEGORIE.filter((c) => ids.has(c.id)).sort(
      (a, b) => (a.ordine ?? 0) - (b.ordine ?? 0),
    );
  }
}

export async function getActiveCategorie(): Promise<CategoriaPubblica[]> {
  if (isDemoMode()) return DEMO_CATEGORIE;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("categorie")
      .select("id, nome, slug, ordine")
      .eq("attivo", true)
      .order("ordine", { ascending: true });

    if (error) {
      logSupabaseError("getActiveCategorie", error.message);
      return DEMO_CATEGORIE;
    }

    const categorie = (data ?? []).map((row) => ({
      id: String(row.id),
      nome: String(row.nome),
      slug: String(row.slug),
      ordine: row.ordine != null ? Number(row.ordine) : undefined,
    }));

    return categorie.length > 0 ? categorie : DEMO_CATEGORIE;
  } catch (err) {
    logSupabaseError("getActiveCategorie", err instanceof Error ? err.message : String(err));
    return DEMO_CATEGORIE;
  }
}