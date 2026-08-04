-- Sconti / promozioni a durata (regole di flotta) + interruttore per veicolo
ALTER TABLE public.veicoli
  ADD COLUMN IF NOT EXISTS promo_durata_attiva boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.veicoli.promo_durata_attiva IS
  'Se true, applica le regole attive di promozioni_durata (es. 7=6, mese -30%).';

CREATE TABLE IF NOT EXISTS public.promozioni_durata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descrizione_pubblica TEXT,
  giorni_minimo INTEGER NOT NULL CHECK (giorni_minimo >= 1),
  tipo TEXT NOT NULL CHECK (tipo IN ('paga_giorni', 'percentuale')),
  -- paga_giorni: es. 7 giorni min, ne paghi 6
  giorni_a_pagamento INTEGER CHECK (giorni_a_pagamento IS NULL OR giorni_a_pagamento >= 1),
  -- percentuale: es. 30 = sconto 30%
  sconto_percentuale NUMERIC(5, 2) CHECK (
    sconto_percentuale IS NULL OR (sconto_percentuale > 0 AND sconto_percentuale <= 100)
  ),
  attivo BOOLEAN NOT NULL DEFAULT true,
  ordine INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT promozioni_durata_tipo_valido CHECK (
    (tipo = 'paga_giorni' AND giorni_a_pagamento IS NOT NULL AND giorni_a_pagamento < giorni_minimo)
    OR (tipo = 'percentuale' AND sconto_percentuale IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_promozioni_durata_attivo_ordine
  ON public.promozioni_durata (attivo, ordine);

ALTER TABLE public.promozioni_durata ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_promozioni_durata" ON public.promozioni_durata;
CREATE POLICY "public_read_promozioni_durata"
  ON public.promozioni_durata
  FOR SELECT
  TO anon, authenticated
  USING (attivo = true);

INSERT INTO public.promozioni_durata (
  nome, slug, descrizione_pubblica, giorni_minimo, tipo, giorni_a_pagamento, sconto_percentuale, attivo, ordine
) VALUES
  (
    'Settimana promo',
    'settimana-paga-6',
    'Noleggio 7 giorni: ne paghi 6',
    7,
    'paga_giorni',
    6,
    NULL,
    true,
    10
  ),
  (
    'Mese -30%',
    'mese-sconto-30',
    'Noleggio da 30 giorni: sconto 30%',
    30,
    'percentuale',
    NULL,
    30,
    true,
    20
  )
ON CONFLICT (slug) DO UPDATE SET
  nome = EXCLUDED.nome,
  descrizione_pubblica = EXCLUDED.descrizione_pubblica,
  giorni_minimo = EXCLUDED.giorni_minimo,
  tipo = EXCLUDED.tipo,
  giorni_a_pagamento = EXCLUDED.giorni_a_pagamento,
  sconto_percentuale = EXCLUDED.sconto_percentuale,
  attivo = EXCLUDED.attivo,
  ordine = EXCLUDED.ordine,
  updated_at = now();
