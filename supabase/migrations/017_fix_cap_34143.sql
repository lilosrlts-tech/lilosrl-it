-- Corregge CAP errato 34132 → 34143 (Campi Elisi / Trieste)
UPDATE public.impostazioni_sito
SET
  indirizzo_noleggio = REPLACE(indirizzo_noleggio, '34132', '34143'),
  indirizzo_autolavaggio = REPLACE(indirizzo_autolavaggio, '34132', '34143')
WHERE indirizzo_noleggio LIKE '%34132%'
   OR indirizzo_autolavaggio LIKE '%34132%';
