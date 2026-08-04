-- =============================================================================
-- Schema PostgreSQL (Supabase) — Flotta autonoleggio LILO S.r.l.
-- Tabelle: categorie, veicoli, prezzi, foto
-- Eseguire nel SQL Editor di Supabase o via CLI: supabase db push
-- =============================================================================

-- Estensioni utili
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- -----------------------------------------------------------------------------
-- Funzione generica per updated_at
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- CATEGORIE
-- Es. Auto, Furgone, Minivan — usate per filtri sito e tariffe di default
-- -----------------------------------------------------------------------------
CREATE TABLE public.categorie (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identità
  nome          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  descrizione   TEXT,
  icona         TEXT,                          -- nome icona o URL
  ordine        SMALLINT NOT NULL DEFAULT 0,
  attivo        BOOLEAN NOT NULL DEFAULT true,

  -- SEO pagina elenco categoria (es. /noleggio/furgoni)
  seo_title         TEXT,
  seo_description   TEXT,
  seo_keywords      TEXT[] DEFAULT '{}',
  meta_robots       TEXT DEFAULT 'index, follow',
  canonical_url     TEXT,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT categorie_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE INDEX idx_categorie_attivo_ordine ON public.categorie (attivo, ordine);

CREATE TRIGGER trg_categorie_updated_at
  BEFORE UPDATE ON public.categorie
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.categorie IS 'Categorie veicoli (Auto, Furgone, ecc.)';

-- -----------------------------------------------------------------------------
-- VEICOLI
-- Anagrafica flotta + metadati SEO e contesto per motori di ricerca / IA
-- -----------------------------------------------------------------------------
CREATE TABLE public.veicoli (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id    UUID NOT NULL REFERENCES public.categorie(id) ON DELETE RESTRICT,

  -- Dati operativi
  targa           TEXT NOT NULL UNIQUE,
  marca           TEXT NOT NULL,
  modello         TEXT NOT NULL,
  versione        TEXT,                        -- es. "350M 2.2", "2.0 TDCi"
  anno_immatricolazione SMALLINT,
  colore          TEXT,
  alimentazione   TEXT,                        -- Benzina, Diesel, Elettrico, Ibrido
  cambio          TEXT,                        -- Manuale, Automatico
  posti           SMALLINT,
  porte           SMALLINT,
  cilindrata_cc   INTEGER,
  potenza_kw      SMALLINT,
  bagagliaio_litri INTEGER,
  km_attuali      INTEGER,
  note_interne    TEXT,                        -- non pubblicate sul sito

  -- Pubblicazione sito
  slug            TEXT NOT NULL UNIQUE,
  pubblicato      BOOLEAN NOT NULL DEFAULT false,
  attivo          BOOLEAN NOT NULL DEFAULT true,  -- flotta operativa
  in_evidenza     BOOLEAN NOT NULL DEFAULT false,
  ordine          SMALLINT NOT NULL DEFAULT 0,

  -- Contenuto pagina veicolo
  titolo_pubblico     TEXT,                    -- H1 / nome commerciale
  sottotitolo         TEXT,
  descrizione_breve   TEXT,                    -- card elenco (max ~160 char consigliati)
  descrizione_completa TEXT,                   -- corpo pagina (HTML/Markdown)

  -- ── SEO classico ──────────────────────────────────────────────────────────
  seo_title           TEXT,                    -- <title>, max ~60 char
  seo_description     TEXT,                    -- meta description, max ~160 char
  seo_keywords        TEXT[] DEFAULT '{}',
  meta_robots         TEXT DEFAULT 'index, follow',
  canonical_url       TEXT,                    -- override URL canonica

  -- Open Graph / social
  og_title            TEXT,
  og_description      TEXT,
  og_image_url        TEXT,                    -- override; default = foto copertina

  -- Twitter Card (opzionale)
  twitter_card        TEXT DEFAULT 'summary_large_image',
  twitter_title       TEXT,
  twitter_description TEXT,

  -- ── Dati strutturati e IA ─────────────────────────────────────────────────
  -- JSON-LD Schema.org (tipo Car o Product); generabile da app o manuale
  json_ld             JSONB DEFAULT '{}',

  -- Sintesi ottimizzata per crawler IA (ChatGPT, Perplexity, Google AI Overview)
  ai_summary          TEXT,                    -- paragrafo neutro, fattuale, ~300 char
  ai_highlights       TEXT[] DEFAULT '{}',       -- bullet point: "7 posti", "Cambio auto"
  ai_faq              JSONB DEFAULT '[]',        -- [{"q":"...", "a":"..."}, ...]
  ai_context          TEXT,                    -- contesto extra: zone servite, requisiti patente

  -- hreflang / multilingua futuro
  lingua_default      TEXT NOT NULL DEFAULT 'it',

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT veicoli_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT veicoli_anno CHECK (
    anno_immatricolazione IS NULL
    OR (anno_immatricolazione >= 1980 AND anno_immatricolazione <= EXTRACT(YEAR FROM now())::SMALLINT + 1)
  )
);

CREATE INDEX idx_veicoli_categoria ON public.veicoli (categoria_id);
CREATE INDEX idx_veicoli_pubblicato ON public.veicoli (pubblicato, attivo, ordine)
  WHERE pubblicato = true AND attivo = true;
CREATE INDEX idx_veicoli_slug ON public.veicoli (slug);
CREATE INDEX idx_veicoli_json_ld ON public.veicoli USING GIN (json_ld);
CREATE INDEX idx_veicoli_seo_keywords ON public.veicoli USING GIN (seo_keywords);

CREATE TRIGGER trg_veicoli_updated_at
  BEFORE UPDATE ON public.veicoli
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.veicoli IS 'Flotta veicoli con metadati SEO e contesto per IA';
COMMENT ON COLUMN public.veicoli.json_ld IS 'Schema.org JSON-LD (es. @type Car, offers, brand)';
COMMENT ON COLUMN public.veicoli.ai_summary IS 'Testo conciso per LLM e AI search; evitare marketing aggressivo';
COMMENT ON COLUMN public.veicoli.ai_faq IS 'Array JSON domanda/risposta per featured snippet e AI';

-- -----------------------------------------------------------------------------
-- PREZZI
-- Tariffe per veicolo (prioritarie) o per categoria (fallback)
-- -----------------------------------------------------------------------------
CREATE TYPE public.tipo_tariffa AS ENUM (
  'giornaliero',
  'weekend',
  'settimanale',
  'mensile',
  'ora',
  'custom'
);

CREATE TABLE public.prezzi (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Esattamente uno dei due deve essere valorizzato
  veicolo_id      UUID REFERENCES public.veicoli(id) ON DELETE CASCADE,
  categoria_id    UUID REFERENCES public.categorie(id) ON DELETE CASCADE,

  tipo_tariffa    public.tipo_tariffa NOT NULL DEFAULT 'giornaliero',
  importo         NUMERIC(10, 2) NOT NULL CHECK (importo >= 0),
  valuta          CHAR(3) NOT NULL DEFAULT 'EUR',

  -- Validità stagionale / promozionale
  data_inizio     DATE,
  data_fine       DATE,
  giorni_minimo   SMALLINT DEFAULT 1,
  km_inclusi      INTEGER,                     -- NULL = illimitati
  deposito        NUMERIC(10, 2),
  descrizione     TEXT,                        -- es. "Tariffa weekend Ven-Dom"
  attivo          BOOLEAN NOT NULL DEFAULT true,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT prezzi_target_check CHECK (
    (veicolo_id IS NOT NULL AND categoria_id IS NULL)
    OR (veicolo_id IS NULL AND categoria_id IS NOT NULL)
  ),
  CONSTRAINT prezzi_date_check CHECK (
    data_inizio IS NULL OR data_fine IS NULL OR data_inizio <= data_fine
  )
);

-- Un solo prezzo attivo per combinazione veicolo/tipo nel periodo
CREATE UNIQUE INDEX idx_prezzi_veicolo_tipo_periodo
  ON public.prezzi (veicolo_id, tipo_tariffa, COALESCE(data_inizio, '1900-01-01'::DATE))
  WHERE veicolo_id IS NOT NULL AND attivo = true;

CREATE UNIQUE INDEX idx_prezzi_categoria_tipo_periodo
  ON public.prezzi (categoria_id, tipo_tariffa, COALESCE(data_inizio, '1900-01-01'::DATE))
  WHERE categoria_id IS NOT NULL AND attivo = true;

CREATE INDEX idx_prezzi_veicolo ON public.prezzi (veicolo_id) WHERE veicolo_id IS NOT NULL;
CREATE INDEX idx_prezzi_categoria ON public.prezzi (categoria_id) WHERE categoria_id IS NOT NULL;
CREATE INDEX idx_prezzi_validita ON public.prezzi (data_inizio, data_fine) WHERE attivo = true;

CREATE TRIGGER trg_prezzi_updated_at
  BEFORE UPDATE ON public.prezzi
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.prezzi IS 'Listino prezzi per veicolo o categoria con supporto stagionalità';

-- -----------------------------------------------------------------------------
-- FOTO
-- Immagini veicolo in Supabase Storage; metadati per SEO e accessibilità
-- -----------------------------------------------------------------------------
CREATE TABLE public.foto (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  veicolo_id      UUID NOT NULL REFERENCES public.veicoli(id) ON DELETE CASCADE,

  -- Storage Supabase: bucket "veicoli", path es. "{veicolo_id}/01-fronte.jpg"
  storage_bucket  TEXT NOT NULL DEFAULT 'veicoli',
  storage_path    TEXT NOT NULL,
  url_pubblico    TEXT NOT NULL,

  -- SEO e accessibilità
  alt_text        TEXT NOT NULL,               -- obbligatorio per WCAG e Google Images
  titolo          TEXT,
  didascalia      TEXT,
  ordine          SMALLINT NOT NULL DEFAULT 0,
  is_copertina    BOOLEAN NOT NULL DEFAULT false,

  -- Metadati tecnici (opzionali, da EXIF o upload)
  larghezza_px    INTEGER,
  altezza_px      INTEGER,
  mime_type       TEXT,
  peso_bytes      INTEGER,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT foto_storage_path_unique UNIQUE (storage_bucket, storage_path)
);

CREATE INDEX idx_foto_veicolo_ordine ON public.foto (veicolo_id, ordine);
CREATE UNIQUE INDEX idx_foto_copertina_unica
  ON public.foto (veicolo_id)
  WHERE is_copertina = true;

CREATE TRIGGER trg_foto_updated_at
  BEFORE UPDATE ON public.foto
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.foto IS 'Galleria fotografica veicoli con alt_text per SEO';

-- -----------------------------------------------------------------------------
-- VISTA: veicoli pubblicati con prezzo e copertina (per API / sito)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.veicoli_pubblici AS
SELECT
  v.id,
  v.slug,
  v.titolo_pubblico,
  v.sottotitolo,
  v.descrizione_breve,
  v.marca,
  v.modello,
  v.versione,
  v.anno_immatricolazione,
  v.colore,
  v.alimentazione,
  v.cambio,
  v.posti,
  v.porte,
  v.in_evidenza,
  v.ordine,
  v.seo_title,
  v.seo_description,
  v.seo_keywords,
  v.meta_robots,
  v.canonical_url,
  v.og_title,
  v.og_description,
  COALESCE(v.og_image_url, f.url_pubblico) AS og_image_url,
  v.json_ld,
  v.ai_summary,
  v.ai_highlights,
  v.ai_faq,
  v.ai_context,
  c.id   AS categoria_id,
  c.nome AS categoria_nome,
  c.slug AS categoria_slug,
  p.importo AS prezzo_giornaliero,
  p.valuta,
  f.url_pubblico AS foto_copertina,
  f.alt_text     AS foto_copertina_alt
FROM public.veicoli v
JOIN public.categorie c ON c.id = v.categoria_id
LEFT JOIN LATERAL (
  SELECT importo, valuta
  FROM public.prezzi
  WHERE veicolo_id = v.id
    AND tipo_tariffa = 'giornaliero'
    AND attivo = true
    AND (data_inizio IS NULL OR data_inizio <= CURRENT_DATE)
    AND (data_fine IS NULL OR data_fine >= CURRENT_DATE)
  ORDER BY data_inizio DESC NULLS LAST
  LIMIT 1
) p ON true
LEFT JOIN public.foto f ON f.veicolo_id = v.id AND f.is_copertina = true
WHERE v.pubblicato = true
  AND v.attivo = true
  AND c.attivo = true;

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (Supabase)
-- -----------------------------------------------------------------------------
ALTER TABLE public.categorie ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veicoli ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prezzi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foto ENABLE ROW LEVEL SECURITY;

-- Lettura pubblica per il sito (anon)
CREATE POLICY "categorie_lettura_pubblica"
  ON public.categorie FOR SELECT
  TO anon, authenticated
  USING (attivo = true);

CREATE POLICY "veicoli_lettura_pubblica"
  ON public.veicoli FOR SELECT
  TO anon, authenticated
  USING (pubblicato = true AND attivo = true);

CREATE POLICY "prezzi_lettura_pubblica"
  ON public.prezzi FOR SELECT
  TO anon, authenticated
  USING (attivo = true);

CREATE POLICY "foto_lettura_pubblica"
  ON public.foto FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.veicoli v
      WHERE v.id = foto.veicolo_id
        AND v.pubblicato = true
        AND v.attivo = true
    )
  );

-- Scrittura solo per utenti autenticati (back-office)
CREATE POLICY "categorie_gestione_authenticated"
  ON public.categorie FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "veicoli_gestione_authenticated"
  ON public.veicoli FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "prezzi_gestione_authenticated"
  ON public.prezzi FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "foto_gestione_authenticated"
  ON public.foto FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- DATI INIZIALI (allineati alla flotta LILO esistente)
-- -----------------------------------------------------------------------------
INSERT INTO public.categorie (nome, slug, descrizione, ordine, seo_title, seo_description) VALUES
  ('Auto', 'auto', 'Automobili per uso personale e business', 1,
   'Noleggio auto Trieste | LILO S.r.l.',
   'Noleggio auto a Trieste: vetture economiche e compatte. Ritiro in sede, tariffe trasparenti.'),
  ('Furgone', 'furgone', 'Furgoni e veicoli commerciali per traslochi e lavoro', 2,
   'Noleggio furgoni Trieste | LILO S.r.l.',
   'Noleggio furgoni a Trieste per traslochi e attività commerciali. Ducato, Transit, Daily e altri.');

-- Esempio veicolo con metadati SEO/IA completi
WITH cat AS (SELECT id FROM public.categorie WHERE slug = 'furgone')
INSERT INTO public.veicoli (
  categoria_id, targa, marca, modello, versione, colore, alimentazione,
  slug, pubblicato, titolo_pubblico, descrizione_breve, descrizione_completa,
  seo_title, seo_description, seo_keywords,
  ai_summary, ai_highlights, ai_faq, json_ld
)
SELECT
  cat.id,
  'DV344HD', 'Ford', 'Transit', '350M 2.2', 'Bianco', 'Diesel',
  'ford-transit-350m-dv344hd',
  true,
  'Ford Transit 350M — Noleggio furgone Trieste',
  'Furgone Ford Transit 350M diesel, ideale per traslochi e trasporto merci a Trieste e provincia.',
  'Il Ford Transit 350M è un furgone capiente e affidabile, perfetto per traslochi, consegne e lavori artigianali. Disponibile presso la sede LILO di Trieste.',
  'Noleggio Ford Transit 350M Trieste | LILO Autonoleggio',
  'Noleggia un Ford Transit 350M a Trieste. Furgone diesel, ampio vano di carico. Prenota online o chiama il 040 2471720.',
  ARRAY['noleggio furgone trieste', 'ford transit noleggio', 'autonoleggio furgoni'],
  'Furgone Ford Transit 350M 2.2 diesel disponibile a noleggio presso LILO S.r.l. a Trieste (Viale Campi Elisi). Adatto a traslochi e trasporto merci. Alimentazione diesel.',
  ARRAY['Diesel', 'Vano di carico ampio', 'Ideale traslochi', 'Ritiro a Trieste'],
  '[{"q":"Quale patente serve per il Ford Transit?","a":"Patente B per i modelli fino a 3,5 t di massa complessiva."},{"q":"Dove ritiro il furgone?","a":"Presso la sede LILO in Viale Campi Elisi 38/B, Trieste."}]'::jsonb,
  '{
    "@context": "https://schema.org",
    "@type": "Car",
    "name": "Ford Transit 350M",
    "brand": {"@type": "Brand", "name": "Ford"},
    "model": "Transit 350M",
    "vehicleConfiguration": "Furgone",
    "fuelType": "Diesel",
    "color": "Bianco",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "EUR",
      "seller": {"@type": "AutoRental", "name": "LILO S.r.l.", "address": "Trieste, Italia"}
    }
  }'::jsonb
FROM cat;

INSERT INTO public.prezzi (veicolo_id, tipo_tariffa, importo, descrizione)
SELECT id, 'giornaliero', 89.00, 'Tariffa giornaliera standard'
FROM public.veicoli WHERE slug = 'ford-transit-350m-dv344hd';
