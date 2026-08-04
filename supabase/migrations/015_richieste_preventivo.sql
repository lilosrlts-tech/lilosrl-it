-- Lead preventivo dal sito pubblico
CREATE TABLE IF NOT EXISTS public.richieste_preventivo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  veicolo_id TEXT,
  veicolo_slug TEXT,
  veicolo_name TEXT NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  data_ritiro DATE NOT NULL,
  data_riconsegna DATE NOT NULL,
  messaggio TEXT,
  source TEXT NOT NULL DEFAULT 'scheda-veicolo',
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_richieste_preventivo_created
  ON public.richieste_preventivo (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_richieste_preventivo_email
  ON public.richieste_preventivo (email);

ALTER TABLE public.richieste_preventivo ENABLE ROW LEVEL SECURITY;

-- Solo insert pubblici (anon); lettura riservata a service role / dashboard
DROP POLICY IF EXISTS "anon_insert_richieste_preventivo" ON public.richieste_preventivo;
CREATE POLICY "anon_insert_richieste_preventivo"
  ON public.richieste_preventivo
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

COMMENT ON TABLE public.richieste_preventivo IS
  'Lead preventivo dal form scheda veicolo (sito pubblico)';
