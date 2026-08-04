"use client";

import { useEffect, useState } from "react";
import type { Accessorio, Categoria, VeicoloDettaglio } from "@/types/database";

export interface AiFaqFormItem {
  q: string;
  a: string;
}

export interface VeicoloPhotoFiles {
  copertina: File | null;
  secondaria: File | null;
}

export interface VeicoloFormValues {
  categoria_id: string;
  targa: string;
  marca: string;
  modello: string;
  versione: string;
  colore: string;
  alimentazione: string;
  titolo_pubblico: string;
  descrizione_breve: string;
  descrizione_completa: string;
  prezzo_giornaliero: string;
  volume_metri_cubi: string;
  portata_utile_kg: string;
  lunghezza_vano_mm: string;
  larghezza_vano_mm: string;
  altezza_vano_mm: string;
  capacita_bagagliaio_valigie: string;
  classe_ambientale: string;
  connessione_smartphone: string;
  configurazione_sedili: string;
  climatizzazione_posteriore: boolean;
  portata_kg: string;
  volume_carico_mc: string;
  trazione: string;
  passo: string;
  tetto: string;
  sensori_parcheggio: boolean;
  lunghezza_mm: string;
  larghezza_mm: string;
  altezza_mm: string;
  vano_lunghezza_mm: string;
  vano_larghezza_mm: string;
  vano_altezza_mm: string;
  larghezza_tra_passaruota_mm: string;
  ai_summary: string;
  ai_highlights: string;
  ai_faq: AiFaqFormItem[];
  pubblicato: boolean;
  attivo: boolean;
  unita_disponibili: string;
  accessori_ids: string[];
  promo_durata_attiva: boolean;
}

const EMPTY_AI_FAQ: AiFaqFormItem[] = [
  { q: "", a: "" },
  { q: "", a: "" },
  { q: "", a: "" },
];

const emptyValues: VeicoloFormValues = {
  categoria_id: "",
  targa: "",
  marca: "",
  modello: "",
  versione: "",
  colore: "",
  alimentazione: "",
  titolo_pubblico: "",
  descrizione_breve: "",
  descrizione_completa: "",
  prezzo_giornaliero: "",
  volume_metri_cubi: "",
  portata_utile_kg: "",
  lunghezza_vano_mm: "",
  larghezza_vano_mm: "",
  altezza_vano_mm: "",
  capacita_bagagliaio_valigie: "",
  classe_ambientale: "",
  connessione_smartphone: "",
  configurazione_sedili: "",
  climatizzazione_posteriore: false,
  portata_kg: "",
  volume_carico_mc: "",
  trazione: "",
  passo: "",
  tetto: "",
  sensori_parcheggio: false,
  lunghezza_mm: "",
  larghezza_mm: "",
  altezza_mm: "",
  vano_lunghezza_mm: "",
  vano_larghezza_mm: "",
  vano_altezza_mm: "",
  larghezza_tra_passaruota_mm: "",
  ai_summary: "",
  ai_highlights: "",
  ai_faq: EMPTY_AI_FAQ.map((item) => ({ ...item })),
  pubblicato: false,
  attivo: true,
  unita_disponibili: "1",
  accessori_ids: [],
  promo_durata_attiva: true,
};

function veicoloToForm(veicolo: VeicoloDettaglio): VeicoloFormValues {
  const prezzo = veicolo.prezzi?.find((p) => p.tipo_tariffa === "giornaliero" && p.attivo);
  return {
    categoria_id: veicolo.categoria_id,
    targa: veicolo.targa,
    marca: veicolo.marca,
    modello: veicolo.modello,
    versione: veicolo.versione ?? "",
    colore: veicolo.colore ?? "",
    alimentazione: veicolo.alimentazione ?? "",
    titolo_pubblico: veicolo.titolo_pubblico ?? "",
    descrizione_breve: veicolo.descrizione_breve ?? "",
    descrizione_completa: veicolo.descrizione_completa ?? "",
    prezzo_giornaliero: prezzo ? String(prezzo.importo) : "",
    volume_metri_cubi:
      veicolo.volume_metri_cubi != null
        ? String(veicolo.volume_metri_cubi)
        : veicolo.volume_carico_mc != null
          ? String(veicolo.volume_carico_mc)
          : "",
    portata_utile_kg:
      veicolo.portata_utile_kg != null
        ? String(veicolo.portata_utile_kg)
        : veicolo.portata_kg != null
          ? String(veicolo.portata_kg)
          : "",
    lunghezza_vano_mm:
      veicolo.lunghezza_vano_mm != null
        ? String(veicolo.lunghezza_vano_mm)
        : veicolo.vano_lunghezza_mm != null
          ? String(veicolo.vano_lunghezza_mm)
          : "",
    larghezza_vano_mm:
      veicolo.larghezza_vano_mm != null
        ? String(veicolo.larghezza_vano_mm)
        : veicolo.vano_larghezza_mm != null
          ? String(veicolo.vano_larghezza_mm)
          : "",
    altezza_vano_mm:
      veicolo.altezza_vano_mm != null
        ? String(veicolo.altezza_vano_mm)
        : veicolo.vano_altezza_mm != null
          ? String(veicolo.vano_altezza_mm)
          : "",
    capacita_bagagliaio_valigie:
      veicolo.capacita_bagagliaio_valigie != null
        ? String(veicolo.capacita_bagagliaio_valigie)
        : "",
    classe_ambientale: veicolo.classe_ambientale ?? "",
    connessione_smartphone: veicolo.connessione_smartphone ?? "",
    configurazione_sedili: veicolo.configurazione_sedili ?? "",
    climatizzazione_posteriore: veicolo.climatizzazione_posteriore ?? false,
    portata_kg: veicolo.portata_kg != null ? String(veicolo.portata_kg) : "",
    volume_carico_mc:
      veicolo.volume_carico_mc != null ? String(veicolo.volume_carico_mc) : "",
    trazione: veicolo.trazione ?? "",
    passo: veicolo.passo ?? "",
    tetto: veicolo.tetto ?? "",
    sensori_parcheggio: veicolo.sensori_parcheggio ?? false,
    lunghezza_mm: veicolo.lunghezza_mm != null ? String(veicolo.lunghezza_mm) : "",
    larghezza_mm: veicolo.larghezza_mm != null ? String(veicolo.larghezza_mm) : "",
    altezza_mm: veicolo.altezza_mm != null ? String(veicolo.altezza_mm) : "",
    vano_lunghezza_mm:
      veicolo.vano_lunghezza_mm != null ? String(veicolo.vano_lunghezza_mm) : "",
    vano_larghezza_mm:
      veicolo.vano_larghezza_mm != null ? String(veicolo.vano_larghezza_mm) : "",
    vano_altezza_mm: veicolo.vano_altezza_mm != null ? String(veicolo.vano_altezza_mm) : "",
    larghezza_tra_passaruota_mm:
      veicolo.larghezza_tra_passaruota_mm != null
        ? String(veicolo.larghezza_tra_passaruota_mm)
        : "",
    ai_summary: veicolo.ai_summary ?? "",
    ai_highlights: Array.isArray(veicolo.ai_highlights)
      ? veicolo.ai_highlights.join("\n")
      : "",
    ai_faq: [0, 1, 2].map((index) => {
      const faq = Array.isArray(veicolo.ai_faq) ? veicolo.ai_faq : [];
      return {
        q: faq[index]?.q ?? "",
        a: faq[index]?.a ?? "",
      };
    }),
    pubblicato: veicolo.pubblicato,
    attivo: veicolo.attivo,
    unita_disponibili: String(veicolo.unita_disponibili ?? 1),
    accessori_ids: veicolo.accessori_ids ?? [],
    promo_durata_attiva: veicolo.promo_durata_attiva !== false,
  };
}

interface VeicoloFormProps {
  categorie: Categoria[];
  accessoriCatalog?: Accessorio[];
  initialVeicolo?: VeicoloDettaglio | null;
  loading?: boolean;
  onSubmit: (values: VeicoloFormValues, photos: VeicoloPhotoFiles) => Promise<void>;
  onCancel?: () => void;
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

function categoryKind(slug: string | undefined): "furgone" | "auto" | "pulmino" | "altro" {
  if (!slug) return "altro";
  if (slug === "auto") return "auto";
  if (slug.includes("pulmin")) return "pulmino";
  if (slug.includes("furgon")) return "furgone";
  return "altro";
}

export function VeicoloForm({
  categorie,
  accessoriCatalog = [],
  initialVeicolo,
  loading,
  onSubmit,
  onCancel,
}: VeicoloFormProps) {
  const isEdit = Boolean(initialVeicolo);
  const [values, setValues] = useState<VeicoloFormValues>(emptyValues);
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoSecondaria, setFotoSecondaria] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoSecondariaPreview, setFotoSecondariaPreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialVeicolo) {
      setValues(veicoloToForm(initialVeicolo));
      const cover = initialVeicolo.foto?.find((f) => f.is_copertina);
      const secondaria =
        initialVeicolo.foto
          ?.filter((f) => !f.is_copertina)
          .sort((a, b) => a.ordine - b.ordine)[0] ?? null;
      setFotoPreview(cover?.url_pubblico ?? null);
      setFotoSecondariaPreview(secondaria?.url_pubblico ?? null);
    } else {
      setValues(emptyValues);
      setFotoPreview(null);
      setFotoSecondariaPreview(null);
    }
    setFoto(null);
    setFotoSecondaria(null);
  }, [initialVeicolo]);

  function update<K extends keyof VeicoloFormValues>(key: K, value: VeicoloFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleFotoChange(file: File | null) {
    setFoto(file);
    if (file) {
      setFotoPreview(URL.createObjectURL(file));
    }
  }

  function handleFotoSecondariaChange(file: File | null) {
    setFotoSecondaria(file);
    if (file) {
      setFotoSecondariaPreview(URL.createObjectURL(file));
    }
  }

  function updateFaq(index: number, field: keyof AiFaqFormItem, value: string) {
    setValues((prev) => ({
      ...prev,
      ai_faq: prev.ai_faq.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(values, { copertina: foto, secondaria: fotoSecondaria });
  }

  const selectedCategory = categorie.find((c) => c.id === values.categoria_id);
  const kind = categoryKind(selectedCategory?.slug);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Categoria" required>
          <select
            className={inputClass}
            value={values.categoria_id}
            onChange={(e) => update("categoria_id", e.target.value)}
            required
          >
            <option value="">Seleziona categoria</option>
            {categorie.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Targa" required>
          <input
            className={inputClass}
            value={values.targa}
            onChange={(e) => update("targa", e.target.value.toUpperCase())}
            required
          />
        </Field>

        <Field label="Marca" required>
          <input
            className={inputClass}
            value={values.marca}
            onChange={(e) => update("marca", e.target.value)}
            required
          />
        </Field>

        <Field label="Modello" required>
          <input
            className={inputClass}
            value={values.modello}
            onChange={(e) => update("modello", e.target.value)}
            required
          />
        </Field>

        <Field label="Versione">
          <input
            className={inputClass}
            value={values.versione}
            onChange={(e) => update("versione", e.target.value)}
          />
        </Field>

        <Field label="Colore">
          <input
            className={inputClass}
            value={values.colore}
            onChange={(e) => update("colore", e.target.value)}
          />
        </Field>

        <Field label="Alimentazione">
          <select
            className={inputClass}
            value={values.alimentazione}
            onChange={(e) => update("alimentazione", e.target.value)}
          >
            <option value="">—</option>
            <option value="Benzina">Benzina</option>
            <option value="Diesel">Diesel</option>
            <option value="Elettrico">Elettrico</option>
            <option value="Ibrido">Ibrido</option>
            <option value="GPL">GPL</option>
          </select>
        </Field>

        <Field label="Prezzo giornaliero (€)" required>
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            value={values.prezzo_giornaliero}
            onChange={(e) => update("prezzo_giornaliero", e.target.value)}
            required
          />
        </Field>
      </div>

      <Field label="Titolo pubblico">
        <input
          className={inputClass}
          value={values.titolo_pubblico}
          onChange={(e) => update("titolo_pubblico", e.target.value)}
          placeholder="es. Ford Transit 350M — Noleggio furgone Trieste"
        />
      </Field>

      <Field label="Descrizione breve">
        <textarea
          className={`${inputClass} min-h-[80px]`}
          value={values.descrizione_breve}
          onChange={(e) => update("descrizione_breve", e.target.value)}
          maxLength={200}
        />
      </Field>

      <Field label="Descrizione completa">
        <textarea
          className={`${inputClass} min-h-[120px]`}
          value={values.descrizione_completa}
          onChange={(e) => update("descrizione_completa", e.target.value)}
        />
      </Field>

      <fieldset className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-800">
          {kind === "furgone" && "Specifiche furgone (carico e vano)"}
          {kind === "auto" && "Specifiche auto (comfort e omologazione)"}
          {kind === "pulmino" && "Specifiche pulmino 9 posti"}
          {kind === "altro" && "Specifiche tecniche"}
        </legend>
        <p className="text-xs text-slate-500">
          I campi mostrati dipendono dalla categoria selezionata e compaiono nella scheda pubblica.
        </p>

        {kind === "furgone" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <Field label="Volume di carico (m³)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={values.volume_metri_cubi}
                  onChange={(e) => update("volume_metri_cubi", e.target.value)}
                />
              </Field>
              <Field label="Portata utile (kg)">
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={inputClass}
                  value={values.portata_utile_kg}
                  onChange={(e) => update("portata_utile_kg", e.target.value)}
                />
              </Field>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Dimensioni vano di carico (mm)
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Lunghezza vano (mm)">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={inputClass}
                    value={values.lunghezza_vano_mm}
                    onChange={(e) => update("lunghezza_vano_mm", e.target.value)}
                    placeholder="es. 2537"
                  />
                </Field>
                <Field label="Larghezza vano (mm)">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={inputClass}
                    value={values.larghezza_vano_mm}
                    onChange={(e) => update("larghezza_vano_mm", e.target.value)}
                    placeholder="es. 1662"
                  />
                </Field>
                <Field label="Altezza vano (mm)">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={inputClass}
                    value={values.altezza_vano_mm}
                    onChange={(e) => update("altezza_vano_mm", e.target.value)}
                    placeholder="es. 1387"
                  />
                </Field>
                <Field label="Larghezza tra i passaruota (mm)">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={inputClass}
                    value={values.larghezza_tra_passaruota_mm}
                    onChange={(e) => update("larghezza_tra_passaruota_mm", e.target.value)}
                    placeholder="es. 1250"
                  />
                </Field>
              </div>
            </div>
          </>
        )}

        {kind === "auto" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Bagagliaio (n° valigie)">
              <input
                type="number"
                min="0"
                max="20"
                className={inputClass}
                value={values.capacita_bagagliaio_valigie}
                onChange={(e) => update("capacita_bagagliaio_valigie", e.target.value)}
              />
            </Field>
            <Field label="Classe ambientale">
              <input
                className={inputClass}
                value={values.classe_ambientale}
                onChange={(e) => update("classe_ambientale", e.target.value)}
                placeholder="es. Euro 6d"
              />
            </Field>
            <Field label="Connessione smartphone">
              <input
                className={inputClass}
                value={values.connessione_smartphone}
                onChange={(e) => update("connessione_smartphone", e.target.value)}
                placeholder="es. Apple CarPlay, Android Auto"
              />
            </Field>
          </div>
        )}

        {kind === "pulmino" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Configurazione sedili">
              <input
                className={inputClass}
                value={values.configurazione_sedili}
                onChange={(e) => update("configurazione_sedili", e.target.value)}
                placeholder="es. 3+3+3"
              />
            </Field>
            <label className="flex items-end gap-2 pb-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={values.climatizzazione_posteriore}
                onChange={(e) => update("climatizzazione_posteriore", e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Climatizzazione posteriore
            </label>
          </div>
        )}

        {kind === "furgone" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Trazione">
                <select
                  className={inputClass}
                  value={values.trazione}
                  onChange={(e) => update("trazione", e.target.value)}
                >
                  <option value="">—</option>
                  <option value="Anteriore">Anteriore</option>
                  <option value="Posteriore">Posteriore</option>
                  <option value="Integrale">Integrale</option>
                </select>
              </Field>
              <Field label="Passo">
                <select
                  className={inputClass}
                  value={values.passo}
                  onChange={(e) => update("passo", e.target.value)}
                >
                  <option value="">—</option>
                  <option value="Corto">Corto</option>
                  <option value="Medio">Medio</option>
                  <option value="Lungo">Lungo</option>
                </select>
              </Field>
              <Field label="Tetto">
                <select
                  className={inputClass}
                  value={values.tetto}
                  onChange={(e) => update("tetto", e.target.value)}
                >
                  <option value="">—</option>
                  <option value="Basso">Basso</option>
                  <option value="Medio">Medio</option>
                  <option value="Alto">Alto</option>
                </select>
              </Field>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Dimensioni esterne (mm)
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Lunghezza">
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={values.lunghezza_mm}
                    onChange={(e) => update("lunghezza_mm", e.target.value)}
                  />
                </Field>
                <Field label="Larghezza">
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={values.larghezza_mm}
                    onChange={(e) => update("larghezza_mm", e.target.value)}
                  />
                </Field>
                <Field label="Altezza">
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={values.altezza_mm}
                    onChange={(e) => update("altezza_mm", e.target.value)}
                  />
                </Field>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={values.sensori_parcheggio}
                onChange={(e) => update("sensori_parcheggio", e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Sensori parcheggio
            </label>
          </>
        )}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Foto copertina (3/4 frontale)">
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700"
            onChange={(e) => handleFotoChange(e.target.files?.[0] ?? null)}
          />
        </Field>

        {fotoPreview && (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fotoPreview}
              alt="Anteprima copertina"
              className="h-32 w-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Foto secondaria (Galleria / Retro)">
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700"
            onChange={(e) => handleFotoSecondariaChange(e.target.files?.[0] ?? null)}
          />
        </Field>

        {fotoSecondariaPreview && (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fotoSecondariaPreview}
              alt="Anteprima foto secondaria"
              className="h-32 w-full object-cover"
            />
          </div>
        )}
      </div>

      <fieldset className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-800">
          Ottimizzazione Google AI &amp; FAQ
        </legend>
        <p className="text-xs text-slate-500">
          Contenuti strutturati per motori di ricerca e assistenti IA. Appaiono nella scheda
          pubblica del veicolo.
        </p>

        <Field label="In sintesi (ai_summary)">
          <textarea
            className={`${inputClass} min-h-[100px]`}
            value={values.ai_summary}
            onChange={(e) => update("ai_summary", e.target.value)}
            placeholder="Sintesi neutra e fattuale del veicolo per Google AI e assistenti (~300 caratteri)"
            maxLength={500}
          />
        </Field>

        <Field label="Highlight principali (ai_highlights)">
          <textarea
            className={`${inputClass} min-h-[80px]`}
            value={values.ai_highlights}
            onChange={(e) => update("ai_highlights", e.target.value)}
            placeholder={"Un highlight per riga\nes. 5,3 m³\nDiesel\nPortata 1.081 kg"}
          />
        </Field>

        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-700">
            FAQ veicolo (max 3) — salvate in JSONB <code className="text-xs">ai_faq</code>
          </p>
          {values.ai_faq.map((item, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-2"
            >
              <Field label={`Domanda ${index + 1}`}>
                <input
                  className={inputClass}
                  value={item.q}
                  onChange={(e) => updateFaq(index, "q", e.target.value)}
                  placeholder="es. Quale cauzione è richiesta?"
                />
              </Field>
              <Field label={`Risposta ${index + 1}`}>
                <textarea
                  className={`${inputClass} min-h-[72px]`}
                  value={item.a}
                  onChange={(e) => updateFaq(index, "a", e.target.value)}
                  placeholder="Risposta breve e precisa"
                />
              </Field>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-900">
          Accessori disponibili su questo veicolo
        </legend>
        <p className="text-xs text-slate-500">
          Extra visibili in scheda e nel preventivo. Prezzi in Admin → Accessori.
        </p>
        {accessoriCatalog.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nessun accessorio. Creane in{" "}
            <a href="/admin/accessori" className="text-brand-600 underline">
              Accessori
            </a>
            .
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {accessoriCatalog
              .filter((a) => a.attivo || values.accessori_ids.includes(a.id))
              .map((a) => {
                const checked = values.accessori_ids.includes(a.id);
                return (
                  <li key={a.id}>
                    <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        checked={checked}
                        onChange={() => {
                          const next = checked
                            ? values.accessori_ids.filter((id) => id !== a.id)
                            : [...values.accessori_ids, a.id];
                          update("accessori_ids", next);
                        }}
                      />
                      <span>
                        <span className="font-medium text-slate-900">{a.nome}</span>
                        <span className="block text-xs text-slate-500">
                          €{Number(a.prezzo_giornaliero).toFixed(2)}/gg
                          {!a.attivo ? " · disattivo" : ""}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
          </ul>
        )}
      </fieldset>

      <div className="flex flex-wrap items-end gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={values.pubblicato}
            onChange={(e) => update("pubblicato", e.target.checked)}
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          Pubblicato sul sito
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={values.attivo}
            onChange={(e) => update("attivo", e.target.checked)}
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          Disponibile in flotta
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-700">
          <span className="font-medium">Unità disponibili (senza targhe)</span>
          <input
            type="number"
            min={1}
            max={99}
            value={values.unita_disponibili}
            onChange={(e) => update("unita_disponibili", e.target.value)}
            className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={values.promo_durata_attiva}
            onChange={(e) => update("promo_durata_attiva", e.target.checked)}
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          Promo durata attive (7=6, mese −30%, …)
        </label>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Salvataggio..." : isEdit ? "Salva modifiche" : "Aggiungi veicolo"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Annulla
          </button>
        )}
      </div>
    </form>
  );
}
