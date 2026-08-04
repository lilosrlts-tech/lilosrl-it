"use client";

import { useEffect } from "react";
import {
  GOOGLE_ADS_PHONE_CONVERSION_ID,
  GOOGLE_ADS_PHONE_CONVERSION_LABEL,
  GOOGLE_PHONE_CONVERSION_NUMBER,
  GOOGLE_PHONE_CSS_CLASS,
  isGooglePhoneConversionEnabled,
} from "@/lib/google-config";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Ads — Phone Call Conversion Tracking.
 * Traccia i clic sui link con classe google-phone e abilita la sostituzione numero AdWords.
 */
export function GooglePhoneConversion() {
  useEffect(() => {
    if (!isGooglePhoneConversionEnabled()) return;

    const sendTo = `${GOOGLE_ADS_PHONE_CONVERSION_ID}/${GOOGLE_ADS_PHONE_CONVERSION_LABEL}`;

    function configure(): boolean {
      if (typeof window.gtag !== "function") return false;
      window.gtag("config", sendTo, {
        phone_conversion_number: GOOGLE_PHONE_CONVERSION_NUMBER,
        phone_conversion_css_class: GOOGLE_PHONE_CSS_CLASS,
      });
      return true;
    }

    if (configure()) return;

    const interval = window.setInterval(() => {
      if (configure()) window.clearInterval(interval);
    }, 250);

    return () => window.clearInterval(interval);
  }, []);

  return null;
}
