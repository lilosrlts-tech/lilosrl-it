import {
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_CONVERSION_LABEL,
  GOOGLE_ADS_ID,
  GOOGLE_ADS_PHONE_CONVERSION_LABEL,
  GTM_ID,
  getPrimaryGoogleTagId,
} from "@/lib/google-config";

export interface PreventivoConversionParams {
  veicoloId: string;
  veicoloName: string;
}

export interface ContactClickParams {
  method: "phone" | "whatsapp" | "email";
  href?: string;
  label?: string;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function pushDataLayer(payload: Record<string, unknown>): void {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

function hasGtag(): boolean {
  return typeof window.gtag === "function";
}

function fireGaEvent(name: string, params: Record<string, unknown>): void {
  if (!hasGtag()) return;
  if (!GA_MEASUREMENT_ID && !getPrimaryGoogleTagId()) return;
  window.gtag!("event", name, params);
}

/** Conversione Ads solo con label (AW-ID/LABEL) creata in Google Ads. */
function fireAdsConversion(label?: string): void {
  if (!hasGtag() || !GOOGLE_ADS_ID || !label) return;
  window.gtag!("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
  });
}

/**
 * Evento conversione: invio modulo preventivo / contatto.
 */
export function trackPreventivoConversion(params: PreventivoConversionParams): void {
  if (typeof window === "undefined") return;

  pushDataLayer({
    event: "preventivo_inviato",
    veicolo_id: params.veicoloId,
    veicolo_name: params.veicoloName,
  });

  if (GTM_ID && !hasGtag()) return;

  fireGaEvent("generate_lead", {
    event_category: "preventivo",
    event_label: params.veicoloName,
    veicolo_id: params.veicoloId,
    veicolo_name: params.veicoloName,
    currency: "EUR",
  });

  fireGaEvent("form_submit", {
    form_name: "preventivo",
    veicolo_id: params.veicoloId,
    veicolo_name: params.veicoloName,
  });

  fireAdsConversion(GOOGLE_ADS_CONVERSION_LABEL || undefined);
}

/** Clic su telefono (tel:) o WhatsApp / email. */
export function trackContactClick(params: ContactClickParams): void {
  if (typeof window === "undefined") return;

  const eventName =
    params.method === "phone"
      ? "phone_click"
      : params.method === "whatsapp"
        ? "whatsapp_click"
        : "email_click";

  pushDataLayer({
    event: eventName,
    contact_method: params.method,
    link_url: params.href,
    event_label: params.label,
  });

  if (GTM_ID && !hasGtag()) return;

  fireGaEvent(eventName, {
    event_category: "contact",
    event_label: params.label || params.href || params.method,
    method: params.method,
    link_url: params.href,
  });

  fireGaEvent("contact", {
    event_category: "engagement",
    method: params.method,
    link_url: params.href,
  });

  if (params.method === "phone") {
    fireAdsConversion(GOOGLE_ADS_PHONE_CONVERSION_LABEL || undefined);
  }
}

export function trackPhoneClick(href?: string): void {
  trackContactClick({ method: "phone", href, label: "tel" });
}

export function trackWhatsAppClick(href?: string): void {
  trackContactClick({ method: "whatsapp", href, label: "whatsapp" });
}
