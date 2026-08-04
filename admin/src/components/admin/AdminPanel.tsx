"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/Alert";
import { VeicoloForm, type VeicoloFormValues, type VeicoloPhotoFiles } from "@/components/admin/VeicoloForm";
import {
  CategoriePanel,
  type CategoriaFormValues,
} from "@/components/admin/CategoriePanel";
import { AdminShell } from "@/components/admin/AdminShell";
import { VeicoloList } from "@/components/admin/VeicoloList";
import {
  ApiClientError,
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "@/lib/api-client";
import type { Accessorio, Categoria, VeicoloDettaglio } from "@/types/database";

type ViewMode = "list" | "create" | "edit" | "categories";

export function AdminPanel() {
  const router = useRouter();
  const [categorie, setCategorie] = useState<Categoria[]>([]);
  const [accessoriCatalog, setAccessoriCatalog] = useState<Accessorio[]>([]);
  const [veicoli, setVeicoli] = useState<VeicoloDettaglio[]>([]);
  const [selected, setSelected] = useState<VeicoloDettaglio | null>(null);
  const [view, setView] = useState<ViewMode>("list");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [demoBanner, setDemoBanner] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const health = await apiGet<{ demo: boolean; message: string }>("/api/health");
      if (health.demo) setDemoBanner(health.message);

      const [catData, veicoliData, accessoriData] = await Promise.all([
        apiGet<Categoria[]>("/api/categorie"),
        apiGet<VeicoloDettaglio[]>("/api/veicoli"),
        apiGet<Accessorio[]>("/api/accessori"),
      ]);
      setCategorie(catData);
      setVeicoli(veicoliData);
      setAccessoriCatalog(accessoriData);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        router.push("/admin/login");
        return;
      }
      setError(err instanceof Error ? err.message : "Errore nel caricamento dati");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function parseOptionalNumber(value: string): number | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : null;
  }

  function parseAiHighlights(value: string): string[] {
    return value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function parseAiFaq(values: VeicoloFormValues): { q: string; a: string }[] {
    return values.ai_faq
      .map((item) => ({ q: item.q.trim(), a: item.a.trim() }))
      .filter((item) => item.q && item.a);
  }

  function buildPayload(values: VeicoloFormValues) {
    const volume = parseOptionalNumber(values.volume_metri_cubi);
    const portata = parseOptionalNumber(values.portata_utile_kg);
    const lunghezzaVano = parseOptionalNumber(values.lunghezza_vano_mm);
    const larghezzaVano = parseOptionalNumber(values.larghezza_vano_mm);
    const altezzaVano = parseOptionalNumber(values.altezza_vano_mm);
    const larghezzaPassaruota = parseOptionalNumber(values.larghezza_tra_passaruota_mm);

    return {
      categoria_id: values.categoria_id,
      targa: values.targa.trim(),
      marca: values.marca.trim(),
      modello: values.modello.trim(),
      versione: values.versione || null,
      colore: values.colore || null,
      alimentazione: values.alimentazione || null,
      titolo_pubblico: values.titolo_pubblico || null,
      descrizione_breve: values.descrizione_breve || null,
      descrizione_completa: values.descrizione_completa || null,
      prezzo_giornaliero: Number(values.prezzo_giornaliero),
      volume_metri_cubi: volume,
      portata_utile_kg: portata,
      lunghezza_vano_mm: lunghezzaVano,
      larghezza_vano_mm: larghezzaVano,
      altezza_vano_mm: altezzaVano,
      larghezza_tra_passaruota_mm: larghezzaPassaruota,
      portata_kg: portata,
      volume_carico_mc: volume,
      vano_lunghezza_mm: lunghezzaVano,
      vano_larghezza_mm: larghezzaVano,
      vano_altezza_mm: altezzaVano,
      capacita_bagagliaio_valigie: parseOptionalNumber(values.capacita_bagagliaio_valigie),
      classe_ambientale: values.classe_ambientale || null,
      connessione_smartphone: values.connessione_smartphone || null,
      configurazione_sedili: values.configurazione_sedili || null,
      climatizzazione_posteriore: values.climatizzazione_posteriore,
      trazione: values.trazione || null,
      passo: values.passo || null,
      tetto: values.tetto || null,
      sensori_parcheggio: values.sensori_parcheggio,
      lunghezza_mm: parseOptionalNumber(values.lunghezza_mm),
      larghezza_mm: parseOptionalNumber(values.larghezza_mm),
      altezza_mm: parseOptionalNumber(values.altezza_mm),
      ai_summary: values.ai_summary.trim() || null,
      ai_highlights: parseAiHighlights(values.ai_highlights),
      ai_faq: parseAiFaq(values),
      pubblicato: values.pubblicato,
      attivo: values.attivo,
      unita_disponibili: Math.max(1, Number(values.unita_disponibili) || 1),
      accessori_ids: values.accessori_ids,
      promo_durata_attiva: values.promo_durata_attiva,
    };
  }

  function buildCategoriaPayload(values: CategoriaFormValues) {
    return {
      nome: values.nome.trim(),
      slug: values.slug.trim() || undefined,
      descrizione: values.descrizione.trim() || null,
      ordine: values.ordine.trim() ? Number(values.ordine) : undefined,
      attivo: values.attivo,
    };
  }

  async function handleCreateCategoria(values: CategoriaFormValues) {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await apiPost("/api/categorie", buildCategoriaPayload(values));
      setSuccess("Categoria aggiunta");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante la creazione");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateCategoria(id: string, values: CategoriaFormValues) {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await apiPatch(`/api/categorie/${id}`, buildCategoriaPayload(values));
      setSuccess("Categoria aggiornata");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante l'aggiornamento");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategoria(categoria: Categoria) {
    if (!confirm(`Eliminare la categoria "${categoria.nome}"?`)) return;
    setError("");
    try {
      await apiDelete(`/api/categorie/${categoria.id}`);
      setSuccess("Categoria eliminata");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eliminazione fallita");
    }
  }

  async function uploadFotoCopertina(veicoloId: string, file: File) {
    const formData = new FormData();
    formData.append("foto", file);
    formData.append("alt_text", "seo-auto");
    formData.append("is_copertina", "true");
    await apiPost(`/api/veicoli/${veicoloId}/foto`, formData);
  }

  async function uploadFotoSecondaria(
    veicoloId: string,
    file: File,
    veicolo?: VeicoloDettaglio | null,
  ) {
    const existing = veicolo?.foto?.filter((f) => !f.is_copertina) ?? [];
    for (const foto of existing) {
      await apiDelete(`/api/veicoli/${veicoloId}/foto/${foto.id}`);
    }

    const formData = new FormData();
    formData.append("foto", file);
    formData.append("alt_text", "seo-auto");
    formData.append("is_copertina", "false");
    await apiPost(`/api/veicoli/${veicoloId}/foto`, formData);
  }

  async function uploadPhotos(
    veicoloId: string,
    photos: VeicoloPhotoFiles,
    veicolo?: VeicoloDettaglio | null,
  ) {
    if (photos.copertina) await uploadFotoCopertina(veicoloId, photos.copertina);
    if (photos.secondaria) await uploadFotoSecondaria(veicoloId, photos.secondaria, veicolo);
  }

  async function handleCreate(values: VeicoloFormValues, photos: VeicoloPhotoFiles) {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const veicolo = await apiPost<VeicoloDettaglio>("/api/veicoli", buildPayload(values));
      await uploadPhotos(veicolo.id, photos);
      setSuccess("Veicolo aggiunto con successo");
      setView("list");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante la creazione");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(values: VeicoloFormValues, photos: VeicoloPhotoFiles) {
    if (!selected) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await apiPatch(`/api/veicoli/${selected.id}`, buildPayload(values));
      await uploadPhotos(selected.id, photos, selected);
      setSuccess("Veicolo aggiornato");
      setView("list");
      setSelected(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante l'aggiornamento");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(veicolo: VeicoloDettaglio) {
    if (!confirm(`Contrassegnare ${veicolo.targa} come non disponibile?`)) return;
    setError("");
    try {
      await apiPatch(`/api/veicoli/${veicolo.id}`, { action: "set_disponibilita", attivo: false });
      setSuccess(`${veicolo.targa} non è più disponibile`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operazione fallita");
    }
  }

  async function handleReactivate(veicolo: VeicoloDettaglio) {
    setError("");
    try {
      await apiPatch(`/api/veicoli/${veicolo.id}`, { action: "set_disponibilita", attivo: true });
      setSuccess(`${veicolo.targa} è di nuovo disponibile`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operazione fallita");
    }
  }

  async function handleDelete(veicolo: VeicoloDettaglio) {
    const hard = confirm(
      `Eliminare definitivamente ${veicolo.marca} ${veicolo.modello} (${veicolo.targa})?\n\nOK = eliminazione permanente\nAnnulla = mantieni`
    );
    if (!hard) return;

    const really = confirm("Confermi l'eliminazione permanente? Questa azione non è reversibile.");
    if (!really) return;

    setError("");
    try {
      await apiDelete(`/api/veicoli/${veicolo.id}?hard=true`);
      setSuccess("Veicolo eliminato definitivamente");
      if (selected?.id === veicolo.id) {
        setSelected(null);
        setView("list");
      }
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eliminazione fallita");
    }
  }

  return (
    <AdminShell title="Gestione flotta" subtitle="Veicoli, prezzi e foto">
      <div className="space-y-6">
        <Alert variant="error" message={error} onDismiss={() => setError("")} />
        <Alert variant="success" message={success} onDismiss={() => setSuccess("")} />
        {demoBanner && <Alert variant="info" message={demoBanner} />}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setView("list");
                setSelected(null);
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                view === "list"
                  ? "bg-brand-600 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-300"
              }`}
            >
              Flotta ({veicoli.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setView("create");
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                view === "create"
                  ? "bg-brand-600 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-300"
              }`}
            >
              + Nuovo veicolo
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setView("categories");
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                view === "categories"
                  ? "bg-brand-600 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-300"
              }`}
            >
              Categorie ({categorie.length})
            </button>
          </div>

          {view !== "categories" && categorie.length > 0 && (
            <p className="text-sm text-slate-500">
              Categorie: {categorie.map((c) => c.nome).join(", ")}
            </p>
          )}
        </div>

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Caricamento...
          </div>
        ) : view === "categories" ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Gestione categorie</h2>
            <CategoriePanel
              categorie={categorie}
              loading={saving}
              onCreate={handleCreateCategoria}
              onUpdate={handleUpdateCategoria}
              onDelete={handleDeleteCategoria}
            />
          </div>
        ) : view === "list" ? (
          <VeicoloList
            veicoli={veicoli}
            selectedId={selected?.id}
            onSelect={(v) => {
              setSelected(v);
              setView("edit");
            }}
            onDeactivate={handleDeactivate}
            onDelete={handleDelete}
            onReactivate={handleReactivate}
          />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              {view === "create" ? "Aggiungi nuovo veicolo" : `Modifica — ${selected?.targa}`}
            </h2>
            <VeicoloForm
              categorie={categorie}
              accessoriCatalog={accessoriCatalog}
              initialVeicolo={view === "edit" ? selected : null}
              loading={saving}
              onSubmit={view === "create" ? handleCreate : handleUpdate}
              onCancel={() => {
                setView("list");
                setSelected(null);
              }}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
