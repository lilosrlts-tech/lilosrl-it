-- Renault Master GG290XM: etichettato L2H3 per errore (volume/altezza OEM inferiti).
-- Il veicolo è L2H2; la scheda pubblica canonica è già renault-master-l2h2 (GF883SB).
-- Depubblicazione + allineamento dati: URL /flotta/renault-master-l2h3 → 301 verso L2H2.

UPDATE public.veicoli SET
  versione = 'L2H2',
  titolo_pubblico = 'Renault Master L2H2 — Furgone grande Trieste',
  sottotitolo = 'Veicolo commerciale passo medio, volume di carico intermedio',
  volume_metri_cubi = 10.8,
  volume_carico_mc = 10.8,
  portata_utile_kg = 1251,
  portata_kg = 1251,
  lunghezza_vano_mm = 3083,
  larghezza_vano_mm = 1765,
  altezza_vano_mm = 1894,
  vano_lunghezza_mm = 3083,
  vano_larghezza_mm = 1765,
  vano_altezza_mm = 1894,
  passo = 'Medio',
  tetto = 'Alto',
  pubblicato = false,
  updated_at = now()
WHERE slug = 'renault-master-l2h3';
