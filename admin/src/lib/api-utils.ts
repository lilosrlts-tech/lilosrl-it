import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { ApiErrorBody } from "@/types/database";
import { ZodError } from "zod";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  verifyAdminPassword,
  verifySessionToken,
} from "@/lib/session";

export { SESSION_COOKIE } from "@/lib/session";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function setSessionCookie(response: NextResponse): Promise<NextResponse> {
  const token = await createSessionToken();
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}

export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export function jsonError(
  message: string,
  status = 400,
  details?: unknown
): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: message, details }, { status });
}

export function jsonSuccess<T>(data: T, status = 200): NextResponse<{ data: T }> {
  return NextResponse.json({ data }, { status });
}

export async function requireAdmin(
  request?: NextRequest
): Promise<NextResponse<ApiErrorBody> | null> {
  const cookieToken = request?.cookies.get(SESSION_COOKIE)?.value;
  if (await verifySessionToken(cookieToken)) return null;

  const authed = await isAdminAuthenticated();
  if (authed) return null;

  return jsonError("Non autorizzato", 401);
}

export function handleRouteError(error: unknown): NextResponse<ApiErrorBody> {
  if (error instanceof ZodError) {
    return jsonError("Dati non validi", 422, error.flatten());
  }

  if (error instanceof Error) {
    if (error.message.includes("duplicate key")) {
      return jsonError("Record duplicato (slug o targa già esistente)", 409);
    }
    console.error("[API]", error.message);
    return jsonError(error.message, 500);
  }

  console.error("[API] Errore sconosciuto", error);
  return jsonError("Errore interno del server", 500);
}

export { verifyAdminPassword };
