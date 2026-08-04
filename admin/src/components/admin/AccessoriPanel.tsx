"use client";

import { useEffect, useState } from "react";
import { Alert } from "@/components/Alert";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  ApiClientError,
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "@/lib/api-client";
import type { Accessorio } from "@/types/database";
import { useRouter } from "next/navigation";

interface FormValues {
  nome: string;
  slug: string;
  descrizione: string;
  prezzo_giornaliero: string;
  deposito: string;
  deposito_richiesto: boolean;
  quantita_max: string;
  ordine: string;
  attivo: boolean;
}

const empty: FormValues = {
  nome: "",
  slug: "",
  descrizione: "",
  prezzo_giornaliero: "0",
  deposito: "",
  deposito_richiesto: false,
  quantita_max: "5",
  ordine: "0",
  attivo: true,
};

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

function fromAccessorio(a: Accessorio): FormValues {
  return {
    nome: a.nome,
    slug: a.slug,
    descrizione: a.descrizione ?? "",
    prezzo_giornaliero: String(a.prezzo_giornaliero),
    deposito: a.deposito != null ? String(a.deposito) : "",
    deposito_richiesto: a.deposito_richiesto,
    quantita_max: String(a.quantita_max),
    ordine: String(a.ordine),
    attivo: a.attivo,
  };
}

function buildPayload(values: FormValues) {
  return {
    nome: values.nome.trim(),
    slug: values.slug.trim() || undefined,
    descrizione: values.descrizione.trim() || null,
    prezzo_giornaliero: Number(values.prezzo_giornaliero) || 0,
    deposito: values.deposito.trim() ? Number(values.deposito) : null,
    deposito_richiesto: values.deposito_richiesto,
    quantita_max: Math.max(1, Number(values.quantita_max) || 1),
    ordine: Number(values.ordine) || 0,
    attivo: values.attivo,
  };
}

export function AccessoriPanel() {
  const router = useRouter();
  const [items, setItems] = useState<Accessorio[]>([]);
  const [editing, setEditing] = useState<Accessorio | null>(null);
  const [values, setValues] = useState<FormValues>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet<Accessorio[]>("/api/accessori");
      setItems(data);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        router.push("/admin/login");
        return;
      }
      setError(err instanceof Error ? err.message : "Errore caricamento");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function startCreate() {
    setEditing(null);
    setValues(empty);
  }

  function startEdit(item: Accessorio) {
    setEditing(item);
    setValues(fromAccessorio(item));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = buildPayload(values);
      if (editing) {
        await apiPatch(`/api/accessori/${editing.id}`, payload);
        setSuccess("Accessorio aggiornato");
      } else {
        await apiPost("/api/accessori", payload);
        setSuccess("Accessorio creato");
      }
      setEditing(null);
      setValues(empty);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Salvataggio fallito");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: Accessorio) {
    if (!confirm(`Eliminare «${item.nome}» dal catalogo?`)) return;
    setError("");
    try {
      await apiDelete(`/api/accessori/${item.id}`);
      setSuccess("Accessorio eliminato");
      if (editing?.id === item.id) {
        setEditing(null);
        setValues(empty);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eliminazione fallita");
    }
  }

  return (
    <AdminShell
      title="Accessori / Extra"
      subtitle="Catalogo globale: assegna poi i singoli extra su ogni veicolo"
    >
      {error && (
        <Alert variant="error" message={error} onDismiss={() => setError("")} />
      )}
      {success && (
        <Alert variant="success" message={success} onDismiss={() => setSuccess("")} />
      )}

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">Catalogo</h2>
            <button
              type="button"
              onClick={startCreate}
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Nuovo
            </button>
          </div>
          {loading ? (
            <p className="p-4 text-sm text-slate-500">Caricamento…</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {item.nome}{" "}
                      {!item.attivo && (
                        <span className="text-xs font-normal text-amber-700">(disattivo)</span>
                      )}
                    </p>
                    <p className="text-slate-500">
                      €{Number(item.prezzo_giornaliero).toFixed(2)}/gg · max {item.quantita_max} ·{" "}
                      {item.deposito_richiesto
                        ? `deposito €${Number(item.deposito ?? 0).toFixed(2)}`
                        : "deposito non richiesto"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                    >
                      Modifica
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                    >
                      Elimina
                    </button>
                  </div>
                </li>
              ))}
              {items.length === 0 && (
                <li className="p-4 text-sm text-slate-500">Nessun accessorio. Creane uno.</li>
              )}
            </ul>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="h-fit space-y-3 rounded-xl border border-slate-200 bg-white p-4"
        >
          <h3 className="text-sm font-semibold text-slate-900">
            {editing ? `Modifica — ${editing.nome}` : "Nuovo accessorio"}
          </h3>
          <label className="block text-sm text-slate-700">
            Nome *
            <input
              className={inputClass}
              value={values.nome}
              onChange={(e) => update("nome", e.target.value)}
              required
            />
          </label>
          <label className="block text-sm text-slate-700">
            Slug
            <input
              className={inputClass}
              value={values.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="auto dal nome"
            />
          </label>
          <label className="block text-sm text-slate-700">
            Descrizione
            <textarea
              className={inputClass}
              rows={2}
              value={values.descrizione}
              onChange={(e) => update("descrizione", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm text-slate-700">
              Prezzo €/gg *
              <input
                className={inputClass}
                type="number"
                min={0}
                step="0.01"
                value={values.prezzo_giornaliero}
                onChange={(e) => update("prezzo_giornaliero", e.target.value)}
                required
              />
            </label>
            <label className="block text-sm text-slate-700">
              Qtà max
              <input
                className={inputClass}
                type="number"
                min={1}
                value={values.quantita_max}
                onChange={(e) => update("quantita_max", e.target.value)}
              />
            </label>
            <label className="block text-sm text-slate-700">
              Deposito €
              <input
                className={inputClass}
                type="number"
                min={0}
                step="0.01"
                value={values.deposito}
                onChange={(e) => update("deposito", e.target.value)}
                placeholder="vuoto = no"
              />
            </label>
            <label className="block text-sm text-slate-700">
              Ordine
              <input
                className={inputClass}
                type="number"
                min={0}
                value={values.ordine}
                onChange={(e) => update("ordine", e.target.value)}
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={values.deposito_richiesto}
              onChange={(e) => update("deposito_richiesto", e.target.checked)}
            />
            Deposito richiesto
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={values.attivo}
              onChange={(e) => update("attivo", e.target.checked)}
            />
            Attivo nel catalogo
          </label>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? "Salvataggio…" : editing ? "Salva" : "Crea"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={startCreate}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700"
              >
                Annulla
              </button>
            )}
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
