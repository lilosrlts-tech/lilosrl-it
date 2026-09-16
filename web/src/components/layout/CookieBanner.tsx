"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  applyGoogleConsent,
  COOKIE_CONSENT_OPEN_EVENT,
  openCookiePreferences,
  readCookiePreferences,
  type CookieLevel,
  type CookiePreferences,
  writeCookiePreferences,
} from "@/lib/cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [hasPrefs, setHasPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  useEffect(() => {
    const existing = readCookiePreferences();
    if (existing) {
      applyGoogleConsent(existing);
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
      setHasPrefs(true);
      setVisible(false);
    } else {
      setHasPrefs(false);
      setVisible(true);
    }

    function onOpen() {
      const current = readCookiePreferences();
      if (current) {
        setAnalytics(current.analytics);
        setMarketing(current.marketing);
        setCustomizeOpen(true);
        setHasPrefs(true);
      } else {
        setCustomizeOpen(false);
      }
      setVisible(true);
    }

    window.addEventListener(COOKIE_CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(COOKIE_CONSENT_OPEN_EVENT, onOpen);
  }, []);

  function persist(prefs: CookiePreferences) {
    writeCookiePreferences(prefs);
    applyGoogleConsent(prefs);
    setAnalytics(prefs.analytics);
    setMarketing(prefs.marketing);
    setHasPrefs(true);
    setVisible(false);
    setCustomizeOpen(false);
  }

  function saveNecessary() {
    persist({
      version: 1,
      level: "privato",
      analytics: false,
      marketing: false,
      updatedAt: new Date().toISOString(),
    });
  }

  /** Consenso consigliato: analitica sì, marketing no. */
  function saveAccept() {
    persist({
      version: 1,
      level: "equilibrato",
      analytics: true,
      marketing: false,
      updatedAt: new Date().toISOString(),
    });
  }

  function saveCustom() {
    const level: CookieLevel =
      !analytics && !marketing
        ? "privato"
        : analytics && !marketing
          ? "equilibrato"
          : "personalizzato";
    persist({
      version: 1,
      level,
      analytics,
      marketing,
      updatedAt: new Date().toISOString(),
    });
  }

  return (
    <>
      {hasPrefs && !visible ? (
        <button
          type="button"
          onClick={() => openCookiePreferences()}
          className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 z-[90] flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50 md:bottom-4"
          aria-label="Preferenze cookie e privacy"
          title="Preferenze cookie"
        >
          <span className="text-lg" aria-hidden="true">
            ⚙
          </span>
        </button>
      ) : null}

      {visible ? (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex justify-center p-0 sm:inset-0 sm:items-end sm:bg-slate-950/40 sm:p-4 sm:pointer-events-auto md:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
        >
          <div className="pointer-events-auto w-full max-w-lg rounded-t-2xl border border-slate-200 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_28px_rgba(15,23,42,0.14)] sm:rounded-2xl sm:p-5 sm:shadow-xl">
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-slate-200 sm:hidden" aria-hidden="true" />

            <h2
              id="cookie-consent-title"
              className="text-base font-bold text-slate-900 sm:text-lg"
            >
              Questo sito usa i cookie
            </h2>
            <p className="mt-1 text-sm leading-snug text-slate-600">
              Servono al funzionamento del sito. Con il consenso attiviamo anche le statistiche
              (es. Google Analytics).{" "}
              <Link href="/cookie-policy" className="underline underline-offset-2 hover:text-slate-800">
                Cookie Policy
              </Link>
              {" · "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-slate-800">
                Privacy
              </Link>
            </p>

            {customizeOpen ? (
              <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                <label className="flex items-start justify-between gap-3">
                  <span>
                    <span className="font-semibold text-slate-900">Statistiche</span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Visite e pagine (Google Analytics). Non include le metriche cookieless Vercel.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-brand-600"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                  />
                </label>
                <label className="flex items-start justify-between gap-3">
                  <span>
                    <span className="font-semibold text-slate-900">Marketing</span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Annunci e conversioni (es. Google Ads).
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-brand-600"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                  />
                </label>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCustomizeOpen(false)}
                    className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Indietro
                  </button>
                  <button
                    type="button"
                    onClick={saveCustom}
                    className="min-h-11 flex-1 rounded-xl bg-teal-500 px-3 text-sm font-bold text-white hover:bg-teal-600"
                  >
                    Salva
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={saveNecessary}
                    className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Solo necessari
                  </button>
                  <button
                    type="button"
                    onClick={saveAccept}
                    className="min-h-11 flex-1 rounded-xl bg-teal-500 px-3 text-sm font-bold text-white hover:bg-teal-600"
                  >
                    Accetta
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomizeOpen(true)}
                  className="mt-2 w-full py-1 text-center text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
                >
                  Personalizza scelte
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
