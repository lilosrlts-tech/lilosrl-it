import { NextRequest, NextResponse } from "next/server";
import {
  CANONICAL_HOST,
  CANONICAL_ORIGIN,
  REDIRECT_TO_CANONICAL_HOSTS,
} from "@/lib/constants";
import { isFlottaCategoriaSlug } from "@/lib/flotta-categoria-config";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isLocalDev(hostname: string): boolean {
  return LOCAL_HOSTS.has(hostname) || hostname.endsWith(".local");
}

function normalizeHost(raw: string): string {
  return raw.split(":")[0].toLowerCase();
}

function isVercelPreview(host: string): boolean {
  return host.endsWith(".vercel.app");
}

/**
 * Path di primo livello validi sul sito Next (non vanno in fallback 301).
 * Le regole esplicite in legacy-redirects.ts restano la fonte per i path noti.
 */
const ALLOWED_TOP_LEVEL = new Set([
  "flotta",
  "tariffe",
  "contatti",
  "chi-siamo",
  "cosa-trasporti",
  "offerte",
  "autolavaggio",
  "privacy",
  "cookie-policy",
  "termini-condizioni",
  "api",
  "sitemap.xml",
  "robots.txt",
  "llms.txt",
  "manifest.webmanifest",
  "manifest.json",
  "icon",
  "apple-icon",
  "opengraph-image",
  "twitter-image",
  "favicon.ico",
]);

/**
 * Root categorie storiche (lilo.srl conservava il path al passaggio di dominio).
 * Duplicato difensivo rispetto a next.config redirects.
 */
const CATEGORY_ROOT_TO_FLOTTA: ReadonlyMap<string, string> = new Map([
  ["auto", "/flotta/auto"],
  ["pulmini-9-posti", "/flotta/pulmini-9-posti"],
  ["pulmini", "/flotta/pulmini-9-posti"],
  ["furgoni-piccoli", "/flotta/furgoni-piccoli"],
  ["furgoni-medi", "/flotta/furgoni-medi"],
  ["furgoni-grandi", "/flotta/furgoni-grandi"],
  ["furgoni-grandi-citta", "/flotta/furgoni-grandi-citta"],
  ["furgoni-xl", "/flotta/furgoni-xl"],
  ["furgoni", "/flotta/furgoni-medi"],
]);

function getRequestHost(request: NextRequest): string {
  const hostHeader =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    request.nextUrl.hostname;
  return normalizeHost(hostHeader);
}

/**
 * 301 verso path (e host canonico in produzione).
 * In locale / preview Vercel resta sullo stesso host per testare le regole.
 */
function redirect301(request: NextRequest, pathname: string): NextResponse {
  const host = getRequestHost(request);
  const hostname = request.nextUrl.hostname;

  if (isLocalDev(hostname) || isVercelPreview(host)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.redirect(new URL(pathname, CANONICAL_ORIGIN), 301);
}

/**
 * Path legacy / sconosciuti → 301.
 * Ordine: categorie root note, poi catch-all verso /flotta.
 */
function maybeRedirectUnknownPath(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (pathname === "/" || pathname === "") return null;

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0]?.toLowerCase();
  if (!first) return null;

  // Root categoria storica → /flotta/{categoria}
  const categoryDest = CATEGORY_ROOT_TO_FLOTTA.get(first);
  if (categoryDest && segments.length === 1) {
    return redirect301(request, categoryDest);
  }

  // Path noti dell’app → passa
  if (ALLOWED_TOP_LEVEL.has(first)) return null;
  if (first.startsWith("_next") || first.startsWith(".")) return null;

  // Catch-all: qualsiasi altro URL root legacy → hub flotta (azzera 404)
  return redirect301(request, "/flotta");
}

/**
 * Redirect 301 host → https://www.lilosrl.it
 *
 * Copre:
 *   - http(s)://lilosrl.it
 *   - http://www.lilosrl.it (forza HTTPS)
 *   - domini secondari in REDIRECT_TO_CANONICAL_HOSTS
 *     (lilo.srl, noleggiofurgonitrieste.it, noleggiotrieste.it,
 *      autonoleggiotrieste.it ± www)
 *
 * Preview Vercel e localhost non vengono reindirizzati.
 */
export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;

  if (request.nextUrl.pathname === "/flotta") {
    const categoria = request.nextUrl.searchParams.get("categoria");
    if (categoria && isFlottaCategoriaSlug(categoria)) {
      return redirect301(request, `/flotta/${categoria}`);
    }
  }

  // Path legacy (categorie root) + catch-all 404 → /flotta
  const pathRedirect = maybeRedirectUnknownPath(request);
  if (pathRedirect) return pathRedirect;

  if (isLocalDev(hostname)) {
    return NextResponse.next();
  }

  const host = getRequestHost(request);

  if (isVercelPreview(host)) {
    return NextResponse.next();
  }

  const proto =
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.replace(":", "");
  const isHttps = proto === "https";

  const isCanonicalHost = host === CANONICAL_HOST;
  if (isCanonicalHost && isHttps) {
    return NextResponse.next();
  }

  const shouldRedirectToCanonical =
    isCanonicalHost || REDIRECT_TO_CANONICAL_HOSTS.has(host);

  if (!shouldRedirectToCanonical) {
    return NextResponse.next();
  }

  const destination = new URL(
    request.nextUrl.pathname + request.nextUrl.search,
    CANONICAL_ORIGIN,
  );
  return NextResponse.redirect(destination, 301);
}

export const config = {
  matcher: [
    /*
     * Esclude asset statici e il proxy gestionale PHP (/.gestionale → Aruba).
     */
    "/((?!_next/static|_next/image|favicon.ico|\\.gestionale(?:/.*)?$|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
