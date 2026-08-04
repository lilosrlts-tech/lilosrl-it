import Script from "next/script";
import { CookieBanner } from "@/components/layout/CookieBanner";

/**
 * GDPR / cookie consent.
 *
 * Priorità:
 * 1. Cookiebot — se NEXT_PUBLIC_COOKIEBOT_ID
 * 2. Iubenda — se NEXT_PUBLIC_IUBENDA_SITE_ID (+ cookie policy id)
 * 3. Banner first-party LILO (Privato / Equilibrato / Personalizzato) + Consent Mode v2
 */
export function CookieConsent() {
  const iubendaId = process.env.NEXT_PUBLIC_IUBENDA_SITE_ID?.trim();
  const iubendaCookieId = process.env.NEXT_PUBLIC_IUBENDA_COOKIE_POLICY_ID?.trim();
  const cookiebotId = process.env.NEXT_PUBLIC_COOKIEBOT_ID?.trim();

  if (cookiebotId) {
    return (
      <Script
        id="cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid={cookiebotId}
        data-blockingmode="auto"
        strategy="afterInteractive"
      />
    );
  }

  if (iubendaId) {
    return (
      <>
        <Script
          id="iubenda-autoblocking"
          src={`https://cs.iubenda.com/autoblocking/${iubendaId}.js`}
          strategy="beforeInteractive"
        />
        <Script id="iubenda-config" strategy="beforeInteractive">
          {`
            var _iub = _iub || [];
            _iub.csConfiguration = {
              siteId: ${JSON.stringify(iubendaId)},
              cookiePolicyId: ${JSON.stringify(iubendaCookieId || iubendaId)},
              lang: "it",
              consentOnContinuedBrowsing: false,
              perPurposeConsent: true,
              googleAdditionalConsentMode: true,
              banner: {
                acceptButtonDisplay: true,
                customizeButtonDisplay: true,
                rejectButtonDisplay: true,
                position: "float-center",
                acceptButtonColor: "#14B8A6",
                acceptButtonCaptionColor: "white",
                rejectButtonColor: "#F1F5F9",
                rejectButtonCaptionColor: "#0F172A"
              }
            };
          `}
        </Script>
        <Script
          id="iubenda-cs"
          src="https://cdn.iubenda.com/cs/iubenda_cs.js"
          strategy="afterInteractive"
        />
      </>
    );
  }

  return <CookieBanner />;
}
