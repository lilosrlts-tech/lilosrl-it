-- Ford Transit L2H2 DV344HD — Furgoni Grandi (Uso Città)

INSERT INTO public.veicoli (
  categoria_id, targa, marca, modello, versione, anno_immatricolazione, colore,
  alimentazione, cambio, posti, porte, slug, pubblicato, attivo, ordine,
  titolo_pubblico, sottotitolo, descrizione_breve, descrizione_completa,
  seo_title, seo_description,
  ai_summary, ai_highlights, ai_context,
  volume_metri_cubi, portata_utile_kg, volume_carico_mc, portata_kg,
  trazione, passo, tetto, sensori_parcheggio,
  og_image_url
)
SELECT
  c.id,
  'DV344HD',
  'Ford',
  'Transit',
  'L2H2',
  2012,
  'Bianco',
  'Diesel',
  'Manuale',
  3,
  4,
  'ford-transit-l2h2',
  true,
  true,
  1,
  'Ford Transit L2H2 — Furgone grande uso città Trieste',
  'Ampia capacità di carico con manovrabilità urbana',
  'Noleggio Ford Transit L2H2 a Trieste: furgone grande uso città, tetto alto e passo medio. Ritiro in Viale Campi Elisi 38/b. Targa DV344HD.',
  'Il Ford Transit L2H2 (targa DV344HD) è il furgone grande uso città di LILO S.r.l.: dimensioni L2H2 ideali per traslochi voluminosi e trasporto merci, con ottima manovrabilità in ambito urbano. Tetto alto (H2) e passo medio (L2) per stivare carichi alti, mobili e bancali. Ritiro e riconsegna presso la sede di Viale Campi Elisi 38/b a Trieste.',
  'Noleggio Ford Transit L2H2 Trieste | Furgoni Grandi Città | LILO',
  'Noleggia il Ford Transit L2H2 a Trieste (Viale Campi Elisi 38/b). Furgone grande uso città, ampia capacità di carico. LILO Autonoleggio.',
  'Ford Transit L2H2 — furgone grande uso città a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b. Targa DV344HD.',
  ARRAY[
    'Categoria Grande / Città: Dimensioni L2H2 ideali per traslochi voluminosi e trasporto merci, mantenendo un''ottima manovrabilità urbana.',
    'Ampia Capacità di Carico: Tetto alto (H2) e passo medio (L2) per stivare carichi alti, mobili e bancali senza problemi.',
    'Ritiro in Sede: Disponibile per il ritiro diretto presso la sede di Viale Campi Elisi 38/b a Trieste.'
  ],
  'Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.',
  10,
  1200,
  10,
  1200,
  'Anteriore',
  'Medio',
  'Alto',
  false,
  '/images/veicoli/ford-transit-l2h2-noleggio-trieste.webp'
FROM public.categorie c
WHERE c.slug = 'furgoni-grandi-citta'
ON CONFLICT (slug) DO UPDATE SET
  targa = EXCLUDED.targa,
  marca = EXCLUDED.marca,
  modello = EXCLUDED.modello,
  versione = EXCLUDED.versione,
  titolo_pubblico = EXCLUDED.titolo_pubblico,
  sottotitolo = EXCLUDED.sottotitolo,
  descrizione_breve = EXCLUDED.descrizione_breve,
  descrizione_completa = EXCLUDED.descrizione_completa,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  ai_summary = EXCLUDED.ai_summary,
  ai_highlights = EXCLUDED.ai_highlights,
  ai_context = EXCLUDED.ai_context,
  og_image_url = EXCLUDED.og_image_url,
  categoria_id = EXCLUDED.categoria_id,
  pubblicato = true,
  attivo = true;

INSERT INTO public.prezzi (veicolo_id, tipo_tariffa, importo, descrizione, attivo)
SELECT v.id, 'giornaliero', 55.00, '50 km inclusi / Assicurazione base — uso città', true
FROM public.veicoli v
WHERE v.slug = 'ford-transit-l2h2'
  AND NOT EXISTS (
    SELECT 1 FROM public.prezzi p
    WHERE p.veicolo_id = v.id AND p.tipo_tariffa = 'giornaliero'
  );

UPDATE public.prezzi
SET importo = 55.00, descrizione = '50 km inclusi / Assicurazione base — uso città', attivo = true
WHERE veicolo_id = (SELECT id FROM public.veicoli WHERE slug = 'ford-transit-l2h2')
  AND tipo_tariffa = 'giornaliero';

INSERT INTO public.foto (veicolo_id, storage_bucket, storage_path, url_pubblico, alt_text, titolo, ordine, is_copertina)
SELECT v.id, 'veicoli', 'local/ford-transit-l2h2-noleggio-trieste.webp',
  '/images/veicoli/ford-transit-l2h2-noleggio-trieste.webp',
  'Noleggio furgone Ford Transit L2H2 presso LILO Autonoleggio in Viale Campi Elisi 38/b Trieste',
  'Ford Transit L2H2 noleggio furgoni grandi Trieste Viale Campi Elisi',
  0, true
FROM public.veicoli v
WHERE v.slug = 'ford-transit-l2h2'
  AND NOT EXISTS (
    SELECT 1 FROM public.foto f
    WHERE f.veicolo_id = v.id AND f.storage_path = 'local/ford-transit-l2h2-noleggio-trieste.webp'
  );

INSERT INTO public.foto (veicolo_id, storage_bucket, storage_path, url_pubblico, alt_text, titolo, ordine, is_copertina)
SELECT v.id, 'veicoli', 'local/ford-transit-l2h2-retro-trieste.webp',
  '/images/veicoli/ford-transit-l2h2-retro-trieste.webp',
  'Vista posteriore Ford Transit L2H2 per traslochi e trasporto merci a Trieste Viale Campi Elisi',
  'Noleggio Ford Transit L2H2 Categoria Grande Trieste',
  1, false
FROM public.veicoli v
WHERE v.slug = 'ford-transit-l2h2'
  AND NOT EXISTS (
    SELECT 1 FROM public.foto f
    WHERE f.veicolo_id = v.id AND f.storage_path = 'local/ford-transit-l2h2-retro-trieste.webp'
  );
