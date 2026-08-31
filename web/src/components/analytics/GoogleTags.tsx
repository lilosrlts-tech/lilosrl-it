import Script from "next/script";
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
 *
 * Caricamento tag esterni: `lazyOnload` (non blocca il first paint / LCP).
 * Solo lo stub consent resta `beforeInteractive`.
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
        <Script id="google-gtm-init" strategy="lazyOnload">
          {`
(function(w,l){
  w[l]=w[l]||[];
  w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
})(window,'dataLayer');
          `.trim()}
        </Script>
        <Script
          id="google-gtm"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
          strategy="lazyOnload"
        />
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
        strategy="lazyOnload"
      />
      <Script id="google-gtag-init" strategy="lazyOnload">
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
