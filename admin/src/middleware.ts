import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const PROTECTED_PAGE_PREFIXES = ["/admin"];
const PROTECTED_API_PREFIXES = [
  "/api/categorie",
  "/api/veicoli",
  "/api/impostazioni-sito",
  "/api/seo-settings",
  "/api/accessori",
  "/api/promozioni",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPage = PROTECTED_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isProtectedApi =
    PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix)) &&
    !pathname.startsWith("/api/auth");

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isAuthenticated = await verifySessionToken(token);

  if (isAuthenticated) {
    return NextResponse.next();
  }

  if (isProtectedApi) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/categorie/:path*",
    "/api/veicoli/:path*",
    "/api/impostazioni-sito",
    "/api/seo-settings",
    "/api/accessori/:path*",
    "/api/promozioni/:path*",
  ],
};
