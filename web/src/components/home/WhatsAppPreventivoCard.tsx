"use client";

import { FormEvent, useMemo, useState } from "react";
import { COMPANY } from "@/lib/constants";
import {
  buildPreventivoWhatsAppUrl,
  DESTINAZIONI_PREVENTIVO,
} from "@/lib/preventivo-fields";
import { isValidPhone } from "@/lib/preventivo-schema";
import { FLOTTA_CATEGORIE_NAV } from "@/lib/nav-config";

const VEICOLO_OPTIONS = [
  { value: "", label: "Da definire con LILO" },
  ...FLOTTA_CATEGORIE_NAV.map((c) => ({ value: c.slug, label: c.label })),
];

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

function todayIsoLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface WhatsAppPreventivoCardProps {
  /** Ancora scroll (es. #preventivo-whatsapp). Solo una istanza in pagina. */
  anchorId?: string;
  headingId?: string;
}

export function WhatsAppPreventivoCard({
  anchorId,
  headingId = "whatsapp-preventivo-heading",
}: WhatsAppPreventivoCardProps = {}) {
  const [telefono, setTelefono] = useState("");
  const [kmPrevisti, setKmPrevisti] = useState("");
  const [destinazione, setDestinazione] = useState<string>("trieste-citta");
  const [veicolo, setVeicolo] = useState("");
  const [dataRitiro, setDataRitiro] = useState("");
  const [dataRiconsegna, setDataRiconsegna] = useState("");
  const [error, setError] = useState("");
  const minDate = useMemo(() => todayIsoLocal(), []);

  const kmOk = useMemo(() => {
    const n = Number(kmPrevisti.replace(",", "."));
    return Number.isFinite(n) && n > 0;
  }, [kmPrevisti]);

  const canSubmit = useMemo(
    () => isValidPhone(telefono) && kmOk && destinazione.length > 0,
    [telefono, kmOk, destinazione],
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!isValidPhone(telefono)) {
      setError("Inserisci un numero di telefono valido.");
      return;
    }
    if (!kmOk) {
      setError("Indica i km totali previsti (numero maggiore di 0).");
      return;
    }
    if (dataRitiro && dataRitiro < minDate) {
      setError("La data di ritiro non può essere nel passato.");
      return;
    }
    if (dataRitiro && dataRiconsegna && dataRiconsegna < dataRitiro) {
      setError("La data di riconsegna deve essere successiva al ritiro.");
      return;
    }
    const veicoloLabel =
      VEICOLO_OPTIONS.find((v) => v.value === veicolo)?.label || "Da definire";
    const url = buildPreventivoWhatsAppUrl({
      telefonoCliente: telefono,
      kmPrevisti,
      destinazione,
      veicoloName: veicoloLabel,
      dataRitiro,
      dataRiconsegna,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <article
      id={anchorId}
      className="flex h-full scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 shadow-sm sm:col-span-2 lg:col-span-2"
      aria-labelledby={headingId}
    >
      <div className="border-b border-emerald-100 bg-emerald-600 px-5 py-4 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">
          Preventivo rapido
        </p>
        <h3 id={headingId} className="mt-1 text-xl font-bold tracking-tight">
          Richiedi su WhatsApp
        </h3>
        <p className="mt-1 text-sm text-emerald-50">
          Compila i campi (km e destinazione sono obbligatori): ti apriamo una chat con il messaggio
          già pronto per {COMPANY.name} ({COMPANY.phone}).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium text-slate-700">Numero di telefono *</span>
            <input
              type="tel"
              name="telefono"
              autoComplete="tel"
              required
              placeholder="Es. 333 1234567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">
              Km totali da percorrere *
            </span>
            <input
              type="number"
              name="km_previsti"
              required
              min={1}
              step={1}
              inputMode="numeric"
              placeholder="Es. 80"
              value={kmPrevisti}
              onChange={(e) => setKmPrevisti(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Destinazione *</span>
            <select
              name="destinazione"
              required
              value={destinazione}
              onChange={(e) => setDestinazione(e.target.value)}
              className={inputClass}
            >
              {DESTINAZIONI_PREVENTIVO.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium text-slate-700">Modello / categoria</span>
            <select
              name="veicolo"
              value={veicolo}
              onChange={(e) => setVeicolo(e.target.value)}
              className={inputClass}
            >
              {VEICOLO_OPTIONS.map((v) => (
                <option key={v.value || "da-definire"} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Data ritiro</span>
            <input
              type="date"
              name="data_ritiro"
              value={dataRitiro}
              min={minDate}
              onChange={(e) => setDataRitiro(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Data riconsegna</span>
            <input
              type="date"
              name="data_riconsegna"
              value={dataRiconsegna}
              min={dataRitiro || minDate}
              onChange={(e) => setDataRiconsegna(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <aside
          className="rounded-xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
          role="note"
          aria-label="Info sul noleggio"
        >
          <p className="font-semibold text-amber-900">Info sul noleggio</p>
          <p className="mt-1.5">
            La giornata contrattuale decorre dalle ore <strong>08:30</strong> alle ore{" "}
            <strong>08:30</strong> del giorno successivo. Le tariffe giornaliere si intendono per
            24h con questo orario.
          </p>
          <p className="mt-2">
            <strong>Sabato e domenica</strong> sono esclusi dalla fascia standard 08:30/08:30
            (gestiti con orari e condizioni dedicate — ti confermiamo in chat).
          </p>
        </aside>

        {error && (
          <p className="text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Richiedi Preventivo su WhatsApp
        </button>
      </form>
    </article>
  );
}
