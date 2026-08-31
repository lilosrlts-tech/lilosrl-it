# SEO Implementation Report — LILO S.r.l.

**Ultimo aggiornamento:** 31 agosto 2026  
**Fase corrente:** Blocco 1 — P0 NAP + P1 favicon/404  
**Build:** `npm run build` OK (Next.js 15.5.19)

---

## 1. Stato iniziale (sintesi)

- NAP/orari duplicati in `COMPANY`, `sedi.ts`, `DEMO_IMPOSTAZIONI`, seed SQL 002 e hardcoded UI
- Soft-404: path sconosciuti → 301 `/flotta`
- `/favicon.ico` e manifest assenti (404 live)
- Pilastri `/noleggio-*-trieste` e `/guide` non ancora creati (pianificati Opzione A)

Vedi anche [`SEO_AUDIT.md`](./SEO_AUDIT.md).

---

## 2. Problemi trovati (blocco trattato)

| ID | Problema | Stato |
|----|----------|--------|
| D1/D2/L1 | NAP multi-source + orari discordanti | **Mitigato in codice** + migration 023 |
| S8 | Favicon/manifest 404 | **Risolto** (`/icon`, `/apple-icon`, `/manifest.webmanifest`) |
| S7 | Soft-404 → flotta | **Risolto** (404 reale via `not-found`) |

---

## 3. Modifiche effettuate (Blocco 1)

### NAP centralizzato
- Nuovo `web/src/lib/nap.ts`: telefono, indirizzi, orari, servizi, formatter
- `COMPANY` e `DEMO_IMPOSTAZIONI` importano da `nap.ts`
- `sedi.ts`: costanti da NAP + `resolveSedeNoleggio` / `resolveSedeAutolavaggio` da DB
- UI aggiornata: Contatti, Chi siamo, Autolavaggio, ContactMapSection, SiteChrome, PreventivoForm

### Migration Supabase
- `supabase/migrations/023_sync_nap_orari.sql` — UPDATE singleton `impostazioni_sito` con orari/NAP GMB-aligned

### Favicon / manifest
- `web/src/app/icon.tsx`, `apple-icon.tsx`, `manifest.ts`

### 404 reali
- `middleware.ts`: rimosso catch-all 301 → `/flotta`
- Whitelist anticipata per futuri path `guide`, `noleggio-*-trieste` (quando esisteranno le pagine)

---

## 4. File modificati / creati

**Creati**
- `web/src/lib/nap.ts`
- `web/src/app/icon.tsx`
- `web/src/app/apple-icon.tsx`
- `web/src/app/manifest.ts`
- `supabase/migrations/023_sync_nap_orari.sql`
- `SEO_IMPLEMENTATION_REPORT.md` (questo file)

**Modificati**
- `web/src/lib/constants.ts`
- `web/src/lib/impostazioni.ts`
- `web/src/lib/sedi.ts`
- `web/src/middleware.ts`
- `web/src/components/layout/SiteChrome.tsx`
- `web/src/components/contatti/ContattiContent.tsx`
- `web/src/components/chi-siamo/ChiSiamoContent.tsx`
- `web/src/components/autolavaggio/AutolavaggioContent.tsx`
- `web/src/components/home/ContactMapSection.tsx`
- `web/src/components/flotta/PreventivoForm.tsx`
- `SEO_AUDIT.md` (stato avanzamento)

---

## 5. Tabelle Supabase modificate

| Tabella | Azione | Note |
|---------|--------|------|
| `impostazioni_sito` | UPDATE via migration 023 | Orari, telefoni, indirizzi, servizi default |

**Azione richiesta:** eseguire la migration sul progetto Supabase di produzione (SQL Editor o CLI) prima/dopo il deploy.

---

## 6–14. Non ancora in questo blocco

| Area | Stato |
|------|--------|
| Nuove route | Nessuna (whitelist middleware solo) |
| Redirect nuovi | Nessuno (rimossa solo soft-404) |
| Metadata / Schema / Sitemap / Robots | Invariati |
| Performance / Tracking | Invariati |
| Sicurezza headers | Ancora da fare (P2) |

---

## 15. Cosa resta da fare (P0/P1)

1. **Applicare migration 023** su Supabase produzione
2. Commit + push (su richiesta)
3. P1 contenuto: pilastro `/noleggio-furgoni-trieste` (Opzione A)
4. P1: rafforzare `/cosa-trasporti`
5. P1: scaffold `/guide` + primi articoli revisionati
6. P1: foto flotta incomplete
7. P1: dual LocalBusiness autolavaggio (schema)
8. P2+: come da SEO_AUDIT

---

## 16. Priorità future

Come da audit: P0 chiusura NAP in DB → P1 pilastri/guide → P2 schema/perf/headers.
