# SEO Implementation Report — LILO S.r.l.

**Ultimo aggiornamento:** 31 agosto 2026  
**Stato:** **COMPLETATO** (Blocchi 1–4 / P0–P3)  
**Build finale:** `npm run build` OK · `tsc --noEmit` OK · IndexNow HTTP 200 (16 URL)

---

## Commits principali su `main`

| Blocco | Commit (indicativo) | Contenuto |
|--------|---------------------|-----------|
| 1 | `c6b6766` | NAP centralizzato, favicon/manifest, 404 reali, migration 023 |
| 2 | `fd2e30d` | `/guide` + 5 articoli, pilastro furgoni, cosa-trasporti, linking |
| 3 | `1b20308` | Schema dual entity, headers, consent Analytics, pilastri auto/pulmini |
| 4 | (questo push) | noindex CMS, sitemap legal out, IndexNow, ESLint, cleanup |

---

## 1. Stato iniziale

Sito Next.js già forte su redirect/canonical/flotta; gap su NAP multi-source, soft-404, pilastri intent, guide, schema lavaggio/tariffe, headers, consent Vercel, noindex CMS ignorato.

## 2. Problemi trovati → risolti

| Area | Azione |
|------|--------|
| NAP/orari | `nap.ts` + sedi resolve + migration 023 |
| Soft-404 | Middleware → 404 reali |
| Favicon | `app/icon`, `apple-icon`, `manifest` |
| Contenuti SEO | Guide, 3 pilastri, hub scenari |
| Schema | AutoRental + LocalBusiness lavaggio + OfferCatalog tariffe |
| Headers | HSTS, XFO, nosniff, Referrer-Policy, Permissions-Policy |
| Consent | Vercel metrics gated |
| noindex CMS | `parseRobots(seo.meta_robots)` in `buildPageMetadata` |
| Sitemap | Legal esclusi; pagine CMS noindex escluse |
| IndexNow | Script + `getIndexNowPriorityUrls()`; notify 16 URL OK |

## 3–4. File / route chiave

**Nuove route:** `/guide`, `/guide/[slug]`, `/noleggio-furgoni-trieste`, `/noleggio-auto-trieste`, `/noleggio-pulmini-9-posti-trieste`

**Lib:** `nap.ts`, `guide/*`, `indexnow.ts`, `json-ld` esteso, `seo-settings` robots

## 5. Supabase

| Voce | Stato |
|------|--------|
| Migration `023_sync_nap_orari.sql` | In repo — **applicare in prod** |
| Nuove tabelle guide | Non create (contenuti in codice) |

## 6–11. Metadata / Schema / Sitemap / Robots / Redirect

- Meta unici su pilastri/guide; robots da CMS  
- Sitemap senza privacy/cookie/termini; esclusione noindex  
- Robots.txt invariato (allow `/`, sitemap www)  
- Redirect: `/noleggio-furgoni`, `/noleggio-auto` → pilastri  

## 12. Performance

Hero preload già presente; Analytics gated; client audit: rimosso import inutilizzato `Link` in `SiteChrome`

## 13. Tracking

GA4 + Consent Mode; Vercel solo con analytics consent / Cookiebot statistics

## 14. Sicurezza

Security headers in `next.config.ts`; service role solo preventivo (invariato)

## 15. Cosa resta (ops / contenuto)

1. **Applicare migration 023** su Supabase  
2. Foto flotta incomplete in Storage  
3. Opzionale: env Vercel `INDEXNOW_ON_BUILD=1`  
4. Monitoraggio GSC/Ahrefs post-deploy  

## 16. Comandi utili

```bash
cd web
npm run typecheck
npm run lint
npm run build
npm run indexnow          # FORCE via script; o FORCE_INDEXNOW=1
```

---

**Verdetto:** architettura SEO tecnica e contenuti pilastro/guide allineati al piano Opzione A. Residui = dati operativi (SQL NAP, foto), non gap strutturali di codice.
