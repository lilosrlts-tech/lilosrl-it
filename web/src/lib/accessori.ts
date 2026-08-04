import { createPublicClient, logSupabaseError } from "@/lib/supabase";
import type { AccessorioPubblico } from "@/types/veicolo";

function mapAccessorio(raw: Record<string, unknown>): AccessorioPubblico | null {
  if (!raw?.id || raw.attivo === false) return null;
  return {
    id: String(raw.id),
    nome: String(raw.nome),
    slug: String(raw.slug),
    descrizione: (raw.descrizione as string) ?? null,
    prezzo_giornaliero: Number(raw.prezzo_giornaliero) || 0,
    deposito: raw.deposito != null ? Number(raw.deposito) : null,
    deposito_richiesto: Boolean(raw.deposito_richiesto),
    quantita_max: Math.max(1, Number(raw.quantita_max) || 1),
  };
}

/** Accessori attivi assegnati a un veicolo (ordine catalogo). */
export async function getAccessoriForVeicolo(
  veicoloId: string,
): Promise<AccessorioPubblico[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("veicolo_accessori")
      .select("accessorio:accessori(*)")
      .eq("veicolo_id", veicoloId);

    if (error) {
      logSupabaseError("getAccessoriForVeicolo", error.message);
      return [];
    }

    const items = (data ?? [])
      .map((row) => {
        const acc = row.accessorio as Record<string, unknown> | Record<string, unknown>[] | null;
        if (!acc) return null;
        const one = Array.isArray(acc) ? acc[0] : acc;
        return one ? mapAccessorio(one) : null;
      })
      .filter((item): item is AccessorioPubblico => Boolean(item));

    return items.sort((a, b) => {
      // Prefer catalog order via known slugs; fallback name
      const order: Record<string, number> = {
        "rialzo-bambini-gruppo-3": 10,
        "seggiolino-isofix-9-36": 20,
        rampa: 30,
        "carrello-manuale": 40,
      };
      const oa = order[a.slug] ?? 100;
      const ob = order[b.slug] ?? 100;
      if (oa !== ob) return oa - ob;
      return a.nome.localeCompare(b.nome, "it");
    });
  } catch (err) {
    logSupabaseError(
      "getAccessoriForVeicolo",
      err instanceof Error ? err.message : String(err),
    );
    return [];
  }
}

export function formatAccessorioPrezzo(importo: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(importo);
}
