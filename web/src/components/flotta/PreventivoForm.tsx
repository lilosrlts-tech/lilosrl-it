"use client";

import { FormEvent, useMemo, useState } from "react";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { formatAccessorioPrezzo } from "@/lib/accessori";
import {
  buildPreventivoWhatsAppUrl,
  DESTINAZIONI_PREVENTIVO,
} from "@/lib/preventivo-fields";
import { isValidPhone } from "@/lib/preventivo-schema";
import { labelPromoDurataSecondario } from "@/lib/promozioni-durata";
import {
  getPrezzoCommercialNote,
  getPrezzoGiornaliero,
  getVeicoloFormTitle,
} from "@/lib/veicolo-utils";
import {
  getNotaCauzione,
  getTariffaPerVeicolo,
  PREZZO_IVA_DICITURA,
} from "@/lib/tariffe-categoria";
import { NAP_PHONE_DISPLAY } from "@/lib/nap";
import type { AccessorioPubblico, VeicoloPubblico } from "@/types/veicolo";

type Channel = "email" | "whatsapp";

interface PreventivoFormProps {
  veicolo: VeicoloPubblico;
  telefono?: string;
}

function todayIsoLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function PreventivoForm({ veicolo, telefono = NAP_PHONE_DISPLAY }: PreventivoFormProps) {
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [kmPrevisti, setKmPrevisti] = useState("");
  const [destinazione, setDestinazione] = useState("trieste-citta");
  const [dataRitiro, setDataRitiro] = useState("");
  const [accessoriAperti, setAccessoriAperti] = useState(false);
  const minDate = useMemo(() => todayIsoLocal(), []);

  const accessori = useMemo(
    () => (veicolo.accessori ?? []).filter((a) => a.quantita_max > 0),
    [veicolo.accessori],
  );

  const veicoloName = getVeicoloFormTitle(veicolo);
  const prezzo = getPrezzoGiornaliero(veicolo);
  const notaKm = getPrezzoCommercialNote(veicolo);
  const tariffa = getTariffaPerVeicolo(veicolo);
  const notaCauzione = tariffa ? getNotaCauzione(tariffa) : null;
  const promoLine = veicolo.prezzo_promo
    ? labelPromoDurataSecondario(veicolo.prezzo_promo)
    : null;

  function selectedAccessori(list: AccessorioPubblico[]) {
    return list
      .map((a) => ({
        id: a.id,
        nome: a.nome,
        quantita: qty[a.id] ?? 0,
        prezzo_giornaliero: a.prezzo_giornaliero,
      }))
      .filter((a) => a.quantita > 0);
  }

  const accessoriSelezionati = useMemo(
    () => selectedAccessori(accessori),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- qty drives selection
    [accessori, qty],
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const nome = String(formData.get("nome") ?? "");
    const email = String(formData.get("email") ?? "");
    const tel = String(formData.get("telefono") ?? "");
    const ritiro = String(formData.get("data_ritiro") ?? "");
    const riconsegna = String(formData.get("data_riconsegna") ?? "");
    const messaggio = String(formData.get("messaggio") ?? "");
    const km = Number(String(kmPrevisti).replace(",", "."));

    if (!Number.isFinite(km) || km <= 0) {
      setError("Indica i km totali previsti (numero maggiore di 0).");
      setLoading(false);
      return;
    }
    if (!isValidPhone(tel)) {
      setError("Inserisci un numero di telefono valido (min. 8 cifre).");
      setLoading(false);
      return;
    }
    if (ritiro && ritiro < minDate) {
      setError("La data di ritiro non può essere nel passato.");
      setLoading(false);
      return;
    }
    if (ritiro && riconsegna && riconsegna < ritiro) {
      setError("La data di riconsegna deve essere successiva al ritiro.");
      setLoading(false);
      return;
    }

    if (channel === "whatsapp") {
      const accessoriLine =
        accessoriSelezionati.length > 0
          ? accessoriSelezionati.map((a) => `${a.nome} ×${a.quantita}`).join(", ")
          : undefined;
      const url = buildPreventivoWhatsAppUrl({
        telefonoCliente: tel,
        kmPrevisti: km,
        destinazione,
        veicoloName,
        dataRitiro: ritiro,
        dataRiconsegna: riconsegna,
        nome,
        accessoriLine,
        note: messaggio || undefined,
      });
      window.open(url, "_blank", "noopener,noreferrer");
      const { trackPreventivoConversion } = await import("@/lib/analytics");
      trackPreventivoConversion({ veicoloId: veicolo.id, veicoloName });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/preventivo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          veicolo_id: veicolo.id,
          veicolo_slug: veicolo.slug,
          veicolo_name: veicoloName,
          nome,
          email,
          telefono: tel,
          km_previsti: km,
          destinazione,
          data_ritiro: ritiro,
          data_riconsegna: riconsegna,
          messaggio: messaggio || null,
          website: formData.get("website"),
          accessori: selectedAccessori(accessori),
        }),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error ?? "Invio non riuscito");
      }

      setSuccess(true);
      setSuccessMessage(
        body.data?.message ||
          (body.data?.mailSent
            ? "Richiesta inviata! Controlla la tua email."
            : "Richiesta salvata. Email non inviata: verifica dominio Resend."),
      );
      form.reset();
      setQty({});
      setKmPrevisti("");
      setDestinazione("trieste-citta");
      setDataRitiro("");

      const { trackPreventivoConversion } = await import("@/lib/analytics");
      trackPreventivoConversion({ veicoloId: veicolo.id, veicoloName });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante l'invio");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

  return (
    <aside
      id="preventivo"
      className="relative flex max-h-none flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-lg shadow-brand-100/50 ring-1 ring-brand-100 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)]"
      aria-labelledby="preventivo-heading"
    >
      <div className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6">
        <h2 id="preventivo-heading" className="text-lg font-semibold text-slate-900">
          Richiedi preventivo
        </h2>
        <p className="mt-1 text-sm text-slate-500">{veicoloName}</p>

        <div className="mt-4">
          {prezzo && (
            <>
              <p className="text-2xl font-bold text-brand-700">
                €{Math.round(veicolo.prezzo_promo?.giornaliero ?? prezzo.importo)}
                <span className="text-sm font-medium text-slate-500"> / giorno</span>
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {PREZZO_IVA_DICITURA}
              </p>
            </>
          )}
          {promoLine && <p className="mt-1 text-xs text-emerald-700">{promoLine}</p>}
          {notaKm && <p className="mt-1 text-xs text-slate-500">{notaKm}</p>}
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
            <span className="tracking-wide text-amber-500" aria-hidden="true">
              ★★★★★
            </span>
            <span>Recensioni Google</span>
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span>20+ anni a Trieste</span>
          </p>
          {notaCauzione && (
            <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
              {notaCauzione}
            </p>
          )}
        </div>
      </div>

      {success ? (
        <div className="px-6 py-4">
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {successMessage || "Richiesta inviata! Ti contatteremo al più presto."}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-6 py-4 [scrollbar-gutter:stable]">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div
              className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1"
              role="tablist"
              aria-label="Canale di richiesta"
            >
              <button
                type="button"
                role="tab"
                aria-selected={channel === "whatsapp"}
                onClick={() => setChannel("whatsapp")}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  channel === "whatsapp"
                    ? "bg-[#25D366] text-white shadow-sm"
                    : "bg-[#25D366]/15 text-[#128C7E] hover:bg-[#25D366]/25"
                }`}
              >
                WhatsApp
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={channel === "email"}
                onClick={() => setChannel("email")}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  channel === "email"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Email
              </button>
            </div>

            <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
              <label>
                Sito web
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">Nome e cognome *</span>
              <input name="nome" required className={inputClass} autoComplete="name" />
            </label>

            {channel === "email" && (
              <label className="block space-y-1">
                <span className="text-sm font-medium text-slate-700">Email *</span>
                <input
                  name="email"
                  type="email"
                  required
                  className={inputClass}
                  autoComplete="email"
                />
              </label>
            )}

            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">Telefono *</span>
              <input name="telefono" type="tel" required className={inputClass} autoComplete="tel" />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm font-medium text-slate-700">Km totali *</span>
                <input
                  name="km_previsti"
                  type="number"
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
              <label className="block space-y-1">
                <span className="text-sm font-medium text-slate-700">Destinazione *</span>
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
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm font-medium text-slate-700">Ritiro *</span>
                <input
                  name="data_ritiro"
                  type="date"
                  required
                  min={minDate}
                  className={inputClass}
                  value={dataRitiro}
                  onChange={(e) => setDataRitiro(e.target.value)}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium text-slate-700">Riconsegna *</span>
                <input
                  name="data_riconsegna"
                  type="date"
                  required
                  min={dataRitiro || minDate}
                  className={inputClass}
                />
              </label>
            </div>

            {accessori.length > 0 && (
              <div className="border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setAccessoriAperti((v) => !v)}
                  className="flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-slate-800"
                  aria-expanded={accessoriAperti}
                >
                  <span>
                    Opzioni noleggio
                    {!accessoriAperti && accessoriSelezionati.length > 0
                      ? ` (${accessoriSelezionati.length})`
                      : ""}
                  </span>
                  <span className="text-slate-400" aria-hidden="true">
                    {accessoriAperti ? "−" : "+"}
                  </span>
                </button>
                {accessoriAperti && (
                  <ul className="mt-2 divide-y divide-slate-100">
                    {accessori.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center justify-between gap-3 py-2.5 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-medium leading-snug text-slate-900">{a.nome}</p>
                          <p className="text-xs text-slate-500">
                            {formatAccessorioPrezzo(a.prezzo_giornaliero)}/gg
                          </p>
                        </div>
                        <label className="flex shrink-0 items-center gap-1.5 text-xs text-slate-600">
                          <span className="sr-only">Quantità {a.nome}</span>
                          <select
                            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                            value={qty[a.id] ?? 0}
                            onChange={(e) =>
                              setQty((prev) => ({
                                ...prev,
                                [a.id]: Number(e.target.value),
                              }))
                            }
                            aria-label={`Quantità ${a.nome}`}
                          >
                            {Array.from({ length: a.quantita_max + 1 }, (_, n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">Note (opzionale)</span>
              <textarea
                name="messaggio"
                rows={2}
                className={`${inputClass} resize-none`}
                placeholder="Esigenze particolari…"
              />
            </label>

            <aside
              className="rounded-xl border border-amber-300/80 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-950"
              role="note"
            >
              <p className="font-semibold text-amber-900">Info sul noleggio</p>
              <p className="mt-1">
                Giornata contrattuale dalle <strong>08:30</strong> alle <strong>08:30</strong> del
                giorno successivo. Sabato e domenica esclusi dalla fascia standard (condizioni
                dedicate).
              </p>
            </aside>
          </div>

          <div className="shrink-0 border-t border-slate-100 bg-white px-6 py-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-sm transition disabled:opacity-60 ${
                channel === "whatsapp"
                  ? "bg-[#25D366] hover:brightness-105"
                  : "bg-brand-600 hover:bg-brand-700"
              }`}
            >
              {loading
                ? "Attendere…"
                : channel === "whatsapp"
                  ? "Richiedi su WhatsApp"
                  : "Invia richiesta email"}
            </button>

            <p className="mt-2 text-center text-xs leading-relaxed text-slate-500">
              Preventivo gratuito e senza impegno.
              {channel === "whatsapp"
                ? " Risposta rapida su WhatsApp in orario di apertura."
                : " Ti rispondiamo via email al più presto."}
            </p>

            <p className="mt-3 text-center text-sm text-slate-500">
              Oppure chiama{" "}
              <PhoneLink phone={telefono} className="font-semibold text-brand-600 hover:underline">
                {telefono}
              </PhoneLink>
            </p>
          </div>
        </form>
      )}

      {success && (
        <p className="px-6 pb-6 text-center text-sm text-slate-500">
          Oppure chiama{" "}
          <PhoneLink phone={telefono} className="font-semibold text-brand-600 hover:underline">
            {telefono}
          </PhoneLink>
        </p>
      )}
    </aside>
  );
}
