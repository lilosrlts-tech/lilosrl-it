/**
 * Configurazione tag Google (Tag unificato, Analytics, Ads, Search Console, chiamate).
 * Override via web/.env.local / Vercel — i default sono i codici ufficiali LILO.
 */

/** Verifica proprietà Google Search Console (meta google-site-verification). */
export const GOOGLE_SITE_VERIFICATION =
  process.env.GOOGLE_SITE_VERIFICATION?.trim() || "";

/** Google tag unificato (prefisso GT-). */
export const GOOGLE_TAG_ID =
  process.env.NEXT_PUBLIC_GOOGLE_TAG_ID?.trim() || "GT-MRQFTWP9";

/** Google Analytics 4 — ID misurazione. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-H1NS1CSJ0B";

/**
 * Google Tag Manager classico (prefisso GTM-).
 * Lasciare vuoto se si usa il Google tag GT- (non mischiare i due snipper).
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || "";

/** Google Ads account / tag (prefisso AW-). */
export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() ||
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID?.trim() ||
  "AW-966829199";

/** @deprecated alias — usa GOOGLE_ADS_ID */
export const GOOGLE_ADS_CONVERSION_ID = GOOGLE_ADS_ID;

/** Label conversione Ads su invio form (opzionale, da Ads → Conversioni). */
export const GOOGLE_ADS_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL?.trim() || "";

/** Classe CSS per Google Ads Phone Call Conversion (default: google-phone). */
export const GOOGLE_PHONE_CSS_CLASS =
  process.env.NEXT_PUBLIC_GOOGLE_PHONE_CSS_CLASS?.trim() || "google-phone";

/** Numero E.164 per sostituzione dinamica AdWords (default LILO). */
export const GOOGLE_PHONE_CONVERSION_NUMBER =
  process.env.NEXT_PUBLIC_GOOGLE_PHONE_CONVERSION_NUMBER?.trim() || "+390402471720";

export const GOOGLE_ADS_PHONE_CONVERSION_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_ID?.trim() || GOOGLE_ADS_ID;

export const GOOGLE_ADS_PHONE_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_LABEL?.trim() || "";

/** Dominio cookie / linker per www.lilosrl.it + apex. */
export const GOOGLE_COOKIE_DOMAIN = "lilosrl.it";
export const GOOGLE_LINKER_DOMAINS = ["lilosrl.it", "www.lilosrl.it"] as const;

export function getGoogleGtagIds(): string[] {
  const ids = [GOOGLE_TAG_ID, GA_MEASUREMENT_ID, GOOGLE_ADS_ID].filter(Boolean);
  return [...new Set(ids)];
}

export function getPrimaryGoogleTagId(): string {
  return GOOGLE_TAG_ID || GA_MEASUREMENT_ID || GOOGLE_ADS_ID || "";
}

export function isGoogleTrackingEnabled(): boolean {
  return Boolean(GTM_ID || getPrimaryGoogleTagId());
}

export function useGtm(): boolean {
  return Boolean(GTM_ID);
}

export function isGooglePhoneConversionEnabled(): boolean {
  return Boolean(GOOGLE_ADS_PHONE_CONVERSION_ID && GOOGLE_ADS_PHONE_CONVERSION_LABEL);
}
