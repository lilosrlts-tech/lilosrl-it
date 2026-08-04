# LILO Autonoleggio — Admin Panel (Next.js)

Pannello amministratore per la gestione della flotta veicoli con API CRUD e integrazione Supabase.

## Requisiti

- Node.js 18+
- Progetto Supabase con schema in `../supabase/migrations/001_flotta_schema.sql`
- Bucket Storage `veicoli` (pubblico) su Supabase — creato automaticamente al primo upload se mancante

## Setup

```bash
cd autonoleggio/admin
cp .env.example .env.local
npm install
npm run dev
```

Apri [http://localhost:3000/admin](http://localhost:3000/admin)

## Variabili d'ambiente

| Variabile | Descrizione |
|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL progetto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chiave anon (opzionale per estensioni future) |
| `SUPABASE_SERVICE_ROLE_KEY` | Chiave service role (solo server) |
| `SUPABASE_STORAGE_BUCKET` | Nome bucket Storage (default: `veicoli`) |
| `ADMIN_PASSWORD` | Password login pannello |
| `ADMIN_SESSION_SECRET` | Segreto cookie sessione (min. 32 caratteri) |

## API Routes

### Autenticazione
- `POST /api/auth/login` — login admin
- `DELETE /api/auth/login` — logout

### Categorie
- `GET /api/categorie` — elenco
- `POST /api/categorie` — crea
- `GET /api/categorie/[id]` — dettaglio
- `PATCH /api/categorie/[id]` — aggiorna
- `DELETE /api/categorie/[id]` — elimina

### Veicoli
- `GET /api/veicoli` — elenco completo flotta
- `POST /api/veicoli` — crea (JSON o `multipart/form-data` con foto)
- `GET /api/veicoli/[id]` — dettaglio con prezzi e foto
- `PATCH /api/veicoli/[id]` — aggiorna / riattiva (`action: set_disponibilita`)
- `DELETE /api/veicoli/[id]` — soft delete (non disponibile)
- `DELETE /api/veicoli/[id]?hard=true` — eliminazione permanente
- `POST /api/veicoli/[id]/foto` — upload foto

Tutte le route (eccetto auth) sono protette da middleware con cookie di sessione.

## Struttura

```
src/
  app/api/          # API Routes
  components/admin/ # UI pannello
  lib/
    services/       # Logica Supabase
    validations.ts  # Schema Zod
    api-utils.ts    # Auth + risposte JSON
```
