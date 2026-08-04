-- =============================================================================
-- Flotta completa LILO: 6 categorie + veicoli dimostrativi (allineati al sito)
-- =============================================================================

-- Categoria legacy "furgone" → "furgoni-medi" (slug usato dal menu e dai filtri)
UPDATE public.categorie
SET nome = 'Furgoni Medi', slug = 'furgoni-medi', ordine = 4
WHERE slug = 'furgone';

INSERT INTO public.categorie (nome, slug, descrizione, ordine, attivo) VALUES
  ('Pulmini 9 posti', 'pulmini-9-posti', 'Pulmini fino a 9 posti per gruppi e trasferimenti', 2, true),
  ('Furgoni Piccoli', 'furgoni-piccoli', 'Furgoni compatti per consegne urbane', 3, true),
  ('Furgoni Grandi', 'furgoni-grandi', 'Furgoni capienti per carichi voluminosi', 5, true),
  ('Furgoni XL', 'furgoni-xl', 'Furgoni extra-large per i traslochi più impegnativi', 6, true)
ON CONFLICT (slug) DO UPDATE SET
  nome = EXCLUDED.nome,
  descrizione = EXCLUDED.descrizione,
  ordine = EXCLUDED.ordine,
  attivo = true;

UPDATE public.categorie SET ordine = 1 WHERE slug = 'auto';

-- ── Fiat Panda (Auto) ───────────────────────────────────────────────────────
INSERT INTO public.veicoli (
  categoria_id, targa, marca, modello, versione, anno_immatricolazione, colore,
  alimentazione, cambio, posti, porte, slug, pubblicato, attivo, ordine,
  titolo_pubblico, sottotitolo, descrizione_breve,
  ai_summary, ai_highlights
)
SELECT
  c.id, 'FN123AB', 'Fiat', 'Panda', '1.2', 2021, 'Bianco',
  'Benzina', 'Manuale', 5, 5, 'fiat-panda-1-2', true, true, 1,
  'Fiat Panda 1.2 — Noleggio auto Trieste',
  'Compatta e ideale in città',
  'Auto compatta economica, perfetta per spostamenti urbani e brevi tragitti.',
  'Fiat Panda 1.2 benzina disponibile a noleggio a Trieste.',
  ARRAY['5 posti', 'Benzina', 'Ideale in città']
FROM public.categorie c
WHERE c.slug = 'auto'
ON CONFLICT (slug) DO NOTHING;

-- ── Ford Tourneo (Pulmini) ────────────────────────────────────────────────────
INSERT INTO public.veicoli (
  categoria_id, targa, marca, modello, versione, anno_immatricolazione, colore,
  alimentazione, cambio, posti, porte, slug, pubblicato, attivo, ordine,
  titolo_pubblico, sottotitolo, descrizione_breve,
  ai_summary, ai_highlights
)
SELECT
  c.id, 'FT456CD', 'Ford', 'Tourneo', '9 posti', 2020, 'Grigio',
  'Diesel', 'Manuale', 9, 5, 'ford-tourneo-9-posti', true, true, 2,
  'Ford Tourneo 9 posti — Noleggio pulmino Trieste',
  'Per gruppi e trasferimenti',
  'Pulmino 9 posti diesel, ideale per gruppi, eventi e trasferimenti.',
  'Ford Tourneo 9 posti diesel per noleggio a Trieste.',
  ARRAY['9 posti', 'Diesel', 'Climatizzato']
FROM public.categorie c
WHERE c.slug = 'pulmini-9-posti'
ON CONFLICT (slug) DO NOTHING;

-- ── Fiat Doblò (Furgoni piccoli) ─────────────────────────────────────────────
INSERT INTO public.veicoli (
  categoria_id, targa, marca, modello, versione, anno_immatricolazione, colore,
  alimentazione, cambio, posti, porte, slug, pubblicato, attivo, ordine,
  titolo_pubblico, sottotitolo, descrizione_breve,
  ai_summary, ai_highlights
)
SELECT
  c.id, 'FD789EF', 'Fiat', 'Doblò Cargo', '1.6 Multijet', 2022, 'Bianco',
  'Diesel', 'Manuale', 2, 4, 'fiat-doblo-cargo', true, true, 3,
  'Fiat Doblò Cargo — Furgone piccolo Trieste',
  'Compatto per consegne urbane',
  'Furgone piccolo diesel, 3,4 m³ di volume utile.',
  'Fiat Doblò Cargo diesel, furgone piccolo a noleggio a Trieste.',
  ARRAY['3,4 m³', 'Diesel', 'Compatto']
FROM public.categorie c
WHERE c.slug = 'furgoni-piccoli'
ON CONFLICT (slug) DO NOTHING;

-- ── Iveco Daily grande ───────────────────────────────────────────────────────
INSERT INTO public.veicoli (
  categoria_id, targa, marca, modello, versione, anno_immatricolazione, colore,
  alimentazione, cambio, posti, porte, slug, pubblicato, attivo, ordine,
  titolo_pubblico, sottotitolo, descrizione_breve,
  ai_summary, ai_highlights
)
SELECT
  c.id, 'ID012GH', 'Iveco', 'Daily', '35.12', 2018, 'Bianco',
  'Diesel', 'Manuale', 3, 4, 'iveco-daily-35-12', true, true, 5,
  'Iveco Daily 35.12 — Furgone grande Trieste',
  'Capiente per carichi voluminosi',
  'Furgone grande diesel con 12 m³ di volume utile.',
  'Iveco Daily 35.12 diesel, furgone grande a noleggio a Trieste.',
  ARRAY['12 m³', 'Diesel', 'Pianale basso']
FROM public.categorie c
WHERE c.slug = 'furgoni-grandi'
ON CONFLICT (slug) DO NOTHING;

-- ── Iveco Daily XL ───────────────────────────────────────────────────────────
INSERT INTO public.veicoli (
  categoria_id, targa, marca, modello, versione, anno_immatricolazione, colore,
  alimentazione, cambio, posti, porte, slug, pubblicato, attivo, ordine,
  titolo_pubblico, sottotitolo, descrizione_breve,
  ai_summary, ai_highlights
)
SELECT
  c.id, 'IX345IJ', 'Iveco', 'Daily', '70.17', 2017, 'Bianco',
  'Diesel', 'Manuale', 3, 4, 'iveco-daily-70-17', true, true, 6,
  'Iveco Daily 70.17 — Furgone XL Trieste',
  'Massima capacità di carico',
  'Furgone XL diesel con 17 m³ di volume utile per i traslochi più impegnativi.',
  'Iveco Daily 70.17 diesel, furgone XL a noleggio a Trieste.',
  ARRAY['17 m³', 'Diesel', 'Patente C']
FROM public.categorie c
WHERE c.slug = 'furgoni-xl'
ON CONFLICT (slug) DO NOTHING;

UPDATE public.veicoli SET ordine = 4 WHERE slug = 'ford-transit-350m-dv344hd';

-- ── Prezzi giornalieri ───────────────────────────────────────────────────────
INSERT INTO public.prezzi (veicolo_id, tipo_tariffa, importo, descrizione, attivo)
SELECT v.id, 'giornaliero', p.importo, 'Tariffa giornaliera', true
FROM (VALUES
  ('fiat-panda-1-2', 28.00),
  ('ford-tourneo-9-posti', 75.00),
  ('fiat-doblo-cargo', 45.00),
  ('iveco-daily-35-12', 110.00),
  ('iveco-daily-70-17', 145.00)
) AS p(slug, importo)
JOIN public.veicoli v ON v.slug = p.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.prezzi pr WHERE pr.veicolo_id = v.id AND pr.tipo_tariffa = 'giornaliero'
);

-- ── Foto copertina (URL sito LILO) ───────────────────────────────────────────
INSERT INTO public.foto (veicolo_id, storage_bucket, storage_path, url_pubblico, alt_text, ordine, is_copertina)
SELECT v.id, 'veicoli', 'seed/' || v.slug || '-copertina.jpg', f.url, f.alt, 0, true
FROM (VALUES
  ('fiat-panda-1-2', 'https://www.lilosrl.it/wp-content/uploads/CarRentalGallery/FIAT_PANDA.png', 'Fiat Panda — noleggio auto a Trieste'),
  ('ford-tourneo-9-posti', 'https://www.lilosrl.it/wp-content/uploads/CarRentalGallery/FORD_TOURNEO.png', 'Ford Tourneo 9 posti — noleggio pulmino Trieste'),
  ('fiat-doblo-cargo', 'https://www.lilosrl.it/wp-content/uploads/CarRentalGallery/FIAT_DOBLO.png', 'Fiat Doblò Cargo — furgone piccolo noleggio Trieste'),
  ('iveco-daily-35-12', 'https://www.lilosrl.it/wp-content/uploads/CarRentalGallery/IVECO_DAILY.png', 'Iveco Daily — furgone grande noleggio Trieste'),
  ('iveco-daily-70-17', 'https://www.lilosrl.it/wp-content/uploads/CarRentalGallery/IVECO_DAILY_XL.png', 'Iveco Daily XL — furgone extra large noleggio Trieste')
) AS f(slug, url, alt)
JOIN public.veicoli v ON v.slug = f.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.foto fo WHERE fo.veicolo_id = v.id AND fo.is_copertina = true
);
