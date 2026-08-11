"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_MEASUREMENT_ID, getPrimaryGoogleTagId } from "@/lib/google-config";
import { readCookiePreferences } from "@/lib/cookie-consent";

/**
 * Page view GA4 sulle navigazioni client-side (App Router),
 * solo se il consenso analitica è già stato concesso.
 */
export function GoogleAnalyticsRouteListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const first = useRef(true);

  useEffect(() => {
    // Il primo hit lo gestisce applyGoogleConsent / gtag config.
    if (first.current) {
      first.current = false;
      return;
    }

    const prefs = readCookiePreferences();
    if (!prefs?.analytics) return;
    if (!GA_MEASUREMENT_ID && !getPrimaryGoogleTagId()) return;

    const w = window as Window & { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag !== "function") return;

    const qs = searchParams?.toString();
    const pagePath = qs ? `${pathname}?${qs}` : pathname;

    w.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
