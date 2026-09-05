import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
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
  metadataBase: new URL("https://www.lilosrl.it"),
  title: {
    default: "Noleggio Auto e Furgoni Trieste | LILO",
    template: "%s",
  },
  description:
    "Noleggio auto e furgoni a Trieste. Flotta moderna, tariffe trasparenti, ritiro in sede in Viale Campi Elisi.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/favicon-32.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
        {/* Vercel Web Analytics + Speed Insights: cookieless / GDPR, no prior consent required */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
