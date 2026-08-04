-- Softening: assicurare che i lead non siano leggibili/modificabili dal pubblico.
-- INSERT anon già presente in 015; qui si documenta e si chiudono eventuali SELECT/UPDATE/DELETE.

ALTER TABLE public.richieste_preventivo ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_richieste_preventivo" ON public.richieste_preventivo;
CREATE POLICY "anon_insert_richieste_preventivo"
  ON public.richieste_preventivo
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Nessuna policy SELECT/UPDATE/DELETE per anon/authenticated:
-- senza policy dedicate RLS nega lettura e modifica (service_role bypassa).

COMMENT ON TABLE public.richieste_preventivo IS
  'Lead preventivo dal form scheda veicolo. Pubblico: solo INSERT. Lettura: service role / dashboard.';
