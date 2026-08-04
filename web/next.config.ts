import type { NextConfig } from "next";
import { getActiveRedirectRules } from "./src/lib/legacy-redirects";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.lilosrl.it" },
      { protocol: "https", hostname: "lilosrl.it" },
    ],
  },

  /**
   * Redirect 301 permanenti per URL storiche (path).
   * Usa statusCode: 301 (non permanent→308) per tool SEO.
   * Host secondari / apex: src/middleware.ts + REDIRECT_TO_CANONICAL_HOSTS.
   *
   * Per aggiungere rotte: modifica src/lib/legacy-redirects.ts
   */
  async redirects() {
    return getActiveRedirectRules();
  },
};
export default nextConfig;
