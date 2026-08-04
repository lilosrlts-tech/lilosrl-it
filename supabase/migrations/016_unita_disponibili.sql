-- Numero unità dello stesso modello in flotta (pubblico: senza targhe).
ALTER TABLE public.veicoli
  ADD COLUMN IF NOT EXISTS unita_disponibili integer NOT NULL DEFAULT 1
  CHECK (unita_disponibili >= 1);

COMMENT ON COLUMN public.veicoli.unita_disponibili IS
  'Numero unita dello stesso modello in flotta (senza esporre targhe).';
