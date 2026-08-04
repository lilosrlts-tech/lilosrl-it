-- Catalogo accessori / extra noleggio + assegnazione per veicolo
CREATE TABLE IF NOT EXISTS public.accessori (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descrizione TEXT,
  prezzo_giornaliero NUMERIC(10, 2) NOT NULL DEFAULT 0,
  deposito NUMERIC(10, 2),
  deposito_richiesto BOOLEAN NOT NULL DEFAULT false,
  quantita_max INTEGER NOT NULL DEFAULT 5 CHECK (quantita_max >= 1),
  attivo BOOLEAN NOT NULL DEFAULT true,
  ordine INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_accessori_attivo_ordine
  ON public.accessori (attivo, ordine);

CREATE TABLE IF NOT EXISTS public.veicolo_accessori (
  veicolo_id UUID NOT NULL REFERENCES public.veicoli(id) ON DELETE CASCADE,
  accessorio_id UUID NOT NULL REFERENCES public.accessori(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (veicolo_id, accessorio_id)
);

CREATE INDEX IF NOT EXISTS idx_veicolo_accessori_accessorio
  ON public.veicolo_accessori (accessorio_id);

-- Lead preventivo: accessori selezionati (JSON)
ALTER TABLE public.richieste_preventivo
  ADD COLUMN IF NOT EXISTS accessori_json JSONB;

COMMENT ON TABLE public.accessori IS
  'Catalogo globale accessori/extra noleggio (GPS, seggiolini, carrelli, ecc.)';
COMMENT ON TABLE public.veicolo_accessori IS
  'Accessori disponibili per ciascun veicolo';
COMMENT ON COLUMN public.richieste_preventivo.accessori_json IS
  'Accessori richiesti nel preventivo [{id,nome,quantita,prezzo_giornaliero}]';

ALTER TABLE public.accessori ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veicolo_accessori ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_accessori" ON public.accessori;
CREATE POLICY "public_read_accessori"
  ON public.accessori
  FOR SELECT
  TO anon, authenticated
  USING (attivo = true);

DROP POLICY IF EXISTS "public_read_veicolo_accessori" ON public.veicolo_accessori;
CREATE POLICY "public_read_veicolo_accessori"
  ON public.veicolo_accessori
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed catalogo (prezzi come storico WP, IVA esclusa)
INSERT INTO public.accessori (nome, slug, descrizione, prezzo_giornaliero, deposito, deposito_richiesto, quantita_max, attivo, ordine)
VALUES
  ('Carrello manuale', 'carrello-manuale', 'Carrello a mano per carico/scarico', 4.88, NULL, false, 2, true, 10),
  ('GPS', 'gps', 'Navigatore satellitare', 4.88, NULL, false, 1, true, 20),
  ('Rampa carico moto', 'rampa-carico-moto', 'Rampa per carico moto / scooter', 6.10, NULL, false, 1, true, 30),
  ('Seggiolino 2-3 anni (solo base)', 'seggiolino-base-2-3', 'Base seggiolino per bambini 2-3 anni', 4.88, NULL, false, 2, true, 40),
  ('Seggiolino Isofix gruppo 1-2-3', 'seggiolino-isofix-1-2-3', 'Seggiolino Isofix gruppo 1-2-3', 6.10, NULL, false, 2, true, 50),
  ('Cinghie di fissaggio', 'cinghie-fissaggio', 'Cinghie per fissaggio carico', 4.88, NULL, false, 4, true, 60)
ON CONFLICT (slug) DO UPDATE SET
  nome = EXCLUDED.nome,
  descrizione = EXCLUDED.descrizione,
  prezzo_giornaliero = EXCLUDED.prezzo_giornaliero,
  deposito_richiesto = EXCLUDED.deposito_richiesto,
  quantita_max = EXCLUDED.quantita_max,
  attivo = EXCLUDED.attivo,
  ordine = EXCLUDED.ordine,
  updated_at = now();

-- Assegna tutti gli accessori attivi a tutti i veicoli pubblicati (modificabile in admin)
INSERT INTO public.veicolo_accessori (veicolo_id, accessorio_id)
SELECT v.id, a.id
FROM public.veicoli v
CROSS JOIN public.accessori a
WHERE v.pubblicato = true AND v.attivo = true AND a.attivo = true
ON CONFLICT DO NOTHING;
