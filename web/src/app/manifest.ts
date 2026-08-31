import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LILO S.r.l. — Noleggio Auto e Furgoni Trieste",
    short_name: "LILO",
    description:
      "Noleggio auto, furgoni e pulmini 9 posti a Trieste. Tariffe trasparenti, ritiro in sede.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    lang: "it-IT",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo-lilo.webp",
        type: "image/webp",
        sizes: "any",
        purpose: "any",
      },
    ],
    id: SITE_URL,
  };
}
