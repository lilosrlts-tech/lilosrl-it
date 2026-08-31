-- =============================================================================
-- 023: Allinea NAP / orari / indirizzi a fonte canonica (GMB + web/src/lib/nap.ts)
-- Rimuove i valori storici del seed 002 (orari discordanti).
-- =============================================================================

UPDATE public.impostazioni_sito
SET
  orari_noleggio =
    'Lunedì – Venerdì: 08:30 – 12:30 / 15:00 – 17:30
Sabato: 08:30 – 12:30
Domenica: Chiuso',
  orari_autolavaggio =
    'Lunedì – Sabato: 09:00 – 13:00 / 14:00 – 18:30
Domenica: Chiuso',
  telefono_noleggio = '040 2471720',
  telefono_autolavaggio = '040 2471720',
  email_contatto = COALESCE(NULLIF(trim(email_contatto), ''), 'info@lilosrl.it'),
  indirizzo_noleggio = 'Viale Campi Elisi 38/b, 34143 Trieste (TS)',
  indirizzo_autolavaggio =
    'Via Giovanni Schiaparelli 21/a, 34143 Trieste (TS)
Ingresso da Via Schiaparelli 21/a — Uscita su Via G. De Coletti 7',
  servizi_noleggio_lista = COALESCE(
    NULLIF(trim(servizi_noleggio_lista), ''),
    'Noleggio Furgoni (S, M, L, XL)
Noleggio Autovetture e Utilitarie
Noleggio Pulmini 9 Posti
Ritiro e Consegna Veicoli in Sede'
  ),
  autolavaggio_lista_servizi = COALESCE(
    NULLIF(trim(autolavaggio_lista_servizi), ''),
    'Lavaggio Completo Interno ed Esterno
Sanificazione Abitacolo
Lavaggio e Cura Tappezzeria
Asciugatura Professionale e Trattamenti Carrozzeria'
  ),
  updated_at = now()
WHERE id = 'a0000000-0000-0000-0000-000000000001';

COMMENT ON COLUMN public.impostazioni_sito.orari_noleggio IS
  'Orari sede noleggio — allineati a GMB / web nap.ts (023)';
COMMENT ON COLUMN public.impostazioni_sito.orari_autolavaggio IS
  'Orari sede autolavaggio — allineati a GMB / web nap.ts (023)';
