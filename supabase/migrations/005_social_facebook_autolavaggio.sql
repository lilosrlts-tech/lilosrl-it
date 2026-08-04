-- Facebook separato per autolavaggio (noleggio usa social_facebook)
ALTER TABLE public.impostazioni_sito
  ADD COLUMN IF NOT EXISTS social_facebook_autolavaggio TEXT;

UPDATE public.impostazioni_sito
SET
  social_facebook = COALESCE(
    social_facebook,
    'https://www.facebook.com/LilaAutonoleggioFurgoniTrieste/'
  ),
  social_facebook_autolavaggio = COALESCE(
    social_facebook_autolavaggio,
    'https://www.facebook.com/LiloAutolavaggioTrieste/'
  ),
  orari_noleggio = COALESCE(
    orari_noleggio,
    'Lunedì – Venerdì: 8:30 – 12:30 / 15:00 – 17:30' || E'\n' ||
    'Sabato: 8:30 – 12:30' || E'\n' ||
    'Domenica: chiuso'
  ),
  orari_autolavaggio = COALESCE(
    orari_autolavaggio,
    'Lunedì – Sabato: 8:30 – 13:00 / 14:00 – 18:30' || E'\n' ||
    'Domenica: chiuso'
  ),
  indirizzo_noleggio = COALESCE(
    indirizzo_noleggio,
    'Viale Campi Elisi 38/B, 34143 Trieste (TS)'
  )
WHERE id = 'a0000000-0000-0000-0000-000000000001';
