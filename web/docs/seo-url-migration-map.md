# Mappa SEO URL — lilosrl.it (WP) → nuovo sito Next.js

Estratto: 2026-07-28 da `https://www.lilosrl.it/wp-sitemap.xml`  
Veicoli `/car/*`: inventariati ma **esclusi** dalle decisioni redirect (fase 2).

## Inventario grezzo

| Tipo | Quantità |
|------|----------|
| Pagine WP | 9 |
| Post | 2 |
| `car_rental_page` (plugin) | 4 |
| `car_rental_item` (/car/) | 19 |
| Attachment | (ignorati) |

## Fase 1 — pagine core (decisioni confermate 2026-07-28)

| URL vecchia | URL nuova | Azione | Note |
|-------------|-----------|--------|------|
| `/` | `/` | Identico | Continuità massima |
| `/chi-siamo/` | `/chi-siamo` | Identico | Stesso slug |
| `/flotta-noleggio/` | `/flotta` | **301** | Hub flotta WP |
| `/flotta-noleggio-2/` | `/flotta` | **301** | Duplicato hub |
| `/prezzi/` | `/tariffe` | **301** | Listino Next esistente |
| `/offerta-del-mese/` | `/offerte` | **301** | Slug diverso |
| `/termini-e-condizioni/` | `/termini-condizioni` | **301** | Slug diverso |
| `/cookie-policy-ue/` | `/cookie-policy` | **301** | Suffisso `-ue` |
| `/test-shortcode/` | `/` | **301** | Pagina test |
| `/news/` | `/offerte` | **301** | Blog quasi vuoto |
| `/how-we-manage-large-construction-projects/` | `/` | **301** | Post template |

**Autolavaggio:** pagina `/autolavaggio` mantenuta su `lilosrl.it` (nessun redirect fuori dominio).

Regole salvate in `src/lib/legacy-redirects.ts` (caricate da `next.config.ts`).

## Solo sul nuovo sito (nessun 1:1 in sitemap WP)

| Path nuovo | Nota |
|------------|------|
| `/contatti` | Assente in sitemap pagine WP |
| `/autolavaggio` | WP: promo in home; sito dedicato `autolavaggiolilo.it` |
| `/privacy` | Nuova |
| `/tariffe` | Listino strutturato |
| `/flotta/auto` | Categoria nuova |
| `/flotta/pulmini-9-posti` | Categoria nuova |
| `/flotta/furgoni-piccoli` | Categoria nuova |
| `/flotta/furgoni-medi` | Categoria nuova |
| `/flotta/furgoni-grandi` | Categoria nuova |
| `/flotta/furgoni-grandi-citta` | Categoria nuova |
| `/flotta/furgoni-xl` | Categoria nuova |

## Fase 2 — veicoli (inventario, niente redirect ora)

Pattern storico: `/car/{slug}/` → `/flotta/{slug}`.

| URL vecchia | Ipotesi nuova |
|-------------|---------------|
| `/car/volvo-volvo-s40/` | `/flotta/volvo-s40` |
| `/car/renault-renault-trafic-9-posti/` | `/flotta/renault-trafic-9-posti` |
| `/car/nissan-primastar/` | `/flotta/nissan-primastar-9-posti` |
| `/car/opel-vivaro/` | `/flotta/opel-vivaro` |
| `/car/fiat-doblo/` | `/flotta/fiat-doblo-cargo` |
| `/car/fiat-ducato-l1h1/` | `/flotta/fiat-ducato-l1h1` |
| `/car/ford-transit/` | `/flotta/ford-transit-l2h2` |
| `/car/ford-transit-l3h2-furgone/` | `/flotta/ford-transit-l3h2` |
| `/car/opel-movano/` | `/flotta/opel-movano-l2h2` |
| `/car/renault-master/` | `/flotta/renault-master-l2h2` |
| `/car/peugeot-boxer-l2h2/` | `/flotta/peugeot-boxer-l2h2` |
| `/car/peugeot-boxer-l2h2-2/` | duplicato L2H2 |
| `/car/peugeot-boxer-2/` | probabile XL / L3H3 |
| `/car/iveco-iveco-daily/` | `/flotta/iveco-daily-35-12` |
| `/car/peugeot-partner/` | fuori flotta? |
| `/car/opel-karl/` | fuori flotta? |
| `/car/noleggio-furgoni-mercedes-vito-trieste/` | fuori flotta? |
| `/car/noleggio-furgone-a-trieste-ford-l1h1/` | Custom / Transit L1H1 |
| `/car/noleggio-furgoni-autonoleggio-pulmini-9-posti/` | → `/flotta/pulmini-9-posti` |

## Plugin booking (basso valore SEO)

- `/car-rental/search/` → `/flotta` o `/contatti`
- `/car-rental/booking-confirmed/` → `/flotta`
- `/car-rental/payment-cancelled/` → `/flotta`
- `/car-rental/car-rental-terms-and-conditions/` → `/termini-condizioni`

## Decisioni confermate (2026-07-28)

1. `/prezzi/` → `/tariffe` (pagina listino esistente)
2. `/flotta-noleggio/` e `/flotta-noleggio-2/` → `/flotta`
3. Autolavaggio: pagina `/autolavaggio` su `lilosrl.it` mantenuta

Implementazione path: `src/lib/legacy-redirects.ts` → `next.config.ts` (`statusCode: 301`).

Host / domini:
- Canonico: `https://www.lilosrl.it`
- Apex + secondari in `REDIRECT_TO_CANONICAL_HOSTS` (`src/lib/constants.ts`):
  - `lilosrl.it`
  - `lilo.srl`, `www.lilo.srl`
  - `noleggiofurgonitrieste.it`, `www.noleggiofurgonitrieste.it`
  - `noleggiotrieste.it`, `www.noleggiotrieste.it`
- Middleware: 301 verso `www.lilosrl.it` (stesso path). Preview Vercel e localhost esclusi.

**Infrastruttura:** aggiungere gli stessi domini in Vercel → Project → Domains (DNS).

Prossimo contenuto SEO: Fase 2 mapping `/car/*` quando le foto veicolo sono complete.
