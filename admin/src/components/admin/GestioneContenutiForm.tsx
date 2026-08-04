"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Alert } from "@/components/Alert";
import { Toast } from "@/components/Toast";
import { apiGet, apiPatch, ApiClientError } from "@/lib/api-client";
import type { ImpostazioniSito } from "@/types/impostazioni";
import { SUPABASE_KEY_HELP } from "@/lib/supabase/errors";
import {
  SEO_PAGE_LABELS,
  SEO_PAGE_PATHS,
  type SeoPageKey,
  type SeoSettings,
} from "@/types/seo";

type TabId = "generali" | "cms" | "seo";

const TABS: { id: TabId; label: string }[] = [
  { id: "generali", label: "Impostazioni generali" },
  { id: "cms", label: "Testi pagine (CMS)" },
  { id: "seo", label: "SEO" },
];

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

function puntiForzaToText(json: string | null): string {
  if (!json) return "";
  try {
    const items = JSON.parse(json) as { title: string; description: string }[];
    return items.map((item) => `${item.title} | ${item.description}`).join("\n");
  } catch {
    return "";
  }
}

function formatApiError(err: unknown): string {
  if (err instanceof Error && err.message.toLowerCase().includes("invalid api key")) {
    return SUPABASE_KEY_HELP;
  }
  if (err instanceof ApiClientError && err.details && typeof err.details === "object") {
    const flat = err.details as { fieldErrors?: Record<string, string[]> };
    const fields = flat.fieldErrors
      ? Object.entries(flat.fieldErrors)
          .filter(([, msgs]) => msgs?.length)
          .map(([key, msgs]) => `${key}: ${msgs?.join(", ")}`)
      : [];
    if (fields.length > 0) {
      return `Dati non validi — ${fields.join(" · ")}`;
    }
  }
  return err instanceof Error ? err.message : "Salvataggio fallito";
}

function puntiForzaFromText(text: string): string | null {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;
  const items = lines.map((line) => {
    const [title, ...rest] = line.split("|");
    return { title: title.trim(), description: rest.join("|").trim() };
  });
  return JSON.stringify(items);
}

export function GestioneContenutiForm() {
  const [tab, setTab] = useState<TabId>("generali");
  const [data, setData] = useState<ImpostazioniSito | null>(null);
  const [puntiForzaText, setPuntiForzaText] = useState("");
  const [seoRows, setSeoRows] = useState<SeoSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSeoKey, setSavingSeoKey] = useState<SeoPageKey | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [demoBanner, setDemoBanner] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      apiGet<{ demo: boolean; message: string; invalidApiKey?: boolean }>("/api/health"),
      apiGet<ImpostazioniSito>("/api/impostazioni-sito"),
      apiGet<SeoSettings[]>("/api/seo-settings"),
    ])
      .then(([health, impostazioni, seo]) => {
        if (health.demo) setDemoBanner(health.message);
        setData(impostazioni);
        setPuntiForzaText(puntiForzaToText(impostazioni.home_punti_forza_json));
        setSeoRows(seo);
      })
      .catch((e) =>
        setError(
          e instanceof Error && e.message.toLowerCase().includes("invalid api key")
            ? SUPABASE_KEY_HELP
            : e instanceof Error
              ? e.message
              : "Errore caricamento",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSaveImpostazioni(e: FormEvent) {
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
        email_preventivi: data.email_preventivi,
        social_facebook: data.social_facebook,
        social_facebook_autolavaggio: data.social_facebook_autolavaggio,
        social_instagram: data.social_instagram,
        social_linkedin: data.social_linkedin,
        indirizzo_noleggio: data.indirizzo_noleggio,
        indirizzo_autolavaggio: data.indirizzo_autolavaggio,
        testo_hero_home: data.testo_hero_home,
        hero_titolo_home: data.hero_titolo_home,
        hero_badge_home: data.hero_badge_home,
        home_punti_forza_titolo: data.home_punti_forza_titolo,
        home_punti_forza_json: puntiForzaFromText(puntiForzaText),
        chi_siamo_hero_titolo: data.chi_siamo_hero_titolo,
        chi_siamo_hero_sottotitolo: data.chi_siamo_hero_sottotitolo,
        chi_siamo_intro: data.chi_siamo_intro,
        offerta_titolo: data.offerta_titolo,
        offerta_descrizione: data.offerta_descrizione,
        offerta_attiva: data.offerta_attiva,
        descrizione_autolavaggio: data.descrizione_autolavaggio,
        autolavaggio_lista_servizi: data.autolavaggio_lista_servizi,
        servizi_noleggio_lista: data.servizi_noleggio_lista,
      });
      setData(updated);
      setToast("Modifiche salvate. Il sito pubblico si aggiorna subito.");
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveSeo(pageKey: SeoPageKey) {
    const row = seoRows.find((item) => item.page_key === pageKey);
    if (!row) return;
    setSavingSeoKey(pageKey);
    setError("");
    try {
      const updated = await apiPatch<SeoSettings>("/api/seo-settings", {
        page_key: pageKey,
        seo_title: row.seo_title,
        seo_description: row.seo_description,
        seo_keywords: row.seo_keywords,
        meta_robots: row.meta_robots,
        canonical_url: row.canonical_url,
        og_title: row.og_title,
        og_description: row.og_description,
      });
      setSeoRows((prev) => prev.map((item) => (item.page_key === pageKey ? updated : item)));
      setToast(`SEO aggiornato per ${SEO_PAGE_LABELS[pageKey]}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Salvataggio SEO fallito");
    } finally {
      setSavingSeoKey(null);
    }
  }

  function updateSeoRow(pageKey: SeoPageKey, patch: Partial<SeoSettings>) {
    setSeoRows((prev) =>
      prev.map((item) => (item.page_key === pageKey ? { ...item, ...patch } : item))
    );
  }

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
      {demoBanner && (
        <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          {demoBanner}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === item.id
                ? "bg-brand-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <Alert variant="error" message={error} onDismiss={() => setError("")} />

      {tab !== "seo" && (
        <form onSubmit={handleSaveImpostazioni} className="space-y-6">
          {tab === "generali" && (
            <>
              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Contatti e preventivi</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Email e telefoni usati nel sito e per le richieste di preventivo.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-1.5 sm:col-span-2">
                    <span className="text-sm font-medium text-slate-700">
                      Email destinazione preventivi
                    </span>
                    <input
                      className={inputClass}
                      type="email"
                      value={data.email_preventivi}
                      onChange={(e) => setData({ ...data, email_preventivi: e.target.value })}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Email contatto generale</span>
                    <input
                      className={inputClass}
                      type="email"
                      value={data.email_contatto}
                      onChange={(e) => setData({ ...data, email_contatto: e.target.value })}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Telefono noleggio</span>
                    <input
                      className={inputClass}
                      value={data.telefono_noleggio}
                      onChange={(e) => setData({ ...data, telefono_noleggio: e.target.value })}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Telefono autolavaggio</span>
                    <input
                      className={inputClass}
                      value={data.telefono_autolavaggio}
                      onChange={(e) => setData({ ...data, telefono_autolavaggio: e.target.value })}
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Social</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Link separati per noleggio e autolavaggio (pagine Facebook distinte).
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-1.5 sm:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Facebook noleggio</span>
                    <input
                      className={inputClass}
                      placeholder="https://www.facebook.com/..."
                      value={data.social_facebook ?? ""}
                      onChange={(e) =>
                        setData({ ...data, social_facebook: e.target.value || null })
                      }
                    />
                  </label>
                  <label className="block space-y-1.5 sm:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Facebook autolavaggio</span>
                    <input
                      className={inputClass}
                      placeholder="https://www.facebook.com/..."
                      value={data.social_facebook_autolavaggio ?? ""}
                      onChange={(e) =>
                        setData({ ...data, social_facebook_autolavaggio: e.target.value || null })
                      }
                    />
                  </label>
                  {(
                    [
                      ["social_instagram", "Instagram"],
                      ["social_linkedin", "LinkedIn"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="block space-y-1.5">
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                      <input
                        className={inputClass}
                        placeholder="https://"
                        value={data[key] ?? ""}
                        onChange={(e) =>
                          setData({ ...data, [key]: e.target.value || null })
                        }
                      />
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Sedi e orari</h2>
                <div className="mt-4 space-y-4">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Indirizzo noleggio</span>
                    <textarea
                      className={`${inputClass} resize-y`}
                      rows={2}
                      value={data.indirizzo_noleggio}
                      onChange={(e) => setData({ ...data, indirizzo_noleggio: e.target.value })}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Orari noleggio</span>
                    <textarea
                      className={`${inputClass} resize-y`}
                      rows={3}
                      value={data.orari_noleggio}
                      onChange={(e) => setData({ ...data, orari_noleggio: e.target.value })}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Indirizzo autolavaggio</span>
                    <textarea
                      className={`${inputClass} resize-y`}
                      rows={2}
                      value={data.indirizzo_autolavaggio}
                      onChange={(e) => setData({ ...data, indirizzo_autolavaggio: e.target.value })}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Orari autolavaggio</span>
                    <textarea
                      className={`${inputClass} resize-y`}
                      rows={3}
                      value={data.orari_autolavaggio}
                      onChange={(e) => setData({ ...data, orari_autolavaggio: e.target.value })}
                    />
                  </label>
                </div>
              </section>
            </>
          )}

          {tab === "cms" && (
            <>
              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Home page</h2>
                <div className="mt-4 space-y-4">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Badge hero</span>
                    <input
                      className={inputClass}
                      value={data.hero_badge_home}
                      onChange={(e) => setData({ ...data, hero_badge_home: e.target.value })}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Titolo H1 hero</span>
                    <input
                      className={inputClass}
                      value={data.hero_titolo_home}
                      onChange={(e) => setData({ ...data, hero_titolo_home: e.target.value })}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Testo descrittivo hero</span>
                    <textarea
                      className={`${inputClass} resize-y`}
                      rows={4}
                      value={data.testo_hero_home}
                      onChange={(e) => setData({ ...data, testo_hero_home: e.target.value })}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">
                      Titolo sezione punti di forza
                    </span>
                    <input
                      className={inputClass}
                      value={data.home_punti_forza_titolo}
                      onChange={(e) =>
                        setData({ ...data, home_punti_forza_titolo: e.target.value })
                      }
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">
                      Punti di forza (una riga per voce: Titolo | Descrizione)
                    </span>
                    <textarea
                      className={`${inputClass} resize-y font-mono text-xs`}
                      rows={6}
                      placeholder="20+ Anni di Esperienza | Dal 2003 leader nei trasporti..."
                      value={puntiForzaText}
                      onChange={(e) => setPuntiForzaText(e.target.value)}
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Chi Siamo</h2>
                <div className="mt-4 space-y-4">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Titolo hero</span>
                    <textarea
                      className={`${inputClass} resize-y`}
                      rows={2}
                      value={data.chi_siamo_hero_titolo ?? ""}
                      onChange={(e) =>
                        setData({ ...data, chi_siamo_hero_titolo: e.target.value || null })
                      }
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Sottotitolo</span>
                    <input
                      className={inputClass}
                      value={data.chi_siamo_hero_sottotitolo ?? ""}
                      onChange={(e) =>
                        setData({ ...data, chi_siamo_hero_sottotitolo: e.target.value || null })
                      }
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Introduzione</span>
                    <textarea
                      className={`${inputClass} resize-y`}
                      rows={4}
                      value={data.chi_siamo_intro ?? ""}
                      onChange={(e) =>
                        setData({ ...data, chi_siamo_intro: e.target.value || null })
                      }
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">
                      Lista servizi noleggio (una riga per voce)
                    </span>
                    <textarea
                      className={`${inputClass} resize-y`}
                      rows={5}
                      value={data.servizi_noleggio_lista ?? ""}
                      onChange={(e) =>
                        setData({ ...data, servizi_noleggio_lista: e.target.value || null })
                      }
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Offerta del Mese</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Attiva o disattiva la promo nel menu e nella pagina dedicata.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      checked={data.offerta_attiva}
                      onChange={(e) => setData({ ...data, offerta_attiva: e.target.checked })}
                    />
                    Promo attiva
                  </label>
                </div>
                <div className="mt-4 space-y-4">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Titolo pagina</span>
                    <input
                      className={inputClass}
                      value={data.offerta_titolo}
                      onChange={(e) => setData({ ...data, offerta_titolo: e.target.value })}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Descrizione</span>
                    <textarea
                      className={`${inputClass} resize-y`}
                      rows={5}
                      value={data.offerta_descrizione ?? ""}
                      onChange={(e) =>
                        setData({ ...data, offerta_descrizione: e.target.value || null })
                      }
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Autolavaggio</h2>
                <div className="mt-4 space-y-4">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Descrizione principale</span>
                    <textarea
                      className={`${inputClass} resize-y`}
                      rows={5}
                      value={data.descrizione_autolavaggio}
                      onChange={(e) =>
                        setData({ ...data, descrizione_autolavaggio: e.target.value })
                      }
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">
                      Lista servizi (una riga per voce)
                    </span>
                    <textarea
                      className={`${inputClass} resize-y`}
                      rows={6}
                      value={data.autolavaggio_lista_servizi ?? ""}
                      onChange={(e) =>
                        setData({ ...data, autolavaggio_lista_servizi: e.target.value || null })
                      }
                    />
                  </label>
                </div>
              </section>
            </>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? "Salvataggio in corso..." : "Salva modifiche"}
            </button>
            {data.updated_at && (
              <p className="text-xs text-slate-500">
                Ultimo aggiornamento: {new Date(data.updated_at).toLocaleString("it-IT")}
              </p>
            )}
          </div>
        </form>
      )}

      {tab === "seo" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            Configura meta title, description e keywords per ogni pagina. I valori vengono inseriti
            automaticamente nel codice HTML del sito pubblico.
          </div>

          {seoRows.map((row) => (
            <section
              key={row.page_key}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {SEO_PAGE_LABELS[row.page_key]}
                  </h2>
                  <p className="text-xs text-slate-500">{SEO_PAGE_PATHS[row.page_key]}</p>
                </div>
                <button
                  type="button"
                  disabled={savingSeoKey === row.page_key}
                  onClick={() => handleSaveSeo(row.page_key)}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  {savingSeoKey === row.page_key ? "Salvataggio..." : "Salva SEO"}
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Meta Title</span>
                  <input
                    className={inputClass}
                    value={row.seo_title}
                    onChange={(e) => updateSeoRow(row.page_key, { seo_title: e.target.value })}
                  />
                  <span className="text-xs text-slate-400">{row.seo_title.length}/120 caratteri</span>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Meta Description</span>
                  <textarea
                    className={`${inputClass} resize-y`}
                    rows={3}
                    value={row.seo_description}
                    onChange={(e) =>
                      updateSeoRow(row.page_key, { seo_description: e.target.value })
                    }
                  />
                  <span className="text-xs text-slate-400">
                    {row.seo_description.length}/320 caratteri
                  </span>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">
                    Keywords (separate da virgola)
                  </span>
                  <input
                    className={inputClass}
                    value={row.seo_keywords.join(", ")}
                    onChange={(e) =>
                      updateSeoRow(row.page_key, {
                        seo_keywords: e.target.value
                          .split(",")
                          .map((k) => k.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Meta Robots</span>
                  <input
                    className={inputClass}
                    value={row.meta_robots}
                    onChange={(e) => updateSeoRow(row.page_key, { meta_robots: e.target.value })}
                  />
                </label>
              </div>
            </section>
          ))}
        </div>
      )}

      <Toast message={toast} visible={Boolean(toast)} onClose={() => setToast("")} />
    </>
  );
}
