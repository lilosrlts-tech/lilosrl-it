-- Dotazione portapacchi / barre portatutto: Fiat Doblò Cargo e Opel Vivaro
-- SEO: trasporto materiali lunghi e ingombranti (visibili anche nelle foto flotta)

UPDATE public.veicoli SET
  sottotitolo = 'Furgone piccolo con portapacchi integrato, ideale consegne e materiali lunghi',
  descrizione_breve = 'Noleggio Fiat Doblò Cargo a Trieste: furgone piccolo diesel con portapacchi integrato (barre portatutto) sul tetto. Compatto in città, adatto anche a tubi, profili e carichi lunghi o ingombranti.',
  descrizione_completa = 'Il Fiat Doblò Cargo è un furgone piccolo diesel della flotta LILO S.r.l. a Trieste: compatto e maneggevole per consegne urbane, piccoli traslochi e lavoro artigianale. Equipaggiato con portapacchi integrati sul tetto, utili per trasportare scale, tubi, profili, pannelli e altri materiali lunghi o ingombranti che non rientrano nel vano di carico. Ritiro e riconsegna presso la sede di Viale Campi Elisi 38/B a Trieste.',
  ai_summary = 'Fiat Doblò Cargo diesel con portapacchi integrato — furgone piccolo a noleggio a Trieste presso LILO S.r.l. Ideale per consegne urbane e trasporto di materiali lunghi o ingombranti.',
  ai_highlights = ARRAY[
    '🪜 Portapacchi integrato: barre sul tetto per scale, tubi, profili e materiali lunghi o ingombranti.',
    'Compatto in città: ideale per consegne urbane, piccoli traslochi e lavoro artigianale.',
    'Furgone piccolo diesel: vano utile circa 3,4 m³.',
    'Ritiro in sede: Viale Campi Elisi 38/b, Trieste.'
  ],
  seo_description = 'Noleggia il Fiat Doblò Cargo a Trieste con LILO S.r.l. Furgone piccolo diesel con portapacchi integrato, ideale per materiali lunghi e ingombranti. Ritiro in sede.',
  seo_keywords = ARRAY[
    'noleggio fiat doblo trieste',
    'furgone piccolo portapacchi',
    'barre portatutto noleggio trieste',
    'trasporto materiali lunghi trieste'
  ],
  ai_faq = '[
    {"q": "Il Fiat Doblò ha le barre sul tetto?", "a": "Sì: portapacchi integrati (barre portatutto) per scale, tubi, profili e carichi lunghi o ingombranti."},
    {"q": "Per cosa serve il portapacchi sul Doblò?", "a": "Per trasportare materiali che superano la lunghezza del vano di carico, come tubi, profili, scale e pannelli, in sicurezza sul tetto."}
  ]'::jsonb,
  updated_at = now()
WHERE slug = 'fiat-doblo-cargo';

UPDATE public.veicoli SET
  sottotitolo = 'Furgone medio con portapacchi integrato, ideale città e materiali lunghi',
  descrizione_breve = 'Noleggio Opel Vivaro Van a Trieste: furgone medio con portapacchi integrato (barre portatutto) sul tetto, vano capiente e guida agevole. Ideale anche per tubi, profili e carichi lunghi o ingombranti. Ritiro in Viale Campi Elisi 38/b.',
  descrizione_completa = 'L''Opel Vivaro Van è il furgone medio di LILO S.r.l.: bilanciamento ideale tra vano di carico e manovrabilità nel traffico di Trieste. Equipaggiato con portapacchi integrati (barre portatutto) sul tetto per scale, tubi, profili e altri materiali lunghi o ingombranti che non entrano comodamente nel vano. Adatto a professionisti e privati per piccoli traslochi o lavoro quotidiano. Ritiro e riconsegna presso la sede di Viale Campi Elisi 38/b a Trieste.',
  ai_summary = 'Opel Vivaro Van — furgone medio con portapacchi integrato (barre portatutto) a noleggio a Trieste presso LILO S.r.l., Viale Campi Elisi 38/b. Ideale per materiali lunghi e ingombranti.',
  ai_highlights = ARRAY[
    '📦 Dimensioni intermedie ideali: bilanciamento perfetto tra vano di carico capiente e facilità di guida nel traffico cittadino.',
    '🪜 Portapacchi integrato: barre sul tetto per scale, tubi, profili e materiali lunghi o ingombranti.',
    '💼 Per professionisti e privati: ottimo per piccoli traslochi fai-da-te e lavoro quotidiano.',
    '📍 Ritiro e consegna in sede: Viale Campi Elisi 38/b, Trieste.'
  ],
  seo_description = 'Noleggia l''Opel Vivaro Van a Trieste (Viale Campi Elisi 38/b). Furgone medio con portapacchi integrato, ideale per materiali lunghi, ingombranti e piccoli traslochi. LILO.',
  seo_keywords = ARRAY[
    'noleggio opel vivaro trieste',
    'furgone medio trieste',
    'portapacchi integrato noleggio',
    'barre portatutto noleggio',
    'trasporto materiali lunghi trieste'
  ],
  ai_faq = '[
    {"q": "Dove ritiro l''Opel Vivaro?", "a": "Presso la sede LILO in Viale Campi Elisi 38/b, Trieste."},
    {"q": "Ha le barre sul tetto?", "a": "Sì: portapacchi integrati (barre portatutto), utili per scale, tubi, profili e carichi lunghi o ingombranti."},
    {"q": "Posso trasportare materiali lunghi con l''Opel Vivaro?", "a": "Sì: i portapacchi sul tetto permettono di fissare tubi, profili, scale e altri carichi ingombranti che non rientrano nel vano di carico."}
  ]'::jsonb,
  updated_at = now()
WHERE slug = 'opel-vivaro';
