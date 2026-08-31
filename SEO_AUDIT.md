# SEO Audit — LILO S.r.l. (lilosrl.it)

**Data audit iniziale:** 31 agosto 2026  
**Stato:** **COMPLETATO** — Blocchi 1–4 (P0→P3) eseguiti e pushati su `main`  
**Report implementazione:** [`SEO_IMPLEMENTATION_REPORT.md`](./SEO_IMPLEMENTATION_REPORT.md)

### Stato avanzamento (finale)

| Voce | Stato |
|------|--------|
| P0 NAP/orari single-source | ✅ |
| P0 Migration `023_sync_nap_orari.sql` | ⏳ **Da applicare su Supabase** (file in repo) |
| P1 Favicon + manifest | ✅ |
| P1 Soft-404 → 404 reali | ✅ |
| P1 Pilastro furgoni + guide + cosa-trasporti | ✅ |
| P1 Internal linking | ✅ |
| P2 Schema dual entity + tariffe OfferCatalog | ✅ |
| P2 Security headers | ✅ |
| P2 Consent-gated Vercel Analytics | ✅ |
| P2 Pilastri auto + pulmini | ✅ |
| P3 CMS `meta_robots` / noindex rispettato | ✅ |
| P3 Sitemap senza legal + esclusione noindex CMS | ✅ |
| P3 IndexNow guide/pilastri | ✅ (`npm run indexnow`, postbuild opzionale) |
| P3 Lint/typecheck/build | ✅ |

---

## 1. Stack rilevato

| Elemento | Valore |
|----------|--------|
| Framework sito pubblico | **Next.js 15** (App Router) — build 15.5.19 |
| UI | **React 19** |
| Styling | Tailwind CSS 3.4 |
| Dati | Supabase |
| Deploy | Vercel → `https://www.lilosrl.it` |
| Admin | App Next separata in `admin/` |

---

## 2–12. Sintesi audit (storico)

Vedi sezioni dettagliate nelle revisioni precedenti di questo file e nel report di implementazione. I gap critici (NAP, soft-404, pilastri, schema, headers, consent) risultano chiusi in codice.

### Residui operativi (non codice)

1. Eseguire SQL `supabase/migrations/023_sync_nap_orari.sql` in produzione  
2. Completare foto flotta mancanti in Storage (contenuto, non codice)  
3. Opzionale: `INDEXNOW_ON_BUILD=1` su Vercel production per notify automatico a ogni deploy  

### Non fare (confermato)

- Doorway quartieri Trieste  
- AggregateRating inventato  
- Cambiare URL flotta esistenti senza redirect  
- Generare decine di guide automatiche  

---

*Fine audit esecutivo. Manutenzione continua: contenuti, foto, monitoring GSC/Ahrefs.*
