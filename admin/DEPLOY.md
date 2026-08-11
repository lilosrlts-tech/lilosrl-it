# LILO Admin — Deploy online (Vercel)

Stesso progetto **Supabase** del sito pubblico (`web`). Non serve un terzo progetto Supabase.

## URL (produzione)

- Login: https://lilosrl-admin.vercel.app/admin/login
- Progetto Vercel: `lilo-srl/lilosrl-admin`
- Dominio consigliato: `admin.lilosrl.it` (CNAME → `cname.vercel-dns.com`)

## Variabili d'ambiente (già impostate su Vercel)

| Variabile | Note |
|-----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Stesso del sito |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Stesso del sito |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo admin |
| `SUPABASE_STORAGE_BUCKET` | `veicoli` |
| `ADMIN_PASSWORD` | Password login produzione |
| `ADMIN_SESSION_SECRET` | ≥ 32 caratteri |

## Redeploy

```bash
cd admin
npx vercel --prod
```

Per deploy automatici da GitHub: in Vercel → progetto `lilosrl-admin` → Settings →
Git → Root Directory = `admin`.
