import type { NextConfig } from "next";
import { getActiveRedirectRules } from "./src/lib/legacy-redirects";

const nextConfig: NextConfig = {
  /**
   * Evita il 308 automatico di Next sullo slash finale (catena 308→301 in GSC).
   * Trailing slash → destinazione finale gestita da redirects 301 + middleware.
   */
  skipTrailingSlashRedirect: true,

  images: {
    formats: ["image/avif", "image/webp"],
    /** Include 640/800 per LCP mobile (hero e full-bleed). */
    deviceSizes: [640, 750, 800, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
