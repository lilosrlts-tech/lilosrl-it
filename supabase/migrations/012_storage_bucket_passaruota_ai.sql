-- Bucket Storage veicoli + campo larghezza tra passaruota

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'veicoli',
  'veicoli',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Lettura pubblica foto flotta
DROP POLICY IF EXISTS "veicoli_public_read" ON storage.objects;
CREATE POLICY "veicoli_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'veicoli');

-- Scrittura solo service role (admin API)
DROP POLICY IF EXISTS "veicoli_service_write" ON storage.objects;
CREATE POLICY "veicoli_service_write"
  ON storage.objects FOR ALL
  USING (bucket_id = 'veicoli' AND auth.role() = 'service_role')
  WITH CHECK (bucket_id = 'veicoli' AND auth.role() = 'service_role');

ALTER TABLE public.veicoli
  ADD COLUMN IF NOT EXISTS larghezza_tra_passaruota_mm INTEGER;

COMMENT ON COLUMN public.veicoli.larghezza_tra_passaruota_mm IS
  'Larghezza utile tra i passaruota (mm) — distinta dalla larghezza massima del vano';
