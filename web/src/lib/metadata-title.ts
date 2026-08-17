import type { Metadata } from "next";
import { SEO_TITLE_MAX, truncateSeoText } from "@/lib/seo-limits";

/**
 * Title sempre assoluto (niente suffisso dal layout) e mai oltre 60 caratteri.
 */
export function resolveMetadataTitle(title: string): Metadata["title"] {
  const trimmed = title.replace(/\s+/g, " ").trim();
  const fitted =
    trimmed.length > SEO_TITLE_MAX ? truncateSeoText(trimmed, SEO_TITLE_MAX) : trimmed;
  return { absolute: fitted || "LILO S.r.l. — Autonoleggio Trieste" };
}
