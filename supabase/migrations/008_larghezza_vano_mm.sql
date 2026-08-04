-- Larghezza vano (allineata a lunghezza_vano_mm / altezza_vano_mm)
ALTER TABLE public.veicoli
  ADD COLUMN IF NOT EXISTS larghezza_vano_mm INTEGER;

UPDATE public.veicoli
SET larghezza_vano_mm = COALESCE(larghezza_vano_mm, vano_larghezza_mm)
WHERE vano_larghezza_mm IS NOT NULL;
