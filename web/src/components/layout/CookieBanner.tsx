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
          className="fixed inset-x-0 bottom-0 z-[100] flex justify-center p-0 sm:inset-0 sm:items-center sm:bg-slate-950/55 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
        >
          {/* Mobile: foglio basso senza oscurare tutta la pagina */}
          <div className="max-h-[min(70vh,32rem)] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-4 shadow-[0_-8px_30px_rgba(15,23,42,0.15)] sm:max-h-[92vh] sm:max-w-2xl sm:rounded-2xl sm:p-8 sm:shadow-2xl">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200 sm:hidden" aria-hidden="true" />
            <p className="text-xs font-medium text-slate-400">{hostLabel()}</p>
            <h2
              id="cookie-consent-title"
              className="mt-1 text-base font-bold leading-snug text-slate-900 sm:mt-2 sm:text-center sm:text-xl"
            >
              <span className="sm:hidden">Privacy e cookie</span>
              <span className="hidden sm:inline">
                Consideriamo i tuoi dati una tua proprietà e sosteniamo il tuo diritto alla privacy
                e alla trasparenza.
              </span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-center">
              <span className="sm:hidden">
                Scegli quanto possiamo usare i cookie. Puoi cambiare in qualsiasi momento.
              </span>
              <span className="hidden sm:inline">
                Per offrirvi la migliore esperienza sul nostro sito web, utilizziamo cookie o
                tecnologie simili. Selezionate un livello di accesso ai dati per decidere per quali
                scopi possiamo utilizzare e condividere i vostri dati.
              </span>
            </p>

            <div
              className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:justify-center"
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
                    className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-3 py-2.5 text-sm font-semibold transition ${
                      selected
                        ? "border-slate-800 bg-slate-800 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.swatch} ${
                        selected ? "ring-2 ring-white/40" : ""
                      }`}
                      aria-hidden="true"
                    />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:mt-5 sm:text-center">
              {copy.description}
            </p>

            {(customizeOpen || level === "personalizzato") && (
              <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <label className="flex items-start justify-between gap-3">
                  <span>
                    <span className="font-semibold text-slate-900">Analitica</span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Misura visite e uso delle pagine (es. Google Analytics).
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

            <div className="mt-4 flex justify-center pb-[max(0.25rem,env(safe-area-inset-bottom))] sm:mt-6 sm:pb-0">
              <button
                type="button"
                onClick={save}
                className="w-full max-w-sm rounded-xl bg-teal-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-600 sm:w-auto sm:min-w-[240px]"
              >
                Salva le mie preferenze
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 sm:mt-5">
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
              <Link
                href="/privacy"
                className="font-medium text-slate-600 underline-offset-2 hover:underline"
              >
                Informativa sulla privacy
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
