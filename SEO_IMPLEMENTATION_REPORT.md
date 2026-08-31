# SEO Implementation Report — LILO S.r.l.

**Ultimo aggiornamento:** 31 agosto 2026 (post-deploy live smoke)  
**Stato:** **COMPLETATO** (Blocchi 1–4 / P0–P3 + ops NAP/IndexNow/copy flotta)  
**Build finale:** `npm run build` OK · IndexNow HTTP 200 (16 URL) · Vercel production READY

---

## Commits principali su `main`

| Blocco | Commit (indicativo) | Contenuto |
|--------|---------------------|-----------|
| 1 | `c6b6766` | NAP centralizzato, favicon/manifest, 404 reali, migration 023 |
| 2 | `fd2e30d` | `/guide` + 5 articoli, pilastro furgoni, cosa-trasporti, linking |
| 3 | `1b20308` | Schema dual entity, headers, consent Analytics, pilastri auto/pulmini |
| 4 | `6807813` | noindex CMS, sitemap legal out, IndexNow, ESLint, cleanup |
| + | `0f290c2`…`93af705` | Autolavaggio JSON-LD, SEO Checkup micro-fix, flotta GEO copy, placeholder guard |

---

## 1. Stato iniziale

Sito Next.js già forte su redirect/canonical/flotta; gap su NAP multi-source, soft-404, pilastri intent, guide, schema lavaggio/tariffe, headers, consent Vercel, noindex CMS ignorato.

## 2. Problemi trovati → risolti

| Area | Azione |
|------|--------|
| NAP/orari | `nap.ts` + sedi resolve + migration 023 **applicata in prod** |
| Soft-404 | Middleware → 404 reali |
| Favicon | `app/icon`, `apple-icon`, `manifest` |
| Contenuti SEO | Guide, 3 pilastri, hub scenari |
| Schema | AutoRental + LocalBusiness lavaggio + OfferCatalog tariffe |
| Headers | HSTS, XFO, nosniff, Referrer-Policy, Permissions-Policy |
| Consent | Vercel metrics gated |
| noindex CMS | `parseRobots(seo.meta_robots)` in `buildPageMetadata` |
| Sitemap | Legal esclusi; pagine CMS noindex escluse |
| IndexNow | Script + `INDEXNOW_ON_BUILD=1` su Vercel Production |
| Flotta copy | «modelli in catalogo» / «unità in flotta» / claim «oltre 50 mezzi» |
| «Foto in arrivo» | Rimosso + filtro difensivo alt/didascalia (0 match live) |

## 3–4. File / route chiave

**Nuove route:** `/guide`, `/guide/[slug]`, `/noleggio-furgoni-trieste`, `/noleggio-auto-trieste`, `/noleggio-pulmini-9-posti-trieste`

**Lib:** `nap.ts`, `fleet-identity.ts`, `guide/*`, `indexnow.ts`, `json-ld` esteso, `seo-settings` robots

## 5. Supabase

| Voce | Stato |
|------|--------|
| Migration `023_sync_nap_orari.sql` | **Applicata in produzione** |
| Nuove tabelle guide | Non create (contenuti in codice) |

## 6–11. Metadata / Schema / Sitemap / Robots / Redirect

- Meta unici su pilastri/guide; robots da CMS  
- Sitemap senza privacy/cookie/termini; esclusione noindex  
- Robots.txt OK (200) · canonical home `https://www.lilosrl.it`  
- Redirect: `/noleggio-furgoni`, `/noleggio-auto` → pilastri (301) · path sconosciuti → 404  

## 12. Performance

Hero preload già presente; Analytics gated; Google tags `lazyOnload`

## 13. Tracking

GA4 + Consent Mode; Vercel solo con analytics consent / Cookiebot statistics

## 14. Sicurezza

Security headers in `next.config.ts`; service role solo preventivo (invariato)

## 15. Cosa resta (ops / monitoraggio)

1. Monitoraggio GSC/Ahrefs (coverage, rich results) nelle prossime 1–2 settimane  
2. Nessun gap strutturale di codice aperto  

## 16. Comandi utili

```bash
cd web
npm run typecheck
npm run lint
npm run build
npm run indexnow
node scripts/live-seo-smoke.mjs
```

---

**Verdetto:** SEO tecnica + pilastri/guide + ops (NAP, IndexNow, copy flotta) chiusi. Residuo = solo monitoraggio ranking/coverage.
