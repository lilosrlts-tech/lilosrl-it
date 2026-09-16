"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  applyGoogleConsent,
  COOKIE_CONSENT_OPEN_EVENT,
  LEVEL_COPY,
  openCookiePreferences,
  readCookiePreferences,
  type CookieLevel,
  type CookiePreferences,
  writeCookiePreferences,
} from "@/lib/cookie-consent";
import { SITE_URL } from "@/lib/constants";

function hostLabel(): string {
  try {
    return new URL(SITE_URL).hostname.replace(/^www\./, "");
  } catch {
    return "lilosrl.it";
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [hasPrefs, setHasPrefs] = useState(false);
  const [level, setLevel] = useState<CookieLevel>("privato");
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  useEffect(() => {
    const existing = readCookiePreferences();
    if (existing) {
      applyGoogleConsent(existing);
      setLevel(existing.level);
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
        setLevel(current.level);
        setAnalytics(current.analytics);
        setMarketing(current.marketing);
        setCustomizeOpen(current.level === "personalizzato");
        setHasPrefs(true);
      }
      setVisible(true);
    }

    window.addEventListener(COOKIE_CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(COOKIE_CONSENT_OPEN_EVENT, onOpen);
  }, []);

  function selectLevel(next: CookieLevel) {
    setLevel(next);
    if (next === "privato") {
      setAnalytics(false);
      setMarketing(false);
      setCustomizeOpen(false);
    } else if (next === "equilibrato") {
      setAnalytics(true);
      setMarketing(false);
      setCustomizeOpen(false);
    } else {
      setCustomizeOpen(true);
    }
  }

  function save() {
    const prefs: CookiePreferences = {
      version: 1,
      level,
      analytics,
      marketing,
      updatedAt: new Date().toISOString(),
    };
    if (level === "privato") {
      prefs.analytics = false;
      prefs.marketing = false;
    } else if (level === "equilibrato") {
      prefs.analytics = true;
      prefs.marketing = false;
    }
    writeCookiePreferences(prefs);
    applyGoogleConsent(prefs);
    setHasPrefs(true);
    setVisible(false);
  }

  const copy = LEVEL_COPY[level];

  return (
    <>
      {/* Icona floating dopo il consenso — ripristina preferenze */}
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
          className="fixed inset-x-0 bottom-0 z-[100] flex justify-center p-0 pointer-events-none sm:inset-0 sm:items-center sm:bg-slate-950/55 sm:p-6 sm:pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
        >
          {/* Mobile: barra bassa compatta — non copre l’hero / non oscura la pagina */}
          <div className="pointer-events-auto max-h-[min(42vh,20rem)] w-full overflow-y-auto rounded-t-xl border border-slate-200 bg-white px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-6px_24px_rgba(15,23,42,0.12)] sm:max-h-[92vh] sm:max-w-2xl sm:rounded-2xl sm:p-8 sm:shadow-2xl">
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-slate-200 sm:hidden" aria-hidden="true" />
            <p className="hidden text-xs font-medium text-slate-400 sm:block">{hostLabel()}</p>
            <h2
              id="cookie-consent-title"
              className="text-sm font-bold leading-snug text-slate-900 sm:mt-2 sm:text-center sm:text-xl"
            >
              <span className="sm:hidden">Cookie</span>
              <span className="hidden sm:inline">
                Consideriamo i tuoi dati una tua proprietà e sosteniamo il tuo diritto alla privacy
                e alla trasparenza.
              </span>
            </h2>
            <p className="mt-0.5 text-xs leading-snug text-slate-500 sm:mt-2 sm:text-center sm:text-sm sm:leading-relaxed sm:text-slate-600">
              <span className="sm:hidden">Scegli il livello, poi salva. Modificabile dal footer.</span>
              <span className="hidden sm:inline">
                Per offrirvi la migliore esperienza sul nostro sito web, utilizziamo cookie o
                tecnologie simili. Selezionate un livello di accesso ai dati per decidere per quali
                scopi possiamo utilizzare e condividere i vostri dati.
              </span>
            </p>

            <div
              className="mt-2.5 flex flex-row gap-1.5 sm:mt-6 sm:justify-center sm:gap-2"
              role="radiogroup"
              aria-label="Livello di privacy"
            >
              {(Object.keys(LEVEL_COPY) as CookieLevel[]).map((key) => {
                const item = LEVEL_COPY[key];
                const selected = level === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => selectLevel(key)}
                    className={`flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full border px-1.5 py-1.5 text-[11px] font-semibold leading-tight transition sm:gap-2 sm:px-3 sm:py-2.5 sm:text-sm ${
                      selected
                        ? "border-slate-800 bg-slate-800 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full sm:h-2.5 sm:w-2.5 ${item.swatch} ${
                        selected ? "ring-2 ring-white/40" : ""
                      }`}
                      aria-hidden="true"
                    />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-2 hidden text-sm leading-relaxed text-slate-600 sm:mt-5 sm:block sm:text-center">
              {copy.description}
            </p>
            <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-slate-500 sm:hidden">
              {copy.description}
            </p>

            {(customizeOpen || level === "personalizzato") && (
              <div className="mt-2 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm sm:mt-4 sm:space-y-3 sm:rounded-xl sm:p-4">
                <label className="flex items-start justify-between gap-3">
                  <span>
                    <span className="font-semibold text-slate-900">Analitica</span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Misura visite e uso delle pagine (es. Google Analytics). Non include le metriche cookieless di hosting Vercel.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-brand-600"
                    checked={analytics}
                    onChange={(e) => {
                      setLevel("personalizzato");
                      setAnalytics(e.target.checked);
                    }}
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
                    onChange={(e) => {
                      setLevel("personalizzato");
                      setMarketing(e.target.checked);
                    }}
                  />
                </label>
              </div>
            )}

            <div className="mt-2.5 flex gap-2 sm:mt-6 sm:justify-center sm:pb-0">
              <button
                type="button"
                onClick={() => {
                  const prefs: CookiePreferences = {
                    version: 1,
                    level: "privato",
                    analytics: false,
                    marketing: false,
                    updatedAt: new Date().toISOString(),
                  };
                  writeCookiePreferences(prefs);
                  applyGoogleConsent(prefs);
                  setLevel("privato");
                  setAnalytics(false);
                  setMarketing(false);
                  setHasPrefs(true);
                  setVisible(false);
                }}
                className="min-h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-50 sm:hidden"
              >
                Solo necessari
              </button>
              <button
                type="button"
                onClick={save}
                className="min-h-10 flex-[1.2] rounded-lg bg-teal-500 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-teal-600 sm:w-auto sm:min-w-[240px] sm:flex-none sm:rounded-xl sm:px-6 sm:py-3 sm:text-sm"
              >
                <span className="sm:hidden">Salva</span>
                <span className="hidden sm:inline">Salva le mie preferenze</span>
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-slate-500 sm:mt-5 sm:text-xs">
              <button
                type="button"
                onClick={() => {
                  setLevel("personalizzato");
                  setCustomizeOpen(true);
                }}
                className="font-medium text-slate-600 underline-offset-2 hover:underline"
              >
                Personalizza
              </button>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <Link
                  href="/privacy"
                  className="font-medium text-slate-600 underline-offset-2 hover:underline"
                >
                  Privacy
                </Link>
                <Link
                  href="/cookie-policy"
                  className="font-medium text-slate-600 underline-offset-2 hover:underline"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
