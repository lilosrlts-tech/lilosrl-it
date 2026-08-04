-- =============================================================================
-- Foto di esempio per veicoli seed (URL temporanei Unsplash)
-- Eseguire dopo 001_flotta_schema.sql
-- =============================================================================

INSERT INTO public.foto (
  veicolo_id,
  storage_bucket,
  storage_path,
  url_pubblico,
  alt_text,
  ordine,
  is_copertina
)
SELECT
  v.id,
  'veicoli',
  'seed/ford-transit-350m-copertina.jpg',
  'https://www.lilosrl.it/wp-content/uploads/CarRentalGallery/FORD_TRANSIT_CUSTOM_FROZEN_WHITE_BLANC_BLANCHE.png',
  'Ford Transit 350M — furgone bianco per noleggio a Trieste',
  0,
  true
FROM public.veicoli v
WHERE v.slug = 'ford-transit-350m-dv344hd'
  AND NOT EXISTS (
    SELECT 1 FROM public.foto f WHERE f.veicolo_id = v.id AND f.is_copertina = true
  );

INSERT INTO public.foto (
  veicolo_id,
  storage_bucket,
  storage_path,
  url_pubblico,
  alt_text,
  ordine,
  is_copertina
)
SELECT
  v.id,
  'veicoli',
  'seed/ford-transit-350m-vano.jpg',
  'https://www.lilosrl.it/wp-content/uploads/CarRentalGallery/large.jpeg',
  'Vano di carico Ford Transit — noleggio furgone Trieste',
  1,
  false
FROM public.veicoli v
WHERE v.slug = 'ford-transit-350m-dv344hd'
  AND NOT EXISTS (
    SELECT 1 FROM public.foto f
    WHERE f.veicolo_id = v.id AND f.storage_path = 'seed/ford-transit-350m-vano.jpg'
  );
