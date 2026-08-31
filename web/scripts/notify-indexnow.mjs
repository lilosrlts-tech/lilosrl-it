/**
 * Notifica IndexNow per guide, pilastri e hub commerciali.
 *
 * Uso:
 *   npm run indexnow
 *
 * Su Vercel production può essere invocato da postbuild se INDEXNOW_ON_BUILD=1.
 * Non gira su preview/dev a meno di FORCE_INDEXNOW=1.
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

const PATHS = [
  "/",
  "/flotta",
  "/noleggio-furgoni-trieste",
  "/noleggio-auto-trieste",
  "/noleggio-pulmini-9-posti-trieste",
  "/cosa-trasporti",
  "/tariffe-noleggio-furgoni-trieste",
  "/offerte-noleggio-furgoni-trieste",
  "/contatti",
  "/chi-siamo",
  "/guide",
  ...GUIDE_SLUGS.map((slug) => `/guide/${slug}`),
];

function shouldRun() {
  if (process.env.FORCE_INDEXNOW === "1") return true;
  if (process.env.INDEXNOW_ON_BUILD === "1" && process.env.VERCEL_ENV === "production") {
    return true;
  }
  // CLI esplicito: npm run indexnow (senza VERCEL_ENV)
  if (!process.env.VERCEL_ENV && process.env.npm_lifecycle_event === "indexnow") {
    return true;
  }
  if (!process.env.VERCEL_ENV && !process.env.npm_lifecycle_event) {
    return true;
  }
  return false;
}

async function main() {
  if (!shouldRun()) {
    console.log(
      "[indexnow] skip (set FORCE_INDEXNOW=1 or INDEXNOW_ON_BUILD=1 on production, or run npm run indexnow)",
    );
    return;
  }

  const urlList = PATHS.map((p) => (p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`));

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
  console.log(`[indexnow] status=${res.status} urls=${urlList.length}`);
  if (body) console.log(body);
  if (!res.ok) process.exitCode = 1;
}

main().catch((err) => {
  console.error("[indexnow]", err);
  process.exitCode = 1;
});
