-- SEO per pagine legali
INSERT INTO public.seo_settings (page_key, seo_title, seo_description, seo_keywords) VALUES
  (
    'privacy',
    'Privacy Policy | LILO S.r.l. Autonoleggio Trieste',
    'Informativa privacy e trattamento dati personali di LILO S.r.l. — noleggio auto e furgoni a Trieste.',
    ARRAY['privacy LILO', 'GDPR autonoleggio trieste']
  ),
  (
    'cookie-policy',
    'Cookie Policy | LILO S.r.l.',
    'Informativa sui cookie utilizzati dal sito LILO S.r.l. e gestione del consenso.',
    ARRAY['cookie policy', 'consenso cookie LILO']
  ),
  (
    'termini-condizioni',
    'Termini e Condizioni | LILO Autonoleggio Trieste',
    'Termini e condizioni di utilizzo del sito e dei servizi di noleggio veicoli LILO S.r.l. a Trieste.',
    ARRAY['termini noleggio', 'condizioni LILO trieste']
  )
ON CONFLICT (page_key) DO NOTHING;
