-- Citroën Jumpy FR523SW — Furgone Medio (dati anagrafici da furgoni25.xlsx)
-- Specifiche vano: Citroën Jumpy Van L2 H1 (scheda tecnica costruttore)

INSERT INTO public.veicoli (
  categoria_id, targa, marca, modello, versione, anno_immatricolazione, colore,
  alimentazione, cambio, posti, porte, slug, pubblicato, attivo, ordine,
  titolo_pubblico, sottotitolo, descrizione_breve, descrizione_completa,
  seo_title, seo_description,
  ai_summary, ai_highlights, ai_context,
  volume_metri_cubi, portata_utile_kg, volume_carico_mc, portata_kg,
  lunghezza_vano_mm, larghezza_vano_mm, altezza_vano_mm,
  vano_lunghezza_mm, vano_larghezza_mm, vano_altezza_mm,
  trazione, passo, tetto, sensori_parcheggio,
  lunghezza_mm, larghezza_mm, altezza_mm,
  og_image_url
)
SELECT
  c.id,
  'FR523SW',
  'Citroën',
  'Jumpy',
  'L2 H1',
  2024,
  'Bianco',
  'Diesel',
  'Manuale',
  3,
  4,
  'citroen-jumpy-fr523sw',
  true,
  true,
  5,
  'Citroën Jumpy L2 — Noleggio furgone medio Trieste',
  'Furgone medio diesel, ideale per lavoro e consegne',
  'Noleggio Citroën Jumpy L2 a Trieste: 5,3 m³ di volume utile, portata 1.081 kg, vano 2.937×1.620×1.276 mm. Targa FR523SW, immatricolazione 2024.',
  'Il Citroën Jumpy L2 H1 è un furgone medio diesel perfetto per artigiani, piccole imprese e consegne in città. Ampio vano di carico da 5,3 m³, portata utile di 1.081 kg e dimensioni vano 2.937 mm (lunghezza) × 1.620 mm (larghezza) × 1.276 mm (altezza). Disponibile presso LILO S.r.l. a Trieste, Viale Campi Elisi 38/B.',
  'Noleggio Citroën Jumpy L2 Trieste | LILO Autonoleggio',
  'Noleggia il Citroën Jumpy L2 (5,3 m³) a Trieste con LILO S.r.l. Furgone medio diesel, targa FR523SW, ritiro in sede. Preventivo rapido.',
  'Citroën Jumpy L2 H1 diesel da 5,3 m³ disponibile a noleggio a Trieste presso LILO S.r.l. Targa FR523SW, anno 2024.',
  ARRAY['5,3 m³', 'Diesel', 'Portata 1.081 kg', 'Furgone medio', 'Trieste'],
  'Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.',
  5.3,
  1081,
  5.3,
  1081,
  2937,
  1620,
  1276,
  2937,
  1620,
  1276,
  'Anteriore',
  'Medio',
  'Basso',
  true,
  4959,
  1920,
  1895,
  '/images/veicoli/citroen-jumpy-fr523sw-copertina.webp'
FROM public.categorie c
WHERE c.slug = 'furgoni-medi'
ON CONFLICT (slug) DO UPDATE SET
  targa = EXCLUDED.targa,
  marca = EXCLUDED.marca,
  modello = EXCLUDED.modello,
  versione = EXCLUDED.versione,
  anno_immatricolazione = EXCLUDED.anno_immatricolazione,
  titolo_pubblico = EXCLUDED.titolo_pubblico,
  sottotitolo = EXCLUDED.sottotitolo,
  descrizione_breve = EXCLUDED.descrizione_breve,
  descrizione_completa = EXCLUDED.descrizione_completa,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  ai_summary = EXCLUDED.ai_summary,
  ai_highlights = EXCLUDED.ai_highlights,
  ai_context = EXCLUDED.ai_context,
  volume_metri_cubi = EXCLUDED.volume_metri_cubi,
  portata_utile_kg = EXCLUDED.portata_utile_kg,
  volume_carico_mc = EXCLUDED.volume_carico_mc,
  portata_kg = EXCLUDED.portata_kg,
  lunghezza_vano_mm = EXCLUDED.lunghezza_vano_mm,
  larghezza_vano_mm = EXCLUDED.larghezza_vano_mm,
  altezza_vano_mm = EXCLUDED.altezza_vano_mm,
  vano_lunghezza_mm = EXCLUDED.vano_lunghezza_mm,
  vano_larghezza_mm = EXCLUDED.vano_larghezza_mm,
  vano_altezza_mm = EXCLUDED.vano_altezza_mm,
  og_image_url = EXCLUDED.og_image_url,
  pubblicato = true,
  attivo = true;

INSERT INTO public.prezzi (veicolo_id, tipo_tariffa, importo, descrizione, attivo)
SELECT v.id, 'giornaliero', 95.00, 'Tariffa giornaliera', true
FROM public.veicoli v
WHERE v.slug = 'citroen-jumpy-fr523sw'
  AND NOT EXISTS (
    SELECT 1 FROM public.prezzi p
    WHERE p.veicolo_id = v.id AND p.tipo_tariffa = 'giornaliero'
  );

UPDATE public.prezzi
SET importo = 95.00, attivo = true
WHERE veicolo_id = (SELECT id FROM public.veicoli WHERE slug = 'citroen-jumpy-fr523sw')
  AND tipo_tariffa = 'giornaliero';

INSERT INTO public.foto (veicolo_id, storage_bucket, storage_path, url_pubblico, alt_text, ordine, is_copertina)
SELECT v.id, 'veicoli', 'local/citroen-jumpy-fr523sw-copertina.webp',
  '/images/veicoli/citroen-jumpy-fr523sw-copertina.webp',
  'Noleggio Furgone Medio Citroën Jumpy LILO Autonoleggio Trieste - Fiancata con targa FR523SW',
  0, true
FROM public.veicoli v
WHERE v.slug = 'citroen-jumpy-fr523sw'
  AND NOT EXISTS (
    SELECT 1 FROM public.foto f WHERE f.veicolo_id = v.id AND f.is_copertina = true
  );

INSERT INTO public.foto (veicolo_id, storage_bucket, storage_path, url_pubblico, alt_text, ordine, is_copertina)
SELECT v.id, 'veicoli', 'local/citroen-jumpy-fr523sw-posteriore.webp',
  '/images/veicoli/citroen-jumpy-fr523sw-posteriore.webp',
  'Noleggio Furgone Medio Citroën Jumpy LILO Autonoleggio Trieste - Posteriore con targa FR523SW',
  1, false
FROM public.veicoli v
WHERE v.slug = 'citroen-jumpy-fr523sw'
  AND NOT EXISTS (
    SELECT 1 FROM public.foto f
    WHERE f.veicolo_id = v.id AND f.storage_path = 'local/citroen-jumpy-fr523sw-posteriore.webp'
  );

UPDATE public.foto SET
  url_pubblico = '/images/veicoli/citroen-jumpy-fr523sw-copertina.webp',
  alt_text = 'Noleggio Furgone Medio Citroën Jumpy LILO Autonoleggio Trieste - Fiancata con targa FR523SW'
WHERE veicolo_id = (SELECT id FROM public.veicoli WHERE slug = 'citroen-jumpy-fr523sw')
  AND is_copertina = true;

UPDATE public.foto SET
  url_pubblico = '/images/veicoli/citroen-jumpy-fr523sw-posteriore.webp',
  alt_text = 'Noleggio Furgone Medio Citroën Jumpy LILO Autonoleggio Trieste - Posteriore con targa FR523SW'
WHERE veicolo_id = (SELECT id FROM public.veicoli WHERE slug = 'citroen-jumpy-fr523sw')
  AND storage_path = 'local/citroen-jumpy-fr523sw-posteriore.webp';
