-- Accessori per categoria: auto/pulmini vs furgoni
-- Disattiva vecchi optional e allinea prezzi/assegnazioni

UPDATE public.accessori SET attivo = false, updated_at = now()
WHERE slug IN (
  'gps',
  'cinghie-fissaggio',
  'seggiolino-base-2-3',
  'seggiolino-isofix-1-2-3',
  'rampa-carico-moto'
);

-- Catalogo definitivo (4 voci)
INSERT INTO public.accessori (
  nome, slug, descrizione, prezzo_giornaliero, deposito, deposito_richiesto, quantita_max, attivo, ordine
) VALUES
  (
    'Rialzo auto per bambini Gruppo 3 da 22 a 36 kg',
    'rialzo-bambini-gruppo-3',
    'Rialzo Gruppo 3 (22–36 kg) per auto e pulmini',
    4.00, NULL, false, 2, true, 10
  ),
  (
    'Seggiolino Auto 9-36 kg ISOFIX Gruppo 1 2 3',
    'seggiolino-isofix-9-36',
    'Seggiolino Isofix 9–36 kg (Gruppo 1-2-3) per auto e pulmini',
    6.00, NULL, false, 2, true, 20
  ),
  (
    'Rampa carico moto',
    'rampa',
    'Rampa per carico moto / scooter su furgoni',
    5.00, NULL, false, 1, true, 30
  ),
  (
    'Carrello manuale',
    'carrello-manuale',
    'Carrello a mano per carico/scarico furgoni',
    5.00, NULL, false, 2, true, 40
  )
ON CONFLICT (slug) DO UPDATE SET
  nome = EXCLUDED.nome,
  descrizione = EXCLUDED.descrizione,
  prezzo_giornaliero = EXCLUDED.prezzo_giornaliero,
  deposito = EXCLUDED.deposito,
  deposito_richiesto = EXCLUDED.deposito_richiesto,
  quantita_max = EXCLUDED.quantita_max,
  attivo = EXCLUDED.attivo,
  ordine = EXCLUDED.ordine,
  updated_at = now();

-- Riassegna: svuota link e ricrea per categoria
DELETE FROM public.veicolo_accessori;

-- Auto + pulmini 9 posti → solo rialzo + seggiolino Isofix
INSERT INTO public.veicolo_accessori (veicolo_id, accessorio_id)
SELECT v.id, a.id
FROM public.veicoli v
JOIN public.categorie c ON c.id = v.categoria_id
JOIN public.accessori a ON a.slug IN ('rialzo-bambini-gruppo-3', 'seggiolino-isofix-9-36')
WHERE c.slug IN ('auto', 'pulmini-9-posti')
  AND v.attivo = true
  AND a.attivo = true
ON CONFLICT DO NOTHING;

-- Tutte le altre categorie (furgoni…) → solo rampa + carrello
INSERT INTO public.veicolo_accessori (veicolo_id, accessorio_id)
SELECT v.id, a.id
FROM public.veicoli v
JOIN public.categorie c ON c.id = v.categoria_id
JOIN public.accessori a ON a.slug IN ('rampa', 'carrello-manuale')
WHERE c.slug NOT IN ('auto', 'pulmini-9-posti')
  AND v.attivo = true
  AND a.attivo = true
ON CONFLICT DO NOTHING;
