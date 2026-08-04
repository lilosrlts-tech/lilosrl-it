import { NextRequest } from "next/server";
import {
  handleRouteError,
  jsonSuccess,
  requireAdmin,
} from "@/lib/api-utils";
import { getAllSeoSettings, updateSeoSettings } from "@/lib/services/seo";
import { seoSettingsUpdateSchema } from "@/lib/validations-seo";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const data = await getAllSeoSettings();
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    const parsed = seoSettingsUpdateSchema.parse(body);
    const { page_key, ...fields } = parsed;

    const data = await updateSeoSettings(page_key, fields);
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
