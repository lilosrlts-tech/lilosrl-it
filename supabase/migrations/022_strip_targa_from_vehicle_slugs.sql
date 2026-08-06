-- Rimuove le targhe dagli slug pubblici delle schede veicolo.
-- Ordine: prima libera i conflitti, poi rinomina.

-- 1) Transit L2H2 città libera lo slug generico
UPDATE public.veicoli
SET slug = 'ford-transit-l2h2-citta',
    updated_at = now()
WHERE slug = 'ford-transit-l2h2';

-- 2) Rinomine da slug-con-targa → slug stabili
UPDATE public.veicoli SET slug = 'ford-transit-l2h2', updated_at = now()
WHERE slug = 'ford-transit-gg551rd';

UPDATE public.veicoli SET slug = 'ford-transit-custom-l1h1', updated_at = now()
WHERE slug = 'ford-transit-custom-fj932zy';

UPDATE public.veicoli SET slug = 'ford-transit-custom-l1h1-ibrido', updated_at = now()
WHERE slug = 'ford-transit-custom-gj446ak';

UPDATE public.veicoli SET slug = 'citroen-jumpy-l1h1', updated_at = now()
WHERE slug = 'citroen-jumpy-fr523sw';

UPDATE public.veicoli SET slug = 'fiat-doblo-cargo', updated_at = now()
WHERE slug = 'fiat-doblo-gh618pt'
  AND NOT EXISTS (SELECT 1 FROM public.veicoli v2 WHERE v2.slug = 'fiat-doblo-cargo');

UPDATE public.veicoli SET slug = 'citroen-jumper-l1h1', updated_at = now()
WHERE slug = 'citroen-jumper-es772tn';

UPDATE public.veicoli SET slug = 'peugeot-boxer-l2h2', updated_at = now()
WHERE slug = 'peugeot-boxer-l2h2-ew858wc';

UPDATE public.veicoli SET slug = 'renault-master-l2h2', updated_at = now()
WHERE slug = 'renault-master-l2h2-gf883sb';

UPDATE public.veicoli SET slug = 'renault-master-l2h3', updated_at = now()
WHERE slug = 'renault-master-gg290xm';

UPDATE public.veicoli SET slug = 'nissan-interstar-l3h2', updated_at = now()
WHERE slug = 'nissan-interstar-l3h2-gt436zp';

UPDATE public.veicoli SET slug = 'opel-movano-l2h2', updated_at = now()
WHERE slug = 'opel-movano-gc328pk';

-- Legacy demo / seed
UPDATE public.veicoli SET slug = 'ford-transit-l2h2-citta', updated_at = now()
WHERE slug = 'ford-transit-350m-dv344hd'
  AND NOT EXISTS (SELECT 1 FROM public.veicoli v2 WHERE v2.slug = 'ford-transit-l2h2-citta');

UPDATE public.veicoli SET slug = 'peugeot-boxer-l3h3', updated_at = now()
WHERE slug = 'peugeot-boxer-l3h3-ix345ij'
  AND NOT EXISTS (SELECT 1 FROM public.veicoli v2 WHERE v2.slug = 'peugeot-boxer-l3h3');

-- Canonical URL (se valorizzato a mano)
UPDATE public.veicoli
SET canonical_url = 'https://www.lilosrl.it/flotta/' || slug,
    updated_at = now()
WHERE canonical_url IS NOT NULL
  AND canonical_url LIKE '%/flotta/%';
