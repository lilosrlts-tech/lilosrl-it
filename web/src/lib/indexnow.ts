import { SITE_URL } from "@/lib/constants";
import { getGuideSlugs } from "@/lib/guide";
import { canonicalUrl } from "@/lib/seo";

/** Chiave IndexNow (file pubblico `/{key}.txt`). */
export const INDEXNOW_KEY = "8f3c2a91d64e4b0f9c1a7e5d2b8f0c3a";

export const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/** URL SEO prioritari da notificare (pilastri, guide, hub commerciali). */
export function getIndexNowPriorityUrls(): string[] {
  const paths = [
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
    ...getGuideSlugs().map((slug) => `/guide/${slug}`),
  ];
  return paths.map((p) => canonicalUrl(p));
}

export async function submitIndexNow(
  urls: string[],
): Promise<{ ok: boolean; status: number; body: string; count: number }> {
  const unique = [...new Set(urls)].filter((url) => url.startsWith(SITE_URL));
  if (unique.length === 0) {
    return { ok: false, status: 0, body: "no urls", count: 0 };
  }

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: "www.lilosrl.it",
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: unique,
    }),
  });

  return {
    ok: res.ok,
    status: res.status,
    body: await res.text(),
    count: unique.length,
  };
}

/** Notifica i contenuti SEO prioritari (guide + pilastri + hub). */
export async function submitPriorityContentIndexNow() {
  return submitIndexNow(getIndexNowPriorityUrls());
}
