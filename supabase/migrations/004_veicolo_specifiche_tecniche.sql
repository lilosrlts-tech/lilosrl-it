-- =============================================================================
-- Specifiche tecniche furgone/van — portata, volume, dimensioni, vano carico
-- Eseguire dopo 001_flotta_schema.sql
-- =============================================================================

ALTER TABLE public.veicoli
  ADD COLUMN IF NOT EXISTS portata_kg INTEGER,
  ADD COLUMN IF NOT EXISTS volume_carico_mc NUMERIC(5, 2),
  ADD COLUMN IF NOT EXISTS trazione TEXT,
  ADD COLUMN IF NOT EXISTS passo TEXT,
  ADD COLUMN IF NOT EXISTS tetto TEXT,
  ADD COLUMN IF NOT EXISTS sensori_parcheggio BOOLEAN,
  ADD COLUMN IF NOT EXISTS lunghezza_mm INTEGER,
  ADD COLUMN IF NOT EXISTS larghezza_mm INTEGER,
  ADD COLUMN IF NOT EXISTS altezza_mm INTEGER,
  ADD COLUMN IF NOT EXISTS vano_lunghezza_mm INTEGER,
  ADD COLUMN IF NOT EXISTS vano_larghezza_mm INTEGER,
  ADD COLUMN IF NOT EXISTS vano_altezza_mm INTEGER;

COMMENT ON COLUMN public.veicoli.portata_kg IS 'Portata massima utile in kg';
COMMENT ON COLUMN public.veicoli.volume_carico_mc IS 'Volume di carico in metri cubi';
COMMENT ON COLUMN public.veicoli.passo IS 'es. Corto, Medio, Lungo';
COMMENT ON COLUMN public.veicoli.tetto IS 'es. Basso, Medio, Alto';

-- Esempio: Ford Transit seed (valori indicativi)
UPDATE public.veicoli v
SET
  portata_kg = 1200,
  volume_carico_mc = 8.60,
  trazione = 'Anteriore',
  passo = 'Medio',
  tetto = 'Medio',
  sensori_parcheggio = true,
  lunghezza_mm = 5531,
  larghezza_mm = 2032,
  altezza_mm = 2410,
  vano_lunghezza_mm = 3044,
  vano_larghezza_mm = 1785,
  vano_altezza_mm = 1406
WHERE v.slug = 'ford-transit-350m-dv344hd';
