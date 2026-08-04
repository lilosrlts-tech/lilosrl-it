"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Alert } from "@/components/Alert";
import { Toast } from "@/components/Toast";
import { apiGet, apiPatch } from "@/lib/api-client";
import type { ImpostazioniSito } from "@/types/impostazioni";

type EditableField = Exclude<keyof ImpostazioniSito, "id" | "created_at" | "updated_at">;

interface FieldGroup {
  title: string;
  description?: string;
  fields: { key: EditableField; label: string; rows?: number; placeholder?: string }[];
}

const FIELD_GROUPS: FieldGroup[] = [
  {
    title: "Home page",
    description: "Testo principale mostrato nel banner della home.",
    fields: [
      {
        key: "testo_hero_home",
        label: "Testo hero home",
        rows: 4,
        placeholder: "Descrizione breve del servizio di noleggio...",
      },
    ],
  },
  {
    title: "Sede noleggio",
    fields: [
      { key: "indirizzo_noleggio", label: "Indirizzo", rows: 2 },
      { key: "telefono_noleggio", label: "Telefono" },
      {
        key: "orari_noleggio",
        label: "Orari (una riga per ogni fascia)",
        rows: 4,
        placeholder: "Lunedì – Venerdì: 8:30 – 18:00",
      },
    ],
  },
  {
    title: "Autolavaggio",
    fields: [
      { key: "indirizzo_autolavaggio", label: "Indirizzo (ingresso/uscita)", rows: 2 },
      { key: "telefono_autolavaggio", label: "Telefono autolavaggio" },
      { key: "orari_autolavaggio", label: "Orari autolavaggio", rows: 4 },
      {
        key: "descrizione_autolavaggio",
        label: "Descrizione pagina autolavaggio",
        rows: 5,
      },
    ],
  },
  {
    title: "Contatti generali",
    fields: [{ key: "email_contatto", label: "Email", placeholder: "info@lilosrl.it" }],
  },
];

export function ImpostazioniSitoForm() {
  const [data, setData] = useState<ImpostazioniSito | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    apiGet<ImpostazioniSito>("/api/impostazioni-sito")
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Errore caricamento"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setError("");
    try {
      const updated = await apiPatch<ImpostazioniSito>("/api/impostazioni-sito", {
        orari_noleggio: data.orari_noleggio,
        orari_autolavaggio: data.orari_autolavaggio,
        telefono_noleggio: data.telefono_noleggio,
        telefono_autolavaggio: data.telefono_autolavaggio,
        email_contatto: data.email_contatto,
        indirizzo_noleggio: data.indirizzo_noleggio,
        indirizzo_autolavaggio: data.indirizzo_autolavaggio,
        testo_hero_home: data.testo_hero_home,
        descrizione_autolavaggio: data.descrizione_autolavaggio,
      });
      setData(updated);
      setToast("Le modifiche sono online sul sito pubblico.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Salvataggio fallito");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Caricamento impostazioni...
      </div>
    );
  }

  if (!data) {
    return <Alert variant="error" message={error || "Impostazioni non disponibili"} />;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Alert variant="error" message={error} onDismiss={() => setError("")} />

        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          Modifica orari, telefoni e indirizzi qui: il sito pubblico legge questi dati dal database
          e si aggiorna subito dopo il salvataggio.
        </div>

        {FIELD_GROUPS.map((group) => (
          <section
            key={group.title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-base font-semibold text-slate-900">{group.title}</h2>
            {group.description && (
              <p className="mt-1 text-sm text-slate-500">{group.description}</p>
            )}
            <div className="mt-4 space-y-4">
              {group.fields.map(({ key, label, rows, placeholder }) => (
                <label key={key} className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                  {rows ? (
                    <textarea
                      className={`${inputClass} resize-y`}
                      rows={rows}
                      placeholder={placeholder}
                      value={String(data[key] ?? "")}
                      onChange={(e) => setData({ ...data, [key]: e.target.value })}
                    />
                  ) : (
                    <input
                      className={inputClass}
                      placeholder={placeholder}
                      value={String(data[key] ?? "")}
                      onChange={(e) => setData({ ...data, [key]: e.target.value })}
                    />
                  )}
                </label>
              ))}
            </div>
          </section>
        ))}

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? "Salvataggio in corso..." : "Salva Modifiche"}
          </button>
          {data.updated_at && (
            <p className="text-xs text-slate-500">
              Ultimo aggiornamento:{" "}
              {new Date(data.updated_at).toLocaleString("it-IT")}
            </p>
          )}
        </div>
      </form>

      <Toast message={toast} visible={Boolean(toast)} onClose={() => setToast("")} />
    </>
  );
}
