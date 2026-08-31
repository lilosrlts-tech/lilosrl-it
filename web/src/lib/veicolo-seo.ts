import { SITE_URL } from "@/lib/constants";
import {
  getLocalFleetImageFallback,
  resolveVeicoloCoverUrl,
} from "@/lib/fleet-image-url";
import type { FotoPubblica, VeicoloPubblico } from "@/types/veicolo";

export type VeicoloFotoVista = "fiancata" | "posteriore" | "copertina";

/** Rimuove riferimenti alla targa dai testi della scheda pubblica (le foto restano invariate). */
export function stripTargaFromPublicCopy(text: string): string {
  return text
    .replace(/\s*\(\s*targa\s+[^)]+\)/gi, "")
    .replace(/,?\s*con\s+targa\s+[A-Z0-9.\-\s]+/gi, "")
    .replace(/\b[Tt]arga\s+[A-Z]{2}\s*\d{3}\s*[A-Z]{2}\b\.?/g, "")
    .replace(/\b[Tt]arga\s+[A-Z0-9]{5,10}\b\.?/g, "")
    .replace(/\b[Tt]arga\s+n\.?\s*d\.?\b\.?/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/\.\s*\./g, ".")
    .trim();
}

/**
 * Pulisce copy pubblici da «LILO» nudo o «marchiato LILO».
 * Lascia «LILO S.r.l.» e «LILO Autonoleggio…» dove già corretti.
 */
export function sanitizePublicBrandCopy(text: string): string {
  return text
    .replace(/\b[Mm]archiat[oa]\s+LILO\b/gi, "")
    .replace(/\bfurgoni\s+LILO\b/gi, "furgoni")
    .replace(/\bpulmini?\s+LILO\b/gi, (m) => (m.toLowerCase().startsWith("pulmini") ? "pulmini" : "pulmino"))
    .replace(/\bSpecialit[aà]\s+LILO\b/gi, "La nostra specialità")
    .replace(/\bPerch[eé]\s+scegliere\s+LILO\b/gi, "Perché sceglierci")
    .replace(/\bDa\s+LILO\b(?!\s*S\.?\s*[Rr]\.?\s*[Ll])/gi, "Da noi")
    .replace(/\bcon\s+LILO\b(?!\s*S\.?\s*[Rr]\.?\s*[Ll]|\s*Autonoleggio)/gi, "con noi")
    .replace(/\bsede\s+LILO\b(?!\s*S\.?\s*[Rr]\.?\s*[Ll]|\s*Autonoleggio)/gi, "sede")
    .replace(/\bpresso\s+LILO\b(?!\s*S\.?\s*[Rr]\.?\s*[Ll]|\s*Autonoleggio)/gi, "presso la sede")
    .replace(/\s*,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/^[,.\s]+/g, "")
    .replace(/\.\s*\./g, ".")
    .trim();
}

/** Testi placeholder foto da non mostrare mai in UI / alt / didascalia. */
const PLACEHOLDER_PHOTO_COPY =
  /^\s*(foto\s+in\s+arrivo|immagine\s+in\s+arrivo|coming\s+soon|foto\s+a\s+breve|immagine\s+non\s+disponibile)\s*\.?$/i;

export function isPlaceholderPhotoCopy(text: string | null | undefined): boolean {
  if (!text?.trim()) return false;
  return PLACEHOLDER_PHOTO_COPY.test(text.trim());
}

/** Rimuove frasi placeholder residue (es. CMS vecchio) da stringhe pubbliche. */
export function stripPlaceholderPhotoCopy(text: string): string {
  return text
    .replace(/\bfoto\s+in\s+arrivo\b\.?/gi, "")
    .replace(/\bimmagine\s+in\s+arrivo\b\.?/gi, "")
    .replace(/\bcoming\s+soon\b\.?/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .trim();
}

/** Highlight vuoti o solo branding da non mostrare. */
export function isUsefulPublicHighlight(text: string): boolean {
  const t = sanitizePublicBrandCopy(stripTargaFromPublicCopy(text));
  if (!t) return false;
  if (/^lilo(\s+s\.?\s*r\.?\s*l\.?)?$/i.test(t)) return false;
  return true;
}

export function cleanPublicHighlight(text: string): string {
  return sanitizePublicBrandCopy(stripTargaFromPublicCopy(text));
}

export function inferVeicoloFotoVista(foto: FotoPubblica): VeicoloFotoVista {
  const haystack = `${foto.url_pubblico} ${foto.titolo ?? ""} ${foto.alt_text}`.toLowerCase();
  if (/posterior|retro|posteriore|rear|back/.test(haystack)) return "posteriore";
  if (/fiancat|front|copertina/.test(haystack)) return "fiancata";
  return foto.is_copertina ? "fiancata" : "copertina";
}

export function buildVeicoloFotoAlt(
  veicolo: VeicoloPubblico,
  vista: VeicoloFotoVista = "copertina",
): string {
  const categoria = veicolo.categoria?.nome ?? "Veicolo";
  const vistaLabel = vista === "posteriore" ? "Posteriore" : "Fiancata";
  return `Noleggio ${categoria} ${veicolo.marca} ${veicolo.modello} Trieste - ${vistaLabel}`;
}

export function getVeicoloFotoAlt(
  veicolo: VeicoloPubblico,
  foto?: FotoPubblica | null,
): string {
  const rawAlt = foto?.alt_text?.trim();
  if (rawAlt && !isPlaceholderPhotoCopy(rawAlt)) {
    const cleaned = sanitizePublicBrandCopy(stripPlaceholderPhotoCopy(rawAlt));
    if (cleaned) return cleaned;
  }
  const vista = foto ? inferVeicoloFotoVista(foto) : "fiancata";
  return buildVeicoloFotoAlt(veicolo, vista);
}

/** Override meta description per schede che altrimenti condividerebbero lo stesso testo generato. */
const SEO_DESCRIPTION_BY_SLUG: Record<string, string> = {
  "ford-transit-custom-l1h1-ibrido":
    "Noleggio Ford Transit Custom Ibrido (6 m³) a Trieste con LILO S.r.l. Veicolo ecologico, consumi ridotti, tariffe IVA inclusa e ritiro in sede.",
};

export function buildVeicoloSeoDescription(veicolo: VeicoloPubblico): string {
  const override = SEO_DESCRIPTION_BY_SLUG[veicolo.slug];
  if (override) return override;

  const spec = veicolo.specifiche_tecniche;
  const volume = spec.volume_metri_cubi ?? spec.volume_carico_mc;
  const volumeText =
    volume != null
      ? `${Number.isInteger(volume) ? String(volume) : volume.toFixed(1).replace(".", ",")} m³`
      : null;
  const categoriaLabel = veicolo.categoria?.nome?.toLowerCase() ?? "veicolo";
  const isHybrid = /ibrido/i.test(veicolo.slug) || /ibrid/i.test(veicolo.versione ?? "");

  if (volumeText && isHybrid) {
    return `Noleggio ${veicolo.marca} ${veicolo.modello} Ibrido (${volumeText}) a Trieste con LILO S.r.l. Consumi ridotti, tariffe IVA inclusa e ritiro in sede.`;
  }

  if (volumeText) {
    return `Noleggia ${veicolo.marca} ${veicolo.modello} (${volumeText}) a Trieste con LILO S.r.l. ${categoriaLabel}: tariffe giornaliere IVA inclusa e ritiro in sede.`;
  }

  return `Noleggia ${veicolo.marca} ${veicolo.modello} a Trieste con LILO S.r.l. Tariffe giornaliere IVA inclusa, preventivo rapido e ritiro in sede.`;
}

export function toAbsoluteAssetUrl(path: string | null | undefined): string | undefined {
  if (!path?.trim()) return undefined;
  const trimmed = path.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${SITE_URL}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

/**
 * URL immagine assolute per JSON-LD (GSC richiede `image` obbligatorio).
 * Ordine: foto, og_image, fallback locale/categoria, logo sito.
 */
export function getVeicoloImageUrlsForSchema(veicolo: VeicoloPubblico): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];

  const push = (raw: string | null | undefined) => {
    const abs = toAbsoluteAssetUrl(raw);
    if (!abs || seen.has(abs)) return;
    seen.add(abs);
    urls.push(abs);
  };

  for (const f of veicolo.foto) {
    push(f.url_pubblico);
  }
  push(veicolo.og_image_url);
  push(resolveVeicoloCoverUrl(veicolo));
  push(getLocalFleetImageFallback(veicolo.slug, veicolo.categoria?.slug));
  push("/logo-lilo.webp");

  return urls;
}
