-- =============================================================================
-- CMS esteso + SEO settings per pagine statiche LILO S.r.l.
-- Eseguire dopo 002_impostazioni_sito.sql
-- =============================================================================

ALTER TABLE public.impostazioni_sito
  ADD COLUMN IF NOT EXISTS email_preventivi TEXT NOT NULL DEFAULT 'info@lilosrl.it',
  ADD COLUMN IF NOT EXISTS social_facebook TEXT,
  ADD COLUMN IF NOT EXISTS social_instagram TEXT,
  ADD COLUMN IF NOT EXISTS social_linkedin TEXT,
  ADD COLUMN IF NOT EXISTS hero_titolo_home TEXT NOT NULL DEFAULT 'Noleggio auto e furgoni a Trieste',
  ADD COLUMN IF NOT EXISTS hero_badge_home TEXT NOT NULL DEFAULT 'Trieste · Piazza Unità d''Italia',
  ADD COLUMN IF NOT EXISTS home_punti_forza_titolo TEXT NOT NULL DEFAULT 'I punti di forza che fanno la differenza',
  ADD COLUMN IF NOT EXISTS home_punti_forza_json TEXT,
  ADD COLUMN IF NOT EXISTS chi_siamo_hero_titolo TEXT,
  ADD COLUMN IF NOT EXISTS chi_siamo_hero_sottotitolo TEXT,
  ADD COLUMN IF NOT EXISTS chi_siamo_intro TEXT,
  ADD COLUMN IF NOT EXISTS offerta_titolo TEXT NOT NULL DEFAULT 'Offerta del Mese',
  ADD COLUMN IF NOT EXISTS offerta_descrizione TEXT,
  ADD COLUMN IF NOT EXISTS offerta_attiva BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS autolavaggio_lista_servizi TEXT,
  ADD COLUMN IF NOT EXISTS servizi_noleggio_lista TEXT;

UPDATE public.impostazioni_sito
SET
  email_preventivi = COALESCE(email_preventivi, email_contatto),
  offerta_descrizione = COALESCE(
    offerta_descrizione,
    'Ogni mese selezioniamo veicoli e tariffe agevolate per privati e aziende. Contattaci per conoscere l''offerta attuale o consulta la flotta online.'
  ),
  autolavaggio_lista_servizi = COALESCE(
    autolavaggio_lista_servizi,
    'Lavaggio esterno completo
Lavaggio interno con aspirazione
Asciugatura professionale
Trattamenti carrozzeria e cerchi
Sanificazione abitacolo'
  ),
  servizi_noleggio_lista = COALESCE(
    servizi_noleggio_lista,
    'Noleggio giornaliero e settimanale
Furgoni, pulmini e auto
Ritiro in sede a Trieste
Preventivi personalizzati per aziende'
  ),
  chi_siamo_hero_titolo = COALESCE(
    chi_siamo_hero_titolo,
    'LILO SRL: 20 ANNI DI ESPERIENZA NEI TRASPORTI E SERVIZI A TRIESTE'
  ),
  chi_siamo_hero_sottotitolo = COALESCE(chi_siamo_hero_sottotitolo, 'La Nostra Storia: Dal 2003 a Oggi'),
  chi_siamo_intro = COALESCE(
    chi_siamo_intro,
    'Dal 2003 LILO opera a Trieste con professionalità nei trasporti, nel noleggio veicoli e nei servizi integrati per privati, aziende ed enti.'
  )
WHERE id = 'a0000000-0000-0000-0000-000000000001';

-- -----------------------------------------------------------------------------
-- SEO per pagine statiche
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seo_settings (
  page_key          TEXT PRIMARY KEY,
  seo_title         TEXT NOT NULL,
  seo_description   TEXT NOT NULL,
  seo_keywords      TEXT[] NOT NULL DEFAULT '{}',
  meta_robots       TEXT NOT NULL DEFAULT 'index, follow',
  canonical_url     TEXT,
  og_title          TEXT,
  og_description    TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT seo_settings_page_key_format CHECK (page_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE TRIGGER trg_seo_settings_updated_at
  BEFORE UPDATE ON public.seo_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seo_settings_lettura_pubblica"
  ON public.seo_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "seo_settings_modifica_authenticated"
  ON public.seo_settings FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "seo_settings_insert_authenticated"
  ON public.seo_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

INSERT INTO public.seo_settings (page_key, seo_title, seo_description, seo_keywords) VALUES
  (
    'home',
    'Noleggio Furgoni e Auto a Trieste | LILO S.r.l.',
    'Noleggio auto e furgoni a Trieste: flotta moderna, tariffe trasparenti, ritiro in sede. LILO S.r.l. dal 2003 al servizio di privati e aziende.',
    ARRAY['noleggio auto trieste', 'noleggio furgoni trieste', 'autonoleggio trieste', 'LILO S.r.l.']
  ),
  (
    'flotta',
    'Flotta Noleggio Furgoni e Auto a Trieste | Lilo Srl',
    'Scopri la flotta LILO S.r.l. a Trieste: auto, pulmini 9 posti e furgoni da piccoli a XL. Tariffe trasparenti, ritiro in sede.',
    ARRAY['flotta noleggio trieste', 'furgoni noleggio', 'pulmini 9 posti trieste']
  ),
  (
    'autolavaggio',
    'Autolavaggio Trieste | LILO S.r.l.',
    'Autolavaggio self-service e professionale a Trieste. Lavaggio interno ed esterno, ingresso Via Schiaparelli, uscita Via De Coletti.',
    ARRAY['autolavaggio trieste', 'lavaggio auto trieste', 'LILO autolavaggio']
  ),
  (
    'tariffe',
    'Prezzi Noleggio Auto e Furgoni Trieste | LILO S.r.l.',
    'Listino prezzi noleggio auto e furgoni a Trieste aggiornato dalla flotta LILO. Tariffe giornaliere trasparenti.',
    ARRAY['prezzi noleggio furgoni trieste', 'tariffe autonoleggio trieste']
  ),
  (
    'offerte',
    'Offerta del Mese — LILO Autonoleggio Trieste',
    'Promozioni mensili su noleggio auto e furgoni a Trieste. Scopri le occasioni LILO S.r.l.',
    ARRAY['offerta noleggio trieste', 'promozioni autonoleggio']
  ),
  (
    'chi-siamo',
    'Chi Siamo — LILO SRL | 20 Anni di Esperienza a Trieste',
    'Dal 2003 LILO S.r.l. è leader a Trieste in trasporti, noleggio furgoni e auto, autolavaggio professionale.',
    ARRAY['LILO S.r.l.', 'noleggio trieste', 'trasporti trieste']
  ),
  (
    'contatti',
    'Contatti — LILO Autonoleggio Trieste',
    'Contatta LILO S.r.l. per noleggio auto e furgoni a Trieste. Telefono, email, sede in Viale Campi Elisi.',
    ARRAY['contatti LILO trieste', 'noleggio auto trieste contatti']
  )
ON CONFLICT (page_key) DO NOTHING;
