"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import {
  COOKIE_CONSENT_EVENT,
  readCookiePreferences,
  type CookiePreferences,
} from "@/lib/cookie-consent";

type CookiebotApi = {
  consent?: { statistics?: boolean; marketing?: boolean };
  consented?: boolean;
};

function cookiebotAllowsAnalytics(): boolean | null {
  if (typeof window === "undefined") return null;
  const bot = (window as Window & { Cookiebot?: CookiebotApi }).Cookiebot;
  if (!bot?.consent) return null;
  return Boolean(bot.consent.statistics);
}

/**
 * Carica Vercel Analytics / Speed Insights solo con consenso analitica.
 * Supporta banner first-party LILO e Cookiebot (se configurato).
 */
export function ConsentAwareVercelMetrics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = (prefs?: CookiePreferences | null) => {
      const fromBot = cookiebotAllowsAnalytics();
      if (fromBot != null) {
        setEnabled(fromBot);
        return;
      }
      const current = prefs ?? readCookiePreferences();
      setEnabled(Boolean(current?.analytics));
    };

    sync();

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<CookiePreferences>).detail;
      sync(detail ?? null);
    };

    const onCookiebot = () => sync();

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    window.addEventListener("CookiebotOnAccept", onCookiebot);
    window.addEventListener("CookiebotOnDecline", onCookiebot);
    window.addEventListener("CookiebotOnAcceptAll", onCookiebot);
    window.addEventListener("CookiebotOnDialogDisplay", onCookiebot);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
      window.removeEventListener("CookiebotOnAccept", onCookiebot);
      window.removeEventListener("CookiebotOnDecline", onCookiebot);
      window.removeEventListener("CookiebotOnAcceptAll", onCookiebot);
      window.removeEventListener("CookiebotOnDialogDisplay", onCookiebot);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
