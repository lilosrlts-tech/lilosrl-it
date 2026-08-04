"use client";

import { useState } from "react";
import type { Categoria } from "@/types/database";

export interface CategoriaFormValues {
  nome: string;
  slug: string;
  descrizione: string;
  ordine: string;
  attivo: boolean;
}

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

function emptyValues(): CategoriaFormValues {
  return {
    nome: "",
    slug: "",
    descrizione: "",
    ordine: "",
    attivo: true,
  };
}

function fromCategoria(categoria: Categoria): CategoriaFormValues {
  return {
    nome: categoria.nome,
    slug: categoria.slug,
    descrizione: categoria.descrizione ?? "",
    ordine: String(categoria.ordine),
    attivo: categoria.attivo,
  };
}

interface CategoriaFormProps {
  initial?: Categoria | null;
  loading?: boolean;
  onSubmit: (values: CategoriaFormValues) => Promise<void>;
  onCancel: () => void;
}

export function CategoriaForm({
  initial,
  loading,
  onSubmit,
  onCancel,
}: CategoriaFormProps) {
  const [values, setValues] = useState<CategoriaFormValues>(
    initial ? fromCategoria(initial) : emptyValues(),
  );

  function update<K extends keyof CategoriaFormValues>(key: K, value: CategoriaFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit(values);
      }}
      className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
    >
      <h3 className="text-sm font-semibold text-slate-900">
        {initial ? `Modifica — ${initial.nome}` : "Nuova categoria"}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
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
          Slug URL
          <input
            className={inputClass}
            value={values.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="es. furgoni-medi"
          />
          <span className="mt-1 block text-xs text-slate-500">
            Lascia vuoto per generarlo dal nome
          </span>
        </label>

        <label className="block text-sm text-slate-700 sm:col-span-2">
          Descrizione
          <textarea
            className={inputClass}
            rows={2}
            value={values.descrizione}
            onChange={(e) => update("descrizione", e.target.value)}
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
            placeholder="1"
          />
        </label>

        <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={values.attivo}
            onChange={(e) => update("attivo", e.target.checked)}
          />
          Categoria attiva
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Salvataggio..." : initial ? "Salva modifiche" : "Aggiungi categoria"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-300"
        >
          Annulla
        </button>
      </div>
    </form>
  );
}

interface CategoriePanelProps {
  categorie: Categoria[];
  loading?: boolean;
  onCreate: (values: CategoriaFormValues) => Promise<void>;
  onUpdate: (id: string, values: CategoriaFormValues) => Promise<void>;
  onDelete: (categoria: Categoria) => Promise<void>;
}

export function CategoriePanel({
  categorie,
  loading,
  onCreate,
  onUpdate,
  onDelete,
}: CategoriePanelProps) {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [selected, setSelected] = useState<Categoria | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Gestisci le categorie usate nel menu a tendina dei veicoli e nel sito pubblico.
        </p>
        {mode === "list" && (
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setMode("create");
            }}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            + Nuova categoria
          </button>
        )}
      </div>

      {mode === "create" && (
        <CategoriaForm
          loading={loading}
          onSubmit={async (values) => {
            await onCreate(values);
            setMode("list");
          }}
          onCancel={() => setMode("list")}
        />
      )}

      {mode === "edit" && selected && (
        <CategoriaForm
          initial={selected}
          loading={loading}
          onSubmit={async (values) => {
            await onUpdate(selected.id, values);
            setMode("list");
            setSelected(null);
          }}
          onCancel={() => {
            setMode("list");
            setSelected(null);
          }}
        />
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Ordine</th>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Stato</th>
              <th className="px-4 py-3 font-medium text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categorie.map((categoria) => (
              <tr key={categoria.id}>
                <td className="px-4 py-3">{categoria.ordine}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{categoria.nome}</td>
                <td className="px-4 py-3 text-slate-500">{categoria.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      categoria.attivo
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {categoria.attivo ? "Attiva" : "Disattiva"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(categoria);
                        setMode("edit");
                      }}
                      className="rounded px-2 py-1 text-brand-700 hover:bg-brand-50"
                    >
                      Modifica
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(categoria)}
                      className="rounded px-2 py-1 text-red-700 hover:bg-red-50"
                    >
                      Elimina
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categorie.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-500">
            Nessuna categoria presente. Aggiungine una per iniziare.
          </p>
        )}
      </div>
    </div>
  );
}
