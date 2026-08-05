-- Corregge URL Facebook noleggio (typo Lila → Lilo)
UPDATE impostazioni_sito
SET social_facebook = 'https://www.facebook.com/LiloAutonoleggioFurgoniTrieste'
WHERE social_facebook IS NULL
   OR social_facebook ILIKE '%LilaAutonoleggio%'
   OR social_facebook ILIKE '%facebook.com/Lila%';
