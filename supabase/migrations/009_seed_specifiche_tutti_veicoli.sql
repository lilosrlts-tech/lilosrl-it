-- Specifiche tecniche complete per tutti i veicoli seed della flotta

-- Fiat Panda (Auto)
UPDATE public.veicoli SET
  cambio = 'Manuale', posti = 5, porte = 5, anno_immatricolazione = 2021,
  capacita_bagagliaio_valigie = 2, classe_ambientale = 'Euro 6',
  connessione_smartphone = 'Apple CarPlay, Android Auto',
  trazione = 'Anteriore', sensori_parcheggio = true,
  lunghezza_mm = 3653, larghezza_mm = 1643, altezza_mm = 1551
WHERE slug = 'fiat-panda-1-2';

-- Ford Tourneo (Pulmini 9 posti)
UPDATE public.veicoli SET
  cambio = 'Manuale', posti = 9, porte = 5, anno_immatricolazione = 2020,
  configurazione_sedili = '3+3+3', climatizzazione_posteriore = true,
  trazione = 'Anteriore', passo = 'Medio', tetto = 'Alto', sensori_parcheggio = true,
  lunghezza_mm = 5339, larghezza_mm = 1986, altezza_mm = 1976
WHERE slug = 'ford-tourneo-9-posti';

-- Fiat Doblò Cargo (Furgoni piccoli)
UPDATE public.veicoli SET
  cambio = 'Manuale', posti = 2, porte = 4, anno_immatricolazione = 2022,
  volume_metri_cubi = 3.4, portata_utile_kg = 750,
  volume_carico_mc = 3.4, portata_kg = 750,
  lunghezza_vano_mm = 1717, larghezza_vano_mm = 1548, altezza_vano_mm = 1305,
  vano_lunghezza_mm = 1717, vano_larghezza_mm = 1548, vano_altezza_mm = 1305,
  trazione = 'Anteriore', passo = 'Corto', tetto = 'Basso', sensori_parcheggio = true,
  lunghezza_mm = 4399, larghezza_mm = 1832, altezza_mm = 1845
WHERE slug = 'fiat-doblo-cargo';

-- Iveco Daily 35.12 (Furgoni grandi)
UPDATE public.veicoli SET
  cambio = 'Manuale', posti = 3, porte = 4, anno_immatricolazione = 2018,
  volume_metri_cubi = 12, portata_utile_kg = 1400,
  volume_carico_mc = 12, portata_kg = 1400,
  lunghezza_vano_mm = 4100, larghezza_vano_mm = 1870, altezza_vano_mm = 1935,
  vano_lunghezza_mm = 4100, vano_larghezza_mm = 1870, vano_altezza_mm = 1935,
  trazione = 'Anteriore', passo = 'Lungo', tetto = 'Alto', sensori_parcheggio = true,
  lunghezza_mm = 6190, larghezza_mm = 2050, altezza_mm = 2750
WHERE slug = 'iveco-daily-35-12';

-- Iveco Daily 70.17 (Furgoni XL)
UPDATE public.veicoli SET
  cambio = 'Manuale', posti = 3, porte = 4, anno_immatricolazione = 2017,
  volume_metri_cubi = 17, portata_utile_kg = 2000,
  volume_carico_mc = 17, portata_kg = 2000,
  lunghezza_vano_mm = 4800, larghezza_vano_mm = 1870, altezza_vano_mm = 2150,
  vano_lunghezza_mm = 4800, vano_larghezza_mm = 1870, vano_altezza_mm = 2150,
  trazione = 'Anteriore', passo = 'Lungo', tetto = 'Alto', sensori_parcheggio = true,
  lunghezza_mm = 7340, larghezza_mm = 2050, altezza_mm = 2750
WHERE slug = 'iveco-daily-70-17';
