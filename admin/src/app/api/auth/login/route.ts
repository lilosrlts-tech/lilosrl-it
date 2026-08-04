import { NextRequest } from "next/server";
import {
  handleRouteError,
  jsonError,
  jsonSuccess,
  requireAdmin,
  clearSessionCookie,
  setSessionCookie,
  verifyAdminPassword,
} from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = String(body.password ?? "");

    if (!verifyAdminPassword(password)) {
      return jsonError("Password non valida", 401);
    }

    const response = jsonSuccess({ authenticated: true });
    return await setSessionCookie(response);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE() {
  const response = jsonSuccess({ authenticated: false });
  return clearSessionCookie(response);
}
