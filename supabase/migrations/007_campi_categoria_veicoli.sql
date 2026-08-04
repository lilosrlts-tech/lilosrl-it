-- =============================================================================
-- Campi tecnici differenziati per categoria (SEO + schede veicolo)
-- Furgoni | Auto | Pulmini 9 posti
-- =============================================================================

ALTER TABLE public.veicoli
  ADD COLUMN IF NOT EXISTS volume_metri_cubi NUMERIC(6, 2),
  ADD COLUMN IF NOT EXISTS portata_utile_kg INTEGER,
  ADD COLUMN IF NOT EXISTS lunghezza_vano_mm INTEGER,
  ADD COLUMN IF NOT EXISTS altezza_vano_mm INTEGER,
  ADD COLUMN IF NOT EXISTS capacita_bagagliaio_valigie SMALLINT,
  ADD COLUMN IF NOT EXISTS classe_ambientale TEXT,
  ADD COLUMN IF NOT EXISTS connessione_smartphone TEXT,
  ADD COLUMN IF NOT EXISTS configurazione_sedili TEXT,
  ADD COLUMN IF NOT EXISTS climatizzazione_posteriore BOOLEAN;

COMMENT ON COLUMN public.veicoli.volume_metri_cubi IS 'Volume vano di carico in m³ (furgoni)';
COMMENT ON COLUMN public.veicoli.portata_utile_kg IS 'Portata utile in kg (furgoni)';
COMMENT ON COLUMN public.veicoli.lunghezza_vano_mm IS 'Lunghezza vano di carico in mm (furgoni)';
COMMENT ON COLUMN public.veicoli.altezza_vano_mm IS 'Altezza vano di carico in mm (furgoni)';
COMMENT ON COLUMN public.veicoli.capacita_bagagliaio_valigie IS 'Capacità bagagliaio in valigie (auto)';
COMMENT ON COLUMN public.veicoli.classe_ambientale IS 'Classe emissioni Euro (auto)';
COMMENT ON COLUMN public.veicoli.connessione_smartphone IS 'CarPlay / Android Auto (auto)';
COMMENT ON COLUMN public.veicoli.configurazione_sedili IS 'Layout sedili (pulmini 9 posti)';
COMMENT ON COLUMN public.veicoli.climatizzazione_posteriore IS 'Climatizzazione posteriore (pulmini)';

-- Allinea i nuovi campi furgone dai dati legacy già presenti
UPDATE public.veicoli SET
  volume_metri_cubi = COALESCE(volume_metri_cubi, volume_carico_mc),
  portata_utile_kg = COALESCE(portata_utile_kg, portata_kg),
  lunghezza_vano_mm = COALESCE(lunghezza_vano_mm, vano_lunghezza_mm),
  altezza_vano_mm = COALESCE(altezza_vano_mm, vano_altezza_mm)
WHERE volume_carico_mc IS NOT NULL
   OR portata_kg IS NOT NULL
   OR vano_lunghezza_mm IS NOT NULL
   OR vano_altezza_mm IS NOT NULL;
