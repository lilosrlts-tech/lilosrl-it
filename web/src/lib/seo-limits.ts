/**
 * Limiti Semrush / best practice SERP (caratteri).
 * Title: 30–60 · Meta description: 120–160
 */
export const SEO_TITLE_MIN = 30;
export const SEO_TITLE_MAX = 60;
export const SEO_DESC_MIN = 120;
export const SEO_DESC_MAX = 160;

const DESC_PAD =
  " Preventivo rapido, tariffe giornaliere IVA inclusa e ritiro in sede a Trieste.";

function cleanSeoText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Taglia a fine parola senza superare max (niente ellissi in meta). */
export function truncateSeoText(text: string, max: number): string {
  const t = cleanSeoText(text);
  if (t.length <= max) return t;
  const slice = t.slice(0, max);
  const sp = slice.lastIndexOf(" ");
  const cut = sp >= Math.floor(max * 0.55) ? slice.slice(0, sp) : slice;
  return cut.replace(/[.,;:!?…\s-]+$/u, "");
}

/**
 * Title in range 30–60. Se troppo lungo preferisce `fallback` (se entro max),
 * altrimenti tronca. Se troppo corto e il fallback è nel range, usa il fallback.
 */
export function fitSeoTitle(raw: string, fallback: string): string {
  const primary = cleanSeoText(raw);
  const fb = cleanSeoText(fallback);

  const pick = (t: string) => {
    if (t.length > SEO_TITLE_MAX) return truncateSeoText(t, SEO_TITLE_MAX);
    return t;
  };

  if (primary.length > SEO_TITLE_MAX) {
    if (fb.length <= SEO_TITLE_MAX && fb.length >= SEO_TITLE_MIN) return fb;
    if (fb.length > 0) return pick(fb);
    return pick(primary);
  }

  if (primary.length > 0 && primary.length < SEO_TITLE_MIN) {
    if (fb.length >= SEO_TITLE_MIN && fb.length <= SEO_TITLE_MAX) return fb;
  }

  if (primary.length > 0) return primary;
  return pick(fb);
}

/**
 * Meta description in range 120–160.
 * Troppo corta → completa con pad standard (o fallback più lungo).
 * Troppo lunga → tronca a fine parola.
 */
export function fitSeoDescription(raw: string, fallback?: string): string {
  let d = cleanSeoText(raw);
  const fb = fallback ? cleanSeoText(fallback) : "";

  if (d.length > SEO_DESC_MAX) {
    return truncateSeoText(d, SEO_DESC_MAX);
  }

  if (d.length >= SEO_DESC_MIN) return d;

  if (fb.length >= SEO_DESC_MIN && fb.length <= SEO_DESC_MAX) {
    return fb;
  }

  if (fb.length > d.length) {
    d = fb.length <= SEO_DESC_MAX ? fb : truncateSeoText(fb, SEO_DESC_MAX);
    if (d.length >= SEO_DESC_MIN) return d;
  }

  while (d.length < SEO_DESC_MIN) {
    const next = cleanSeoText(`${d}${DESC_PAD}`);
    if (next.length > SEO_DESC_MAX) {
      return truncateSeoText(next, SEO_DESC_MAX);
    }
    if (next.length === d.length) break;
    d = next;
  }

  return d.length > SEO_DESC_MAX ? truncateSeoText(d, SEO_DESC_MAX) : d;
}

/** Title corto e stabile per schede veicolo (entro 60 caratteri nella maggior parte dei casi). */
export function buildVeicoloTitleFallback(marca: string, modello: string): string {
  const m = cleanSeoText(marca);
  const mod = cleanSeoText(modello);
  const full = `Noleggio ${m} ${mod} Trieste | LILO`;
  if (full.length <= SEO_TITLE_MAX) return full;
  const mid = `Noleggio ${m} ${mod} | LILO`;
  if (mid.length <= SEO_TITLE_MAX) return mid;
  return truncateSeoText(mid, SEO_TITLE_MAX);
}
