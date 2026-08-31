# SEO Implementation Report — LILO S.r.l.

**Ultimo aggiornamento:** 31 agosto 2026  
**Fase corrente:** Blocco 2 completato (P1 contenuti)  
**Build:** `npm run build` OK (Next.js 15.5.19) — 51 route statiche/dinamiche

---

## 1. Stato iniziale (sintesi)

- NAP multi-source, soft-404, favicon assente → **risolti in Blocco 1** (`c6b6766`)
- Nessun hub `/guide`, nessun pilastro `/noleggio-furgoni-trieste`
- `/cosa-trasporti` = solo wizard + FAQ

---

## 2–3. Modifiche Blocco 1 (già su main)

Vedi commit `c6b6766`: NAP `nap.ts`, migration `023`, favicon/manifest, 404 reali, rimozione «Foto in arrivo».

**Azione ancora richiesta:** applicare `023_sync_nap_orari.sql` su Supabase produzione.

---

## 3b. Modifiche Blocco 2

### Guide (`/guide`)
- Sistema editoriale TypeScript: `web/src/lib/guide/`
- Hub `/guide` + articoli `/guide/[slug]` (SSG)
- **5 articoli** answer-first con FAQ, CTA, internal links, JSON-LD Article/FAQ/Breadcrumb:
  1. `quale-furgone-scegliere-per-trasloco`
  2. `quanto-costa-noleggiare-furgone-trieste` (prezzi da `TARIFFE_CATEGORIA`)
  3. `che-patente-serve-per-furgone` (senza inventare requisiti)
  4. `quanti-metri-cubi-servono-per-trasloco`
  5. `furgone-per-frigorifero`

### Pilastro `/noleggio-furgoni-trieste`
- Landing distinta da `/flotta`: In breve, tabella categorie + prezzi “da”, funnel verso wizard/flotta/tariffe/guide
- JSON-LD WebPage + Service + FAQ + Breadcrumb
- Redirect aggiornato: `/noleggio-furgoni` → pilastro (non più solo medi)

### Cosa trasporti
- Nuovo hub scenari `CosaTrasportiScenariHub` (frigo, lavatrice, armadio, divano, letto, moto, scatoloni, trasloco, materiali)
- Link a categorie + guide + pilastro

### Internal linking
- Footer: pilastro furgoni, voce Guide
- Home flotta preview → pilastro + guide
- Hub flotta + categorie → cosa-trasporti / guide / pilastro
- Sitemap + `llms.txt` aggiornati

---

## 4. File principali Blocco 2

**Creati:** `web/src/lib/guide/*`, `web/src/app/guide/**`, `web/src/app/noleggio-furgoni-trieste/page.tsx`, `web/src/components/guide/GuideArticleContent.tsx`, `web/src/components/wizard/CosaTrasportiScenariHub.tsx`

**Modificati:** `cosa-trasporti/page.tsx`, `nav-config.ts`, `SiteFooter.tsx`, `FlottaCategoriaPage.tsx`, `flotta/page.tsx`, `FleetPreviewSection.tsx`, `sitemap.ts`, `legacy-redirects.ts`, `llms.txt`, report audit

---

## 5. Tabelle Supabase

Nessuna nuova tabella in Blocco 2 (guide in codice). Migration 023 ancora da applicare (Blocco 1).

---

## 6. Nuove route

| Route | Tipo |
|-------|------|
| `/guide` | Hub |
| `/guide/[slug]` × 5 | Articoli |
| `/noleggio-furgoni-trieste` | Pilastro |

## 7. Redirect

| From | To |
|------|-----|
| `/noleggio-furgoni` | `/noleggio-furgoni-trieste` |

## 8–11. Metadata / Schema / Sitemap / Robots

- Meta + OG su guide e pilastro
- Sitemap include pilastro, hub guide, 5 articoli
- Robots invariato (allow `/`)

## 12–14. Performance / Tracking / Sicurezza

Invariati in questo blocco (P2).

---

## 15. Cosa resta da fare

1. Applicare migration NAP 023 su Supabase
2. Eventuali pilastri auto/pulmini (solo se contenuto distinto)
3. Altri articoli guide (non 50 in automatico)
4. Schema dual LocalBusiness autolavaggio
5. P2: headers, analytics consent, confronto categorie dati DB
6. Foto flotta incomplete

## 16. Priorità future

P1 residuo → P2 tecnico → P3 polish (come `SEO_AUDIT.md`).
