/**
 * Notifica IndexNow: URL prioritari + (se disponibile) tutto il sitemap live.
 *
 * Uso:
 *   npm run indexnow
 *
 * Su Vercel production gira da postbuild (sempre).
 * Preview/dev: solo con FORCE_INDEXNOW=1 o `npm run indexnow`.
 */

const SITE_URL = "https://www.lilosrl.it";
const INDEXNOW_KEY = "8f3c2a91d64e4b0f9c1a7e5d2b8f0c3a";
const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

const GUIDE_SLUGS = [
  "quale-furgone-scegliere-per-trasloco",
  "quanto-costa-noleggiare-furgone-trieste",
  "che-patente-serve-per-furgone",
  "quanti-metri-cubi-servono-per-trasloco",
  "furgone-per-frigorifero",
];

const FLOTTA_CATEGORIE = [
  "auto",
  "pulmini-9-posti",
  "furgoni-piccoli",
  "furgoni-medi",
  "furgoni-grandi",
  "furgoni-grandi-citta",
  "furgoni-xl",
];

const FALLBACK_PATHS = [
  "/",
  "/flotta",
  ...FLOTTA_CATEGORIE.map((slug) => `/flotta/${slug}`),
  "/noleggio-furgoni-trieste",
  "/noleggio-auto-trieste",
  "/noleggio-pulmini-9-posti-trieste",
  "/cosa-trasporti",
  "/tariffe-noleggio-furgoni-trieste",
  "/offerte-noleggio-furgoni-trieste",
  "/contatti",
  "/chi-siamo",
  "/autolavaggio",
  "/guide",
  ...GUIDE_SLUGS.map((slug) => `/guide/${slug}`),
  "/privacy",
  "/cookie-policy",
  "/termini-condizioni",
];

function shouldRun() {
  if (process.env.FORCE_INDEXNOW === "1") return true;
  // Produzione Vercel: sempre (postbuild). Opt-out: INDEXNOW_ON_BUILD=0
  if (process.env.VERCEL_ENV === "production" && process.env.INDEXNOW_ON_BUILD !== "0") {
    return true;
  }
  if (process.env.INDEXNOW_ON_BUILD === "1" && process.env.VERCEL_ENV === "production") {
    return true;
  }
  if (!process.env.VERCEL_ENV && process.env.npm_lifecycle_event === "indexnow") {
    return true;
  }
  if (!process.env.VERCEL_ENV && !process.env.npm_lifecycle_event) {
    return true;
  }
  return false;
}

function pathToUrl(p) {
  return p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`;
}

async function fetchSitemapUrls() {
  try {
    const res = await fetch(`${SITE_URL}/sitemap.xml`, {
      headers: { Accept: "application/xml,text/xml,*/*" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    return urls.filter((u) => u.startsWith(SITE_URL));
  } catch {
    return [];
  }
}

async function main() {
  if (!shouldRun()) {
    console.log(
      "[indexnow] skip (production auto; or FORCE_INDEXNOW=1 / npm run indexnow)",
    );
    return;
  }

  const fromSitemap = await fetchSitemapUrls();
  const fallback = FALLBACK_PATHS.map(pathToUrl);
  const urlList = [...new Set(fromSitemap.length > 0 ? [...fromSitemap, ...fallback] : fallback)];

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: "www.lilosrl.it",
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList,
    }),
  });

  const body = await res.text();
  console.log(
    `[indexnow] status=${res.status} urls=${urlList.length} (sitemap=${fromSitemap.length})`,
  );
  if (body) console.log(body);
  if (!res.ok) process.exitCode = 1;
}

main().catch((err) => {
  console.error("[indexnow]", err);
  process.exitCode = 1;
});
