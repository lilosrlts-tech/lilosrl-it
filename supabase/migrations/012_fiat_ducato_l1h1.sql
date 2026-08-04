-- Fiat Ducato L1H1 FG289KB — Furgone Grande (rampa moto + HACCP)

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
  'FG289KB',
  'Fiat',
  'Ducato',
  'L1H1',
  2018,
  'Bianco',
  'Diesel',
  'Manuale',
  3,
  4,
  'fiat-ducato-l1h1',
  true,
  true,
  3,
  'Fiat Ducato L1H1 — Furgone grande Trieste',
  'Con rampa moto e vano lavabile HACCP',
  'Noleggio Fiat Ducato L1H1 a Trieste: rampa di carico moto in alluminio, rivestimento interno lavabile idoneo HACCP e vano ottimizzato. Targa FG289KB.',
  'Il Fiat Ducato L1H1 (targa FG289KB) è un furgone grande ideale per chi deve caricare moto, attrezzature o merci alimentari. È dotato di rampa di carico rinforzata in alluminio antiscivolo, vano interno completamente rivestito con materiali lavabili e igienizzabili conformi alle normative HACCP, fondo rinforzato e passaruota protetti. Disponibile presso LILO S.r.l. a Trieste, Viale Campi Elisi 38/B.',
  'Noleggio Fiat Ducato L1H1 Trieste | Rampa moto e HACCP | LILO',
  'Noleggia il Fiat Ducato L1H1 a Trieste con rampa di carico moto e rivestimento lavabile HACCP. Ritiro in sede LILO S.r.l.',
  'Fiat Ducato L1H1 con rampa moto e vano lavabile HACCP — noleggio a Trieste presso LILO S.r.l. Targa FG289KB.',
  ARRAY[
    'Rampa di carico moto: Dotato di rampa rinforzata in alluminio antiscivolo per il carico/scarico agevole e sicuro di motocicli.',
    'Rivestimento lavabile idoneo HACCP: Vano interno completamente rivestito con materiali lavabili e igienizzabili, conforme alle normative HACCP per il trasporto alimentare, catering e merci fresche.',
    'Vano ottimizzato: Fondo rinforzato e passaruota protetti per massima versatilità tra merci, moto e alimenti.'
  ],
  'Ritiro e riconsegna presso la sede LILO in Viale Campi Elisi 38/B, Trieste.',
  8,
  1100,
  8,
  1100,
  'Anteriore',
  'Corto',
  'Basso',
  true,
  '/images/veicoli/fiat-ducato-l1h1-noleggio-trieste.webp'
FROM public.categorie c
WHERE c.slug = 'furgoni-grandi'
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
  pubblicato = true,
  attivo = true;

INSERT INTO public.prezzi (veicolo_id, tipo_tariffa, importo, descrizione, attivo)
SELECT v.id, 'giornaliero', 60.00, '100 km inclusi / Assicurazione base', true
FROM public.veicoli v
WHERE v.slug = 'fiat-ducato-l1h1'
  AND NOT EXISTS (
    SELECT 1 FROM public.prezzi p
    WHERE p.veicolo_id = v.id AND p.tipo_tariffa = 'giornaliero'
  );

UPDATE public.prezzi
SET importo = 60.00, descrizione = '100 km inclusi / Assicurazione base', attivo = true
WHERE veicolo_id = (SELECT id FROM public.veicoli WHERE slug = 'fiat-ducato-l1h1')
  AND tipo_tariffa = 'giornaliero';

INSERT INTO public.foto (veicolo_id, storage_bucket, storage_path, url_pubblico, alt_text, titolo, ordine, is_copertina)
SELECT v.id, 'veicoli', 'local/fiat-ducato-l1h1-noleggio-trieste.webp',
  '/images/veicoli/fiat-ducato-l1h1-noleggio-trieste.webp',
  'Noleggio Fiat Ducato L1H1 Trieste — esterno principale LILO S.r.l.',
  'Esterno principale',
  0, true
FROM public.veicoli v
WHERE v.slug = 'fiat-ducato-l1h1'
  AND NOT EXISTS (
    SELECT 1 FROM public.foto f
    WHERE f.veicolo_id = v.id AND f.storage_path = 'local/fiat-ducato-l1h1-noleggio-trieste.webp'
  );

INSERT INTO public.foto (veicolo_id, storage_bucket, storage_path, url_pubblico, alt_text, titolo, didascalia, ordine, is_copertina)
SELECT v.id, 'veicoli', 'local/fiat-ducato-l1h1-rampa-moto-haccp.webp',
  '/images/veicoli/fiat-ducato-l1h1-rampa-moto-haccp.webp',
  'Fiat Ducato L1H1 con rampa di carico per moto e lavabile per trasporto alimentari HACCP',
  'Noleggio furgone Fiat Ducato L1H1 con rampa moto e idoneità HACCP Trieste',
  'Rampa alluminio antiscivolo e vano rivestito HACCP',
  1, false
FROM public.veicoli v
WHERE v.slug = 'fiat-ducato-l1h1'
  AND NOT EXISTS (
    SELECT 1 FROM public.foto f
    WHERE f.veicolo_id = v.id AND f.storage_path = 'local/fiat-ducato-l1h1-rampa-moto-haccp.webp'
  );

INSERT INTO public.foto (veicolo_id, storage_bucket, storage_path, url_pubblico, alt_text, titolo, ordine, is_copertina)
SELECT v.id, 'veicoli', 'local/fiat-ducato-l1h1-posteriore-noleggio-trieste.webp',
  '/images/veicoli/fiat-ducato-l1h1-posteriore-noleggio-trieste.webp',
  'Fiat Ducato L1H1 posteriore — noleggio furgone grande Trieste LILO',
  'Vista posteriore',
  2, false
FROM public.veicoli v
WHERE v.slug = 'fiat-ducato-l1h1'
  AND NOT EXISTS (
    SELECT 1 FROM public.foto f
    WHERE f.veicolo_id = v.id AND f.storage_path = 'local/fiat-ducato-l1h1-posteriore-noleggio-trieste.webp'
  );
