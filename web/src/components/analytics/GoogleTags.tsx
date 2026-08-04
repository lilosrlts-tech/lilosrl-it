import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import {
  getGoogleGtagIds,
  getPrimaryGoogleTagId,
  GOOGLE_COOKIE_DOMAIN,
  GOOGLE_LINKER_DOMAINS,
  GTM_ID,
} from "@/lib/google-config";

/**
 * Tag Google con Consent Mode v2:
 * default = denied su analytics/ads finché il banner non aggiorna il consenso.
 */
export function GoogleTags() {
  if (GTM_ID) {
    return (
      <>
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
          `.trim()}
        </Script>
        <GoogleTagManager gtmId={GTM_ID} />
      </>
    );
  }

  const primaryId = getPrimaryGoogleTagId();
  const ids = getGoogleGtagIds();
  if (!primaryId || ids.length === 0) return null;

  const linkerDomains = GOOGLE_LINKER_DOMAINS.map((d) => `'${d}'`).join(", ");
  const configCalls = ids
    .map(
      (id) =>
        `gtag('config', '${id}', { cookie_domain: '${GOOGLE_COOKIE_DOMAIN}', linker: { domains: [${linkerDomains}] }, anonymize_ip: true });`,
    )
    .join("\n    ");

  return (
    <>
      <Script id="google-consent-default" strategy="beforeInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
        `.trim()}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="google-gtag-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${configCalls}
        `.trim()}
      </Script>
    </>
  );
}
