import { createPublicClient, logSupabaseError } from "@/lib/supabase";

export type PromoDurataTipo = "paga_giorni" | "percentuale";

export interface PromoDurataRegola {
  id: string;
  nome: string;
  slug: string;
  descrizione_pubblica: string | null;
  giorni_minimo: number;
  tipo: PromoDurataTipo;
  giorni_a_pagamento: number | null;
  sconto_percentuale: number | null;
  ordine: number;
}

export interface PrezzoConPromo {
  /** Tariffa giornaliera listino */
  giornaliero: number;
  /** Equivalente giornaliero migliore con promo (o = giornaliero) */
  daGiorno: number;
  valuta: string;
  promoAttiva: boolean;
  regole: PromoDurataRegola[];
  /** Regola che determina il “da €…” */
  regolaMigliore: PromoDurataRegola | null;
}

/** Equivalente €/giorno applicando una regola al listino giornaliero. */
export function equivalentDailyFromPromo(
  giornaliero: number,
  regola: PromoDurataRegola,
): number {
  if (regola.tipo === "paga_giorni" && regola.giorni_a_pagamento != null) {
    return (giornaliero * regola.giorni_a_pagamento) / regola.giorni_minimo;
  }
  if (regola.tipo === "percentuale" && regola.sconto_percentuale != null) {
    return giornaliero * (1 - Number(regola.sconto_percentuale) / 100);
  }
  return giornaliero;
}

export function resolvePrezzoConPromo(
  giornaliero: number,
  valuta: string,
  promoAttiva: boolean,
  regole: PromoDurataRegola[],
): PrezzoConPromo {
  if (!promoAttiva || regole.length === 0) {
    return {
      giornaliero,
      daGiorno: giornaliero,
      valuta,
      promoAttiva: false,
      regole: [],
      regolaMigliore: null,
    };
  }

  let best = giornaliero;
  let regolaMigliore: PromoDurataRegola | null = null;
  for (const regola of regole) {
    const eq = equivalentDailyFromPromo(giornaliero, regola);
    if (eq < best - 0.001) {
      best = eq;
      regolaMigliore = regola;
    }
  }

  return {
    giornaliero,
    daGiorno: Math.round(best * 100) / 100,
    valuta,
    promoAttiva: true,
    regole,
    regolaMigliore,
  };
}

/** True se c’è uno sconto durata rispetto al listino giornaliero. */
export function hasPromoDurataSconto(
  prezzo: Pick<PrezzoConPromo, "giornaliero" | "daGiorno" | "promoAttiva">,
): boolean {
  return Boolean(prezzo.promoAttiva && prezzo.daGiorno < prezzo.giornaliero - 0.01);
}

/** Regola durata in parole, senza un secondo prezzo al giorno. */
export function fraseRegolaDurata(regola: {
  nome?: string | null;
  descrizione_pubblica?: string | null;
  giorni_minimo?: number | null;
  tipo?: PromoDurataTipo | null;
  giorni_a_pagamento?: number | null;
  sconto_percentuale?: number | null;
}): string | null {
  const giorni = regola.giorni_minimo ?? 0;
  if (regola.tipo === "paga_giorni" && regola.giorni_a_pagamento != null && giorni > 0) {
    return `${giorni} giorni: ne paghi ${regola.giorni_a_pagamento}`;
  }
  if (regola.tipo === "percentuale" && regola.sconto_percentuale != null && giorni > 0) {
    return `Da ${giorni} giorni, sconto ${Number(regola.sconto_percentuale)}% sul listino`;
  }
  const text = (regola.descrizione_pubblica || regola.nome || "").trim();
  return text || null;
}

/**
 * Riga secondaria sotto il listino: sconto durata in parole.
 * Il prezzo principale resta sempre il giornaliero di listino.
 */
export function labelPromoDurataSecondario(prezzo: {
  giornaliero: number;
  daGiorno: number;
  promoAttiva: boolean;
  regole?: Array<Parameters<typeof fraseRegolaDurata>[0] & { giorni_minimo?: number | null }>;
  regolaMigliore?: Parameters<typeof fraseRegolaDurata>[0] | null;
}): string | null {
  if (!hasPromoDurataSconto(prezzo)) return null;

  const regole =
    prezzo.regole && prezzo.regole.length > 0
      ? [...prezzo.regole].sort((a, b) => (a.giorni_minimo ?? 0) - (b.giorni_minimo ?? 0))
      : prezzo.regolaMigliore
        ? [prezzo.regolaMigliore]
        : [];
  const parts = regole
    .map((regola) => fraseRegolaDurata(regola))
    .filter((part): part is string => Boolean(part));
  if (parts.length === 0) return null;
  return `${parts.join(". ")}.`;
}

let cachedRegole: PromoDurataRegola[] | null = null;
let cachedAt = 0;
const CACHE_MS = 60_000;

export async function getPromozioniDurataAttive(): Promise<PromoDurataRegola[]> {
  const now = Date.now();
  if (cachedRegole && now - cachedAt < CACHE_MS) return cachedRegole;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("promozioni_durata")
      .select(
        "id,nome,slug,descrizione_pubblica,giorni_minimo,tipo,giorni_a_pagamento,sconto_percentuale,ordine",
      )
      .eq("attivo", true)
      .order("ordine", { ascending: true });

    if (error) {
      logSupabaseError("getPromozioniDurataAttive", error.message);
      return cachedRegole ?? [];
    }

    cachedRegole = (data ?? []).map((row) => ({
      id: String(row.id),
      nome: String(row.nome),
      slug: String(row.slug),
      descrizione_pubblica: (row.descrizione_pubblica as string) ?? null,
      giorni_minimo: Number(row.giorni_minimo),
      tipo: row.tipo as PromoDurataTipo,
      giorni_a_pagamento:
        row.giorni_a_pagamento != null ? Number(row.giorni_a_pagamento) : null,
      sconto_percentuale:
        row.sconto_percentuale != null ? Number(row.sconto_percentuale) : null,
      ordine: Number(row.ordine) || 0,
    }));
    cachedAt = now;
    return cachedRegole;
  } catch (err) {
    logSupabaseError(
      "getPromozioniDurataAttive",
      err instanceof Error ? err.message : String(err),
    );
    return cachedRegole ?? [];
  }
}
