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
      const url = request.nextUrl.clone();
      url.pathname = `/flotta/${categoria}`;
      url.search = "";
      return NextResponse.redirect(url, 301);
    }
  }

  if (isLocalDev(hostname)) {
    return NextResponse.next();
  }

  const hostHeader =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? hostname;
  const host = normalizeHost(hostHeader);

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
