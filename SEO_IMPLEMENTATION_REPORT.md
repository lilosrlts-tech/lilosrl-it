# SEO Implementation Report — LILO S.r.l.

**Ultimo aggiornamento:** 31 agosto 2026  
**Fase corrente:** Blocco 3 completato (P2 schema / headers / consent / pilastri)  
**Build:** `npm run build` OK — 53 route

---

## Blocchi precedenti

| Blocco | Commit | Contenuto |
|--------|--------|-----------|
| 1 | `c6b6766` | NAP, favicon, 404 reali, migration 023 |
| 2 | `fd2e30d` | Guide, pilastro furgoni, cosa-trasporti, linking |

**Azione ancora richiesta:** applicare `023_sync_nap_orari.sql` su Supabase produzione.

---

## Blocco 3 — modifiche

### 1. Schema.org / dual entity
- `buildAutolavaggioJsonLd`: **LocalBusiness** dedicato (sede Schiaparelli), distinto da AutoRental noleggio. Nessun tipo inventato «AutoWash» (non esiste in schema.org).
- Contatti: graph con **AutoRental + LocalBusiness autolavaggio + Organization**
- Home: stub LocalBusiness `#autolavaggio` nel graph
- `buildTariffeJsonLd`: **WebPage + OfferCatalog + UnitPriceSpecification** da listino reale veicoli

### 2. Security headers (`next.config.ts`)
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### 3. Performance / cookie consent
- Nuovo `ConsentAwareVercelMetrics`: Analytics + Speed Insights solo con `analytics` (banner LILO o Cookiebot `consent.statistics`)
- Layout non monta più Analytics/SpeedInsights senza consenso

### 4. Pilastri secondari
- `/noleggio-auto-trieste`
- `/noleggio-pulmini-9-posti-trieste`
- Pattern come furgoni: In breve, CTA, FAQ, link a `/flotta/...` senza duplicare griglie
- Footer + sitemap + `llms.txt` + redirect `/noleggio-auto` → pilastro

---

## File principali Blocco 3

**Creati:**  
`ConsentAwareVercelMetrics.tsx`, `noleggio-auto-trieste/page.tsx`, `noleggio-pulmini-9-posti-trieste/page.tsx`

**Modificati:**  
`json-ld.ts`, `autolavaggio/page.tsx`, `tariffe-…/page.tsx`, `layout.tsx`, `next.config.ts`, `nav-config.ts`, `sitemap.ts`, `legacy-redirects.ts`, `llms.txt`, report

---

## Cosa resta

1. Migration NAP 023 su Supabase  
2. Foto flotta incomplete  
3. P2 residuo: lazy map / bundle client audit approfondito  
4. P3: noindex CMS, eventi GA4 estesi, IndexNow on publish  

---

## Priorità future

Chiudere ops migration → foto → P3 polish.
