-- Allinea seo_settings ai limiti SERP (title 30–60, description 120–160).
-- I veicoli lunghi restano corretti a runtime da fitSeoTitle/fitSeoDescription.

UPDATE public.seo_settings SET
  seo_title = 'Prezzi Noleggio Auto e Furgoni Trieste | LILO S.r.l.',
  seo_description = 'Listino prezzi noleggio auto e furgoni a Trieste aggiornato dalla flotta LILO. Tariffe giornaliere IVA inclusa, trasparenti e ritiro in sede.',
  updated_at = now()
WHERE page_key = 'tariffe';

UPDATE public.seo_settings SET
  seo_title = 'Noleggio Furgone Weekend Trieste 83€ | LILO',
  seo_description = 'Promo Weekend furgoni grandi uso città a Trieste: sabato–lunedì a 83€ IVA inclusa, 75 km. Paghi 1 giorno e mezzo, tieni il mezzo 48 ore.',
  og_title = 'Noleggio Furgone Weekend Trieste 83€ | LILO',
  og_description = 'Promo Weekend furgoni grandi uso città a Trieste: sabato–lunedì a 83€ IVA inclusa, 75 km. Paghi 1 giorno e mezzo, tieni il mezzo 48 ore.',
  updated_at = now()
WHERE page_key = 'offerte';

UPDATE public.seo_settings SET
  seo_description = 'Dal 2003 LILO S.r.l. è a Trieste con noleggio furgoni e auto, autolavaggio e servizi per privati, aziende e clienti istituzionali.',
  updated_at = now()
WHERE page_key = 'chi-siamo';

UPDATE public.seo_settings SET
  seo_description = 'Contatta LILO S.r.l. per noleggio auto e furgoni a Trieste: telefono, WhatsApp, email e sede operativa in Viale Campi Elisi 38/b.',
  updated_at = now()
WHERE page_key = 'contatti';

UPDATE public.seo_settings SET
  seo_description = 'Informativa privacy e trattamento dati personali di LILO S.r.l., autonoleggio e autolavaggio a Trieste. Diritti degli interessati e contatti del titolare.',
  updated_at = now()
WHERE page_key = 'privacy';

UPDATE public.seo_settings SET
  seo_title = 'Cookie Policy LILO | Autonoleggio Trieste',
  seo_description = 'Informativa sui cookie del sito LILO S.r.l. (noleggio e autolavaggio a Trieste): tipi di cookie, finalità e come gestire il consenso.',
  updated_at = now()
WHERE page_key = 'cookie-policy';

UPDATE public.seo_settings SET
  seo_description = 'Termini e condizioni di LILO S.r.l. per il noleggio veicoli a Trieste: obblighi del cliente, cauzione, chilometri e uso del sito web.',
  updated_at = now()
WHERE page_key = 'termini-condizioni';

-- Title veicolo troppo lunghi → template corto (il runtime clamp resta comunque attivo).
UPDATE public.veicoli
SET
  seo_title = left('Noleggio ' || marca || ' ' || modello || ' Trieste | LILO', 60),
  updated_at = now()
WHERE seo_title IS NOT NULL
  AND char_length(seo_title) > 60;

-- Meta description veicolo troppo lunghe: taglio soft a 160.
UPDATE public.veicoli
SET
  seo_description = left(seo_description, 160),
  updated_at = now()
WHERE seo_description IS NOT NULL
  AND char_length(seo_description) > 160;
