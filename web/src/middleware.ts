import { NextRequest, NextResponse } from "next/server";
import {
  CANONICAL_HOST,
  CANONICAL_ORIGIN,
  REDIRECT_TO_CANONICAL_HOSTS,
} from "@/lib/constants";
import { isFlottaCategoriaSlug } from "@/lib/flotta-categoria-config";
import { getExactPathRedirectMap } from "@/lib/legacy-redirects";

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
  "tariffe-noleggio-furgoni-trieste",
  "contatti",
  "chi-siamo",
  "cosa-trasporti",
  "offerte",
  "offerte-noleggio-furgoni-trieste",
  "autolavaggio",
  "privacy",
  "cookie-policy",
  "termini-condizioni",
  "guide",
  "noleggio-furgoni-trieste",
  "noleggio-auto-trieste",
  "noleggio-pulmini-9-posti-trieste",
  "api",
  "sitemap.xml",
  "robots.txt",
  "llms.txt",
  "8f3c2a91d64e4b0f9c1a7e5d2b8f0c3a.txt",
  "manifest.webmanifest",
  "manifest.json",
  "favicon.ico",
  "apple-touch-icon.png",
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

function stripTrailingSlash(pathname: string): string {
  if (pathname === "/" || !pathname.endsWith("/")) return pathname;
  return pathname.replace(/\/+$/, "") || "/";
}

/**
 * Prefissi WordPress dismessi: 410 Gone (segnale più chiaro del 404 per Googlebot).
 * I path con redirect esplicito (es. /portfolio-items/autolavaggio) vengono
 * gestiti prima da maybeRedirectUnknownPath / next.config.
 */
const WP_GONE_TOP_LEVEL = new Set([
  "author",
  "upload",
  "uploads",
  "wp-content",
  "wp-includes",
  "wp-admin",
  "wp-json",
  "xmlrpc.php",
  "feed",
  "comments",
  "category",
  "tag",
  "portfolio-items",
  "portfolio",
]);

function gone410(): NextResponse {
  return new NextResponse("Gone", {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}

/** True per URL WP morte o placeholder di template (GSC 404 junk). */
function isWordPressGonePath(pathname: string): boolean {
  const normalized = stripTrailingSlash(pathname);
  const segments = normalized.split("/").filter(Boolean);
  const first = segments[0]?.toLowerCase();
  if (!first) return false;

  if (WP_GONE_TOP_LEVEL.has(first)) return true;

  // Placeholder WP tipo /flotta/{search_term_string}
  if (segments.some((s) => s.includes("{") || s.includes("%7B") || s.includes("%7b"))) {
    return true;
  }
  if (first === "flotta" && segments[1]?.toLowerCase() === "{search_term_string}") {
    return true;
  }

  return false;
}

/**
 * Path legacy noti / trailing slash → 301 (one-hop dove possibile).
 * URL sconosciute non vengono soft-redirectate a /flotta: restano 404.
 */
function maybeRedirectUnknownPath(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (pathname === "/" || pathname === "") return null;

  const hasTrailingSlash = pathname.length > 1 && pathname.endsWith("/");
  const normalized = stripTrailingSlash(pathname);

  // Mappa esatta legacy (con o senza slash in ingresso → destinazione finale)
  const exactDest = getExactPathRedirectMap().get(normalized);
  if (exactDest && exactDest !== normalized) {
    return redirect301(request, exactDest);
  }

  // WP dismesso / placeholder (prima di trailing-slash su path “validi” tipo /flotta/…)
  if (isWordPressGonePath(pathname) || isWordPressGonePath(normalized)) {
    return gone410();
  }

  const segments = normalized.split("/").filter(Boolean);
  const first = segments[0]?.toLowerCase();
  if (!first) return null;

  // Root categoria storica → /flotta/{categoria}
  const categoryDest = CATEGORY_ROOT_TO_FLOTTA.get(first);
  if (categoryDest && segments.length === 1) {
    return redirect301(request, categoryDest);
  }

  // Solo slash finale su path valido dell’app → 301 senza slash (no 308 Next)
  if (hasTrailingSlash && ALLOWED_TOP_LEVEL.has(first)) {
    return redirect301(request, normalized);
  }

  // Path noti dell’app → passa (Next gestisce 404 reali)
  if (ALLOWED_TOP_LEVEL.has(first)) return null;
  if (first.startsWith("_next") || first.startsWith(".")) return null;

  // Nessun soft-404 verso /flotta: URL sconosciute → not-found (404)
  return null;
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

  // Path legacy (categorie root) + trailing slash + catch-all → destinazione finale
  // (include anche 410 Gone per /author/*, /upload/*, portfolio WP residui, placeholder)
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
     * Esclude asset statici. /.gestionale è gestito da vercel.json → 301 HTTPS gestionale
     * (niente rewrite verso Aruba che risponde 403 ai crawler).
     */
    "/((?!_next/static|_next/image|favicon.ico|\\.gestionale(?:/.*)?$|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt)$).*)",
  ],
};
