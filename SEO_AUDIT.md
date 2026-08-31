# SEO Audit — LILO S.r.l. (lilosrl.it)

**Data audit:** 31 agosto 2026  
**Ultimo aggiornamento esecuzione:** 31 agosto 2026 — **Blocco 1 completato** (NAP + favicon + 404)  
**Ambito:** codice `web/` + `admin/` + `supabase/` + probe live `https://www.lilosrl.it`  
**Report implementazione:** [`SEO_IMPLEMENTATION_REPORT.md`](./SEO_IMPLEMENTATION_REPORT.md)

### Stato avanzamento P0/P1

| Voce | Stato |
|------|--------|
| P0 NAP/orari single-source (codice) | ✅ `nap.ts` + sedi resolve + DEMO/COMPANY |
| P0 Migration DB `023_sync_nap_orari.sql` | ⏳ Da applicare su Supabase |
| P1 Favicon + manifest | ✅ |
| P1 Soft-404 → 404 reali | ✅ |
| P1 Pilastri / guide / cosa-trasporti | ⏳ Prossimo blocco |

---

## 1. Stack rilevato

| Elemento | Valore |
|----------|--------|
| Framework sito pubblico | **Next.js 15** (App Router) — `web/package.json` `next ^15.2.0` (build recente 15.5.19) |
| UI | **React 19** |
| Styling | Tailwind CSS 3.4 |
| Dati | Supabase (`@supabase/supabase-js`) |
| Deploy | Vercel (host canonico `www.lilosrl.it`) |
| Admin | Seconda app Next.js in `admin/` |
| Analytics | GA4 + Google Ads + Consent Mode v2; Vercel Analytics + Speed Insights |
| Email lead | Resend (`/api/preventivo`) |
| Root monorepo | script backup DB (`pg`); non è il sito |

**Verifica:** non è un CMS WP in produzione. DNS e HTML live puntano a Next su Vercel.

---

## 2. Struttura attuale

```
lilosrl-it/
  web/          ← sito SEO (unico surface pubblico)
  admin/        ← gestionale contenuti / flotta
  supabase/     ← migrations + schema
  vercel.json   ← rewrite /.gestionale → gestionalelilo.it
```

**Rendering pagine principali**

| Route | Mode |
|-------|------|
| `/`, `/flotta`, `/flotta/[slug]`, `/chi-siamo` | ISR (`revalidate = 3600`) |
| `/tariffe-…`, `/offerte-…`, `/cosa-trasporti`, `/contatti`, `/autolavaggio`, legali | `force-dynamic` |

**CMS SEO esistente:** tabella `seo_settings` (page_key) + campi SEO su `veicoli` / `categorie` + copy lungo hardcoded in `seo-page-content.ts`.

---

## 3. Route attuali (200 indicizzabili)

| Path | Ruolo |
|------|--------|
| `/` | Homepage brand + noleggio Trieste |
| `/flotta` | Hub flotta |
| `/flotta/auto` … `/flotta/furgoni-xl` (+ `grandi-citta`) | Hub categoria |
| `/flotta/{slug-veicolo}` | Scheda veicolo |
| `/tariffe-noleggio-furgoni-trieste` | Listino (canonico) |
| `/offerte-noleggio-furgoni-trieste` | Offerte |
| `/cosa-trasporti` | Wizard / guida carico |
| `/chi-siamo`, `/contatti`, `/autolavaggio` | Entity / local / servizio parallelo |
| `/privacy`, `/cookie-policy`, `/termini-condizioni` | Legal |

**Assenti rispetto al brief target**

| URL target | Stato live |
|------------|------------|
| `/noleggio-furgoni-trieste` | **Non esiste** → middleware **301 → `/flotta`** |
| `/noleggio-auto-trieste` | Non esiste (equivalente soft: `/flotta/auto`) |
| `/noleggio-pulmini-9-posti-trieste` | Non esiste (equivalente: `/flotta/pulmini-9-posti`) |
| `/guide` (+ articoli) | **Non esiste** → **301 → `/flotta`** |
| `/tariffe`, `/offerte` (corte) | **301** verso URL keyword lunghe (corretto) |

**API:** `/api/impostazioni-sito`, `/api/preventivo` (disallow in robots).

---

## 4. Problemi SEO (sintesi)

| ID | Problema | Gravità | Impatto SEO | Impatto conversioni | Soluzione proposta | File | Priorità | Rischi |
|----|----------|---------|-------------|---------------------|--------------------|------|----------|--------|
| S1 | Mancano landing pilastro intent-specifiche (`/noleggio-furgoni-trieste`, auto, pulmini, trasloco, aziende…) | Alto | Perdita ranking su query head locali | Medio | Creare **solo** pilastri con contenuto reale; 301 da alias; non doorway | Nuove `app/` + redirects + sitemap | **P1** | Cannibalizzazione con `/flotta/*` se copy duplicato |
| S2 | Nessuna sezione `/guide` editoriale | Alto | Debolezza AI/GEO e long-tail | Basso→medio | CMS guide minimo + 5–8 articoli prioritari | Nuova area `guide` + tabella o MDX | **P1** | Contenuti inventati se non revisionati |
| S3 | `/cosa-trasporti` è forte ma non è hub SEO completo (scenari + FAQ deep) | Medio | Intent “cosa serve per X” sotto-sfruttato | Alto | Espandere sezioni scenario + CTA; internal link a categorie | `cosa-trasporti`, `cosa-trasporti.ts` | **P1** | Consigli tecnici errati |
| S4 | Categorie flotta = griglia + long content statico: confronto “quale scegliere” migliorabile | Medio | Thin/competitor overlap | Medio | Sezione confronto categorie con dati DB reali | `FlottaCategoriaPage`, `seo-page-content` | **P2** | Numeri inventati |
| S5 | Tariffe: poco JSON-LD / overlap semantico con categorie | Medio | Schema incompleto | Medio | Offer/FAQ se prezzi reali; CTA preventivo | `tariffe-…/page.tsx`, `json-ld.ts` | **P2** | Prezzi “fissi” fuorvianti |
| S6 | Admin `seo.ts` ancora mappa `/tariffe` `/offerte` corte | Basso | Drift CMS vs web | Basso | Allineare path a keyword URL | `admin/src/types/seo.ts` | **P2** | Meta salvate su path sbagliato |
| S7 | Catch-all middleware: URL sconosciute → 301 `/flotta` (soft-404 pattern) | Medio | Segnali crawl confusi | Basso | ✅ Rimosso: path sconosciuti → 404 (`not-found`) | `middleware.ts` | **P1** | Path legacy senza regola 301 tornano 404 |
| S8 | Favicon/manifest assenti (live **404** `/favicon.ico`) | Basso | Brand SERP/PWA | Basso | ✅ `app/icon`, `apple-icon`, `manifest.ts` | `web/src/app/*` | **P2** | — |
| S9 | CMS `noindex` static pages ignorato (force index) | Basso | Impossibile deindicizzare da admin | Basso | Onorare flag con default index | `seo-settings.ts` | **P3** | Noindex accidentale |
| S10 | Legal pages in sitemap (prio 0.3) | Basso | Rumore crawl | Nessuno | Valutare esclusione o leave | `sitemap.ts`, `types/seo.ts` | **P3** | — |

---

## 5. Problemi tecnici

| ID | Problema | Gravità | Impatto | Soluzione | File | P | Rischi |
|----|----------|---------|---------|-----------|------|---|--------|
| T1 | Apex `lilosrl.it` → www risponde **308** (non 301) | Medio | Mix status redirect | Allineare a 301 dove controllabile | middleware / Vercel | **P2** | Chain se combinato ad altro hop |
| T2 | Mix ISR vs force-dynamic su hub commerciali | Basso | Cache uneven | Valutare ISR anche su tariffe con revalidate corto | page exports | **P3** | Dati listino stale |
| T3 | Placeholder immagini senza copy “in arrivo” (fix locale); veicoli senza foto restano deboli | Medio | Credibilità | Completare foto Storage; fallback neutro | Storage + UI | **P1** | — |
| T4 | Headers sicurezza (CSP, HSTS, XFO) non in next/vercel config | Medio | Security / trust | Headers Vercel non invasivi | `next.config` / `vercel.json` | **P2** | CSP che rompe analytics |
| T5 | Vercel Analytics sempre montato (non gated consent) | Medio | Privacy | Gate come GA o documentare come essential | `layout.tsx` | **P2** | Compliance |

---

## 6. Problemi Supabase / dati

| ID | Problema | Gravità | Soluzione | File/tabelle | P | Rischi |
|----|----------|---------|-----------|--------------|---|--------|
| D1 | **NAP/orari multi-source:** `COMPANY` + `sedi.ts` + `impostazioni_sito` + seed migration | **Alto** | ✅ Mitigato: `nap.ts` unica fonte codice; sedi resolve da DB; migration 023 | `nap.ts`, `sedi`, `impostazioni`, `023_*.sql` | **P0** | Applicare 023 in prod |
| D2 | Seed orari ≠ demo/sedi (es. pomeriggio 14:30–18 vs 15–17:30; autolavaggio 7–19 vs 9–18:30) | **Alto** | ✅ Migration 023 + DEMO allineati a GMB (`nap.ts`) | migrations / admin | **P0** | Verifica GMB se divergenza reale |
| D3 | Formato telefono inconsistente (`0402471720` vs `040 2471720` vs E.164) | Medio | Formatter unico da `telefonoE164` | impostazioni helpers | **P1** | NAP inconsistency |
| D4 | `38/B` vs `38/b` | Basso | Normalizzare stringa unica | COMPANY, sedi, copy | **P2** | — |
| D5 | SEO categorie DB (`categorie.seo_*`) sotto-usato vs copy in codice | Medio | Preferire DB se valorizzato, fallback codice | `flotta-categoria-config`, query | **P2** | Override vuoti |
| D6 | Nessuna tabella `guide` / FAQ pagina (FAQ solo `veicoli.ai_faq` + static) | Medio | Tabella `seo_pages`/`guide` + `page_faq` se si apre editoriale | migrations | **P1** | Scope creep |
| D7 | Demo fallback se DB vuoto: rischio contenuti demo in prod | Alto (se misconfig) | Alert build / no silent demo in prod | `veicoli.ts`, `isDemoMode` | **P1** | Indexare demo |

---

## 7. Problemi Vercel

| ID | Problema | P | Note |
|----|----------|---|------|
| V1 | `web/vercel.json` vuoto; redirect solo in Next/middleware | P3 | OK ma documentare |
| V2 | Root rewrite `/.gestionale` esterno | P3 | OK |
| V3 | Nessun security headers dichiarati | P2 | Vedi T4 |
| V4 | Hobby CPU / cold start (storico progetto) | P3 | Monitorare; non SEO diretto |
| V5 | Env: service role solo su preventivo in web — OK | — | Admin ha service role completo (by design) |

---

## 8. Problemi performance

| ID | Problema | Impatto CWV | Soluzione | P |
|----|----------|-------------|-----------|---|
| P-F1 | Hero già con preload LCP WebP — buon punto | — | Mantenere | — |
| P-F2 | Client components: Navbar, gallery, form, mappe | INP | Audit bundle; lazy map | P2 |
| P-F3 | GA + Ads + Cookiebot/Iubenda + Vercel | LCP/INP | Caricare dopo consenso; ridurre tag | P2 |
| P-F4 | Immagini flotta: dipendono da Storage; remotePatterns OK | LCP schede | WebP, sizes, priority solo cover | P1 |
| P-F5 | Speed Insights già presente | — | Usare dashboard Vercel | P3 |

---

## 9. Problemi schema.org

| ID | Problema | P | Soluzione |
|----|----------|---|-----------|
| SCH1 | AutoRental/LocalBusiness su home/contatti: NAP deve allinearsi a GMB | **P0** | Stesso address/phone/hours |
| SCH2 | Tariffe / Autolavaggio senza JSON-LD dedicato | P2 | Service + AutoRental ref / LocalBusiness lavaggio |
| SCH3 | Proprietà Vehicle non-standard già rimosse (interior*) | — | Monitor Ahrefs |
| SCH4 | FAQPage solo dove FAQ visibili — pattern buono; estendere con cautela | P2 | — |
| SCH5 | Niente aggregateRating inventato — **corretto** | — | Non aggiungere senza dati |
| SCH6 | Dual entity noleggio vs autolavaggio da rafforzare (due Place/LocalBusiness) | P1 | Schema distinto se sedi diverse |

---

## 10. Problemi Local SEO

| ID | Problema | P |
|----|----------|---|
| L1 | Orari/indirizzo non single-source (vedi D1–D2) | **P0** |
| L2 | Contatti forti; homepage mappa/CTA OK | — |
| L3 | Rischio doorway quartieri — **non presenti** (bene); non crearli | — |
| L4 | `sameAs` social solo se URL verificati in impostazioni | P2 |
| L5 | Autolavaggio: URL sito vs dominio esterno `autolavaggiolilo.it` in nav — chiarire entity | P2 |

---

## 11. Problemi AI / GEO

| ID | Problema | P | Soluzione |
|----|----------|---|-----------|
| AI1 | `llms.txt` presente e utile | — | Aggiornare quando nascono pilastri/guide |
| AI2 | Poche risposte “In breve” strutturate in cima pagina | P1 | Blocco answer-first su hub |
| AI3 | Mancanza guide Q&A → meno citabilità AI | P1 | Sezione guide |
| AI4 | IndexNow key pubblica presente | P3 | Usare su publish |
| AI5 | Evitare keyword stuffing — copy attuale generalmente naturale | — | Mantenere |

---

## 12. Cosa già funziona bene (non rompere)

- Canonical host `https://www.lilosrl.it`, trailing slash strip, ~155 redirect 301 legacy WP
- Sitemap dinamica con esclusione sorgenti 301 e alias veicolo
- Keyword URL tariffe/offerte con short → 301
- JSON-LD AutoRental + Vehicle/Car + Breadcrumb + FAQ su molte pagine
- Contenuti lunghi categorie (`seo-page-content.ts`)
- Preventivo + WhatsApp + telefono funnel
- Alias slug veicoli filtrati dalle liste pubbliche
- Consent Mode v2 per Google tags

---

## 13. Piano di intervento ordinato

### P0 — Critico (Local / entity trust)
1. Audit NAP/orari vs Google Business reale → una sola fonte (`impostazioni_sito` + sync `sedi`/schema).
2. Allineare JSON-LD Contatti/Home agli orari/telefono verificati.
3. Verificare che produzione non sia in demo mode.

### P1 — Molto importante
4. Favicon (+ icon app) deploy.
5. Completare foto flotta / fallback neutro (già senza «Foto in arrivo»).
6. Architettura URL: decidere **canonici** per pilastri (nuove URL vs potenziare `/flotta/auto` ecc.) — **senza duplicare intent**.
7. Creare al massimo 1–3 pilastri ad alto intent (es. noleggio furgoni Trieste) con contenuto unico + 301.
8. Soft-404 middleware: non 301-all-to-flotta per path editoriali futuri.
9. Rafforzare `/cosa-trasporti` come hub.
10. Scaffold `/guide` + primi 5–8 articoli revisionati (non 50).
11. Internal linking homepage ↔ pilastri ↔ categorie ↔ veicoli ↔ preventivo.
12. Dual LocalBusiness noleggio/autolavaggio se confermato.

### P2 — Importante
13. JSON-LD tariffe + autolavaggio.
14. Confronto categorie “Quale furgone scegliere?” con dati reali.
15. Security headers; gate Vercel Analytics.
16. Allineare admin SEO paths.
17. Meta/OG audit pagina per pagina; H1 unici.
18. Performance: lazy map, bundle client.

### P3 — Miglioramento
19. Onorare noindex CMS; sitemap legal; ISR tariffe; IndexNow on publish; tracking eventi GA4 mancanti.

---

## 14. Decisione architettura URL (da confermare prima di implementare)

**Opzione A — Conservativa (consigliata per non cannibalizzare)**  
- Tenere `/flotta/furgoni-*`, `/flotta/auto`, `/flotta/pulmini-9-posti` come hub categoria.  
- Aggiungere **una** landing pilastro `/noleggio-furgoni-trieste` (e analoghe solo se content distinto).  
- `/tariffe` e `/offerte` restano 301 verso URL keyword lunghe.  
- `/guide` nuovo hub.

**Opzione B — Ristrutturazione aggressiva**  
- Spostare hub a `/noleggio-*-trieste` e 301 da `/flotta/...`.  
- **Rischio alto** su ranking già acquisiti su `/flotta/*`.

**Raccomandazione audit:** Opzione A.

---

## 15. Fuori scope / non fare

- Doorway per quartieri Trieste  
- AggregateRating / recensioni inventate  
- Cambiare framework o rifare frontend  
- Eliminare tabelle Supabase  
- Generare 50 guide automatiche  
- Inventare prezzi, portate, orari, patenti non verificate  

---

*Fine audit. Attendere approvazione prima di FASE 2+.*
