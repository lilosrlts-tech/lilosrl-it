export type CookieLevel = "privato" | "equilibrato" | "personalizzato";

export interface CookiePreferences {
  version: 1;
  level: CookieLevel;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

export const COOKIE_CONSENT_KEY = "lilo_cookie_consent";
export const COOKIE_CONSENT_EVENT = "lilo:cookie-consent";
export const COOKIE_CONSENT_OPEN_EVENT = "lilo:cookie-open";

export function defaultPreferences(level: CookieLevel = "privato"): CookiePreferences {
  if (level === "equilibrato") {
    return {
      version: 1,
      level,
      analytics: true,
      marketing: false,
      updatedAt: new Date().toISOString(),
    };
  }
  if (level === "personalizzato") {
    return {
      version: 1,
      level,
      analytics: false,
      marketing: false,
      updatedAt: new Date().toISOString(),
    };
  }
  return {
    version: 1,
    level: "privato",
    analytics: false,
    marketing: false,
    updatedAt: new Date().toISOString(),
  };
}

export function readCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookiePreferences;
    if (parsed?.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeCookiePreferences(prefs: CookiePreferences): void {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: prefs }));
}

export function openCookiePreferences(): void {
  window.dispatchEvent(new Event(COOKIE_CONSENT_OPEN_EVENT));
}

/** Aggiorna Google Consent Mode v2 via dataLayer (funziona anche prima che gtag.js sia scaricato). */
export function applyGoogleConsent(prefs: CookiePreferences): void {
  if (typeof window === "undefined") return;

  const payload = {
    analytics_storage: prefs.analytics ? "granted" : "denied",
    ad_storage: prefs.marketing ? "granted" : "denied",
    ad_user_data: prefs.marketing ? "granted" : "denied",
    ad_personalization: prefs.marketing ? "granted" : "denied",
    personalization_storage: prefs.analytics || prefs.marketing ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  };

  const w = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

  w.dataLayer = w.dataLayer || [];
  // Stub gtag come nello snippet ufficiale (Arguments, non array).
  if (typeof w.gtag !== "function") {
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
  }
  w.gtag("consent", "update", payload);

  // Dopo il grant, la page_view iniziale era bloccata dal default "denied":
  // reinviarla altrimenti GA4 resta a 0 finché l’utente non cambia pagina.
  if (prefs.analytics) {
    w.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
    });
  }
}

export const LEVEL_COPY: Record<
  CookieLevel,
  { label: string; description: string; swatch: string }
> = {
  privato: {
    label: "Privato",
    description:
      "Livello più alto di privacy. Solo cookie necessari al funzionamento del sito (sicurezza, sessione, preferenze di consenso). Nessuna statistica né pubblicità.",
    swatch: "bg-slate-500",
  },
  equilibrato: {
    label: "Equilibrato",
    description:
      "Consenti le statistiche anonime (es. Google Analytics) per capire come migliorare il sito. Restano disattivati i cookie pubblicitari e di profilazione.",
    swatch: "bg-amber-500",
  },
  personalizzato: {
    label: "Personalizzato",
    description:
      "Scegli tu cosa abilitare: analitica e/o marketing. Puoi modificare le preferenze in qualsiasi momento dal footer.",
    swatch: "bg-violet-400",
  },
};
