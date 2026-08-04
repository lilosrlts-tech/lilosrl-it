-- Sottocategoria Furgoni Grandi (Uso Città) — tariffa 55€/50 km
INSERT INTO public.categorie (nome, slug, descrizione, ordine, attivo) VALUES
  (
    'Furgoni Grandi (Uso Città)',
    'furgoni-grandi-citta',
    'Furgoni grandi ottimizzati per uso urbano a Trieste — 50 km inclusi',
    6,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  nome = EXCLUDED.nome,
  descrizione = EXCLUDED.descrizione,
  ordine = EXCLUDED.ordine,
  attivo = true;

UPDATE public.categorie SET ordine = 7 WHERE slug = 'furgoni-xl';
