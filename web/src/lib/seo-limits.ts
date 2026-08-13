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
export function buildVeicoloTitleFallback(
  marca: string,
  modello: string,
  options?: { versione?: string | null; slug?: string | null },
): string {
  const m = cleanSeoText(marca);
  const mod = cleanSeoText(modello);
  const ver = options?.versione ? cleanSeoText(options.versione) : "";
  const extra = slugTitleDisambiguator(options?.slug, [m, mod, ver]);

  const withAll = ["Noleggio", m, mod, ver, extra, "Trieste | LILO"]
    .filter(Boolean)
    .join(" ");
  if (withAll.length <= SEO_TITLE_MAX) return withAll;

  const mid = ["Noleggio", m, mod, ver || extra, "Trieste | LILO"]
    .filter(Boolean)
    .join(" ");
  if (mid.length <= SEO_TITLE_MAX) return mid;

  const short = ["Noleggio", m, mod, ver || extra, "| LILO"].filter(Boolean).join(" ");
  if (short.length <= SEO_TITLE_MAX) return short;
  return truncateSeoText(short, SEO_TITLE_MAX);
}

const SLUG_LABELS: Record<string, string> = {
  ibrido: "Ibrido",
  citta: "Città",
  haccp: "HACCP",
  rampa: "Rampa",
  van: "Van",
  xl: "XL",
};

/** Token distintivi dallo slug non già presenti in marca/modello/versione. */
function slugTitleDisambiguator(
  slug: string | null | undefined,
  already: string[],
): string {
  if (!slug?.trim()) return "";
  const known = new Set(
    already
      .join(" ")
      .toLowerCase()
      .split(/[\s/_-]+/)
      .filter(Boolean)
      .map((t) => t.replace(/[àáâ]/g, "a").replace(/èé/g, "e").replace(/ì/g, "i").replace(/ò/g, "o").replace(/ù/g, "u")),
  );

  const tokens = slug
    .toLowerCase()
    .split("-")
    .filter((t) => t.length > 1 && !/^\d+$/.test(t) && !known.has(t));

  for (const t of tokens) {
    if (SLUG_LABELS[t]) return SLUG_LABELS[t];
  }
  return "";
}

/**
 * Preferisce un title univoco se il seo_title DB omette versione / disambiguatore slug
 * (causa tipica dei title tag duplicati SEMrush su mezzi simili).
 */
export function resolveVeicoloSeoTitle(
  seoTitle: string | null | undefined,
  marca: string,
  modello: string,
  options?: { versione?: string | null; slug?: string | null },
): string {
  const fallback = buildVeicoloTitleFallback(marca, modello, options);
  const raw = seoTitle?.trim();
  if (!raw) return fallback;

  const lower = raw.toLowerCase();
  const lowerCompact = lower.replace(/\s+/g, "");
  const ver = options?.versione?.trim();
  if (ver) {
    const verLower = ver.toLowerCase();
    const verCompact = verLower.replace(/\s+/g, "");
    if (!lower.includes(verLower) && !lowerCompact.includes(verCompact)) {
      return fallback;
    }
  }

  const extra = slugTitleDisambiguator(options?.slug, [marca, modello, ver ?? ""]);
  if (extra) {
    const aliases =
      extra.toLowerCase() === "città"
        ? ["città", "citta", "citt"]
        : [extra.toLowerCase()];
    if (!aliases.some((a) => lower.includes(a))) {
      return fallback;
    }
  }

  return fitSeoTitle(raw, fallback);
}
