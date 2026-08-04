-- =============================================================================
-- Impostazioni sito LILO S.r.l. — contenuti gestibili senza modificare il codice
-- Eseguire dopo 001_flotta_schema.sql
-- =============================================================================

CREATE TABLE public.impostazioni_sito (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Singleton: una sola riga di configurazione
  singleton             BOOLEAN NOT NULL DEFAULT true UNIQUE CHECK (singleton = true),

  -- Orari
  orari_noleggio        TEXT NOT NULL,
  orari_autolavaggio    TEXT NOT NULL,

  -- Contatti
  telefono_noleggio     TEXT NOT NULL,
  telefono_autolavaggio TEXT NOT NULL,
  email_contatto        TEXT NOT NULL,

  -- Sedi
  indirizzo_noleggio    TEXT NOT NULL,
  indirizzo_autolavaggio TEXT NOT NULL,

  -- Contenuti home
  testo_hero_home       TEXT NOT NULL,
  descrizione_autolavaggio TEXT NOT NULL,

  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_impostazioni_sito_updated_at
  BEFORE UPDATE ON public.impostazioni_sito
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.impostazioni_sito IS
  'Configurazione centralizzata del sito: orari, contatti, sedi, testi home';

-- -----------------------------------------------------------------------------
-- RLS: lettura pubblica, scrittura solo utenti autenticati Supabase
-- L''admin Next.js usa service_role (bypass RLS) per PATCH via API protetta.
-- -----------------------------------------------------------------------------
ALTER TABLE public.impostazioni_sito ENABLE ROW LEVEL SECURITY;

CREATE POLICY "impostazioni_sito_lettura_pubblica"
  ON public.impostazioni_sito FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "impostazioni_sito_modifica_authenticated"
  ON public.impostazioni_sito FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "impostazioni_sito_insert_authenticated"
  ON public.impostazioni_sito FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- Dati iniziali LILO S.r.l.
-- -----------------------------------------------------------------------------
INSERT INTO public.impostazioni_sito (
  id,
  orari_noleggio,
  orari_autolavaggio,
  telefono_noleggio,
  telefono_autolavaggio,
  email_contatto,
  indirizzo_noleggio,
  indirizzo_autolavaggio,
  testo_hero_home,
  descrizione_autolavaggio
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Lunedì – Venerdì: 8:30 – 12:30 / 14:30 – 18:00
Sabato: su appuntamento
Domenica: chiuso',
  'Lunedì – Sabato: 7:00 – 19:00
Domenica: 8:00 – 13:00',
  '040 2471720',
  '040 2471720',
  'info@lilosrl.it',
  'Viale Campi Elisi 38/B, 34132 Trieste (TS)',
  'Ingresso: Via Schiaparelli 21/A — Uscita: Via G. De Coletti 7, Trieste',
  'Noleggio auto e furgoni a Trieste con LILO S.r.l.: flotta moderna, tariffe trasparenti e ritiro in sede in Viale Campi Elisi. Ideale per privati, aziende e traslochi.',
  'Autolavaggio self-service LILO a Trieste: lavaggio completo interno ed esterno, ingresso da Via Schiaparelli 21/A e uscita su Via G. De Coletti 7. Asciugatura, aspirazione e trattamenti disponibili in loco.'
);
