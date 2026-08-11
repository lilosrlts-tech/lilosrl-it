import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { GoogleTags } from "@/components/analytics/GoogleTags";
import { GooglePhoneConversion } from "@/components/analytics/GooglePhoneConversion";
import { GoogleContactTracking } from "@/components/analytics/GoogleContactTracking";
import { GoogleAnalyticsRouteListener } from "@/components/analytics/GoogleAnalyticsRouteListener";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { GOOGLE_SITE_VERIFICATION } from "@/lib/google-config";
import { SITE_URL, COMPANY } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LILO S.r.l. — Autonoleggio Trieste",
    template: "%s | LILO Autonoleggio Trieste",
  },
  description:
    "Noleggio auto e furgoni a Trieste. Flotta moderna, tariffe trasparenti, ritiro in sede in Viale Campi Elisi.",
  // Canonical per-pagina: impostato in generateMetadata di ogni route (no default home qui).
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: SITE_URL,
    siteName: "LILO S.r.l. — Autonoleggio Trieste",
  },
  robots: { index: true, follow: true },
  ...(GOOGLE_SITE_VERIFICATION && {
    verification: { google: GOOGLE_SITE_VERIFICATION },
  }),
  other: {
    "geo.region": "IT-TS",
    "geo.placename": COMPANY.city,
    google: "notranslate",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" translate="no" className="notranslate">
      <body className={`${inter.variable} font-sans`}>
        <GoogleTags />
        <GooglePhoneConversion />
        <GoogleContactTracking />
        <Suspense fallback={null}>
          <GoogleAnalyticsRouteListener />
        </Suspense>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
