"use client";

import { useEffect } from "react";
import { trackContactClick } from "@/lib/analytics";

/**
 * Delega globale: traccia clic su tel:, WhatsApp e mailto in tutto il sito.
 */
export function GoogleContactTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href")?.trim() || "";
      if (!href) return;

      const lower = href.toLowerCase();

      if (lower.startsWith("tel:")) {
        trackContactClick({ method: "phone", href, label: anchor.textContent?.trim() || "tel" });
        return;
      }

      if (
        lower.includes("wa.me/") ||
        lower.includes("api.whatsapp.com") ||
        lower.includes("whatsapp.com/send")
      ) {
        trackContactClick({
          method: "whatsapp",
          href,
          label: anchor.textContent?.trim() || "whatsapp",
        });
        return;
      }

      if (lower.startsWith("mailto:")) {
        trackContactClick({
          method: "email",
          href,
          label: anchor.textContent?.trim() || "email",
        });
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
