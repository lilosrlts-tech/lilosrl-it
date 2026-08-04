"use client";

import { openCookiePreferences } from "@/lib/cookie-consent";

/** Link footer per riaprire il banner preferenze cookie. */
export function CookiePreferencesLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => openCookiePreferences()}
      className={
        className ??
        "text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
      }
    >
      Preferenze cookie
    </button>
  );
}
