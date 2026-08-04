"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/Alert";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  ApiClientError,
  apiGet,
  apiPatch,
} from "@/lib/api-client";

interface PromozioneDurata {
  id: string;
  nome: string;
  slug: string;
  descrizione_pubblica: string | null;
  giorni_minimo: number;
  tipo: "paga_giorni" | "percentuale";
  giorni_a_pagamento: number | null;
  sconto_percentuale: number | null;
  attivo: boolean;
  ordine: number;
}

export function PromozioniPanel() {
  const router = useRouter();
  const [items, setItems] = useState<PromozioneDurata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setItems(await apiGet<PromozioneDurata[]>("/api/promozioni"));
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

  async function toggleAttivo(item: PromozioneDurata) {
    setError("");
    try {
      await apiPatch(`/api/promozioni/${item.id}`, { attivo: !item.attivo });
      setSuccess(
        !item.attivo
          ? `«${item.nome}» attivata`
          : `«${item.nome}» disattivata`,
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aggiornamento fallito");
    }
  }

  return (
    <AdminShell
      title="Promozioni durata"
      subtitle="Regole di flotta (7 giorni = 6, mese −30%). Su ogni veicolo puoi spegnerle."
    >
      {error && (
        <Alert variant="error" message={error} onDismiss={() => setError("")} />
      )}
      {success && (
        <Alert variant="success" message={success} onDismiss={() => setSuccess("")} />
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-4 text-sm text-slate-500">Caricamento…</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.nome}{" "}
                    {!item.attivo && (
                      <span className="text-xs font-normal text-amber-700">(off)</span>
                    )}
                  </p>
                  <p className="text-slate-600">
                    {item.descrizione_pubblica || "—"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    da {item.giorni_minimo} giorni ·{" "}
                    {item.tipo === "paga_giorni"
                      ? `paghi ${item.giorni_a_pagamento} giorni`
                      : `−${item.sconto_percentuale}%`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleAttivo(item)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    item.attivo
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-300 text-slate-700"
                  }`}
                >
                  {item.attivo ? "ON" : "OFF"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
