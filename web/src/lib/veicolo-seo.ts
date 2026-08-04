import { SITE_URL } from "@/lib/constants";
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
  if (foto?.alt_text?.trim()) {
    return sanitizePublicBrandCopy(foto.alt_text.trim());
  }
  const vista = foto ? inferVeicoloFotoVista(foto) : "fiancata";
  return buildVeicoloFotoAlt(veicolo, vista);
}

export function buildVeicoloSeoDescription(veicolo: VeicoloPubblico): string {
  const spec = veicolo.specifiche_tecniche;
  const volume = spec.volume_metri_cubi ?? spec.volume_carico_mc;
  const volumeText =
    volume != null
      ? `${Number.isInteger(volume) ? String(volume) : volume.toFixed(1).replace(".", ",")} m³`
      : null;
  const categoriaLabel = veicolo.categoria?.nome?.toLowerCase() ?? "veicolo";

  if (volumeText) {
    return `Noleggia ${veicolo.marca} ${veicolo.modello} (${volumeText}) a Trieste con LILO S.r.l. ${categoriaLabel}, ritiro in sede. Preventivo rapido.`;
  }

  return `Noleggia ${veicolo.marca} ${veicolo.modello} a Trieste con LILO S.r.l. Tariffe trasparenti e ritiro in sede.`;
}

export function toAbsoluteAssetUrl(path: string | null | undefined): string | undefined {
  if (!path?.trim()) return undefined;
  const trimmed = path.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${SITE_URL}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

export function getVeicoloImageUrlsForSchema(veicolo: VeicoloPubblico): string[] {
  const urls = veicolo.foto
    .map((f) => toAbsoluteAssetUrl(f.url_pubblico))
    .filter((url): url is string => Boolean(url));

  const og = toAbsoluteAssetUrl(veicolo.og_image_url);
  if (og && !urls.includes(og)) urls.unshift(og);

  return urls;
}
