/**
 * Sedi operative LILO — derivate dalla fonte NAP unica (`nap.ts`).
 * Con impostazioni DB: usare `resolveSedeNoleggio` / `resolveSedeAutolavaggio`.
 */

import {
  NAP_AUTOLAVAGGIO_ADDRESS_FULL,
  NAP_AUTOLAVAGGIO_MAPS_QUERY,
  NAP_AUTOLAVAGGIO_NOTE,
  NAP_NOLEGGIO_ADDRESS_FULL,
  NAP_NOLEGGIO_MAPS_QUERY,
  NAP_ORARI_AUTOLAVAGGIO,
  NAP_ORARI_AUTOLAVAGGIO_RIGHE,
  NAP_ORARI_NOLEGGIO,
  NAP_ORARI_NOLEGGIO_RIGHE,
  NAP_PHONE_DISPLAY,
  NAP_SERVIZI_AUTOLAVAGGIO,
  NAP_SERVIZI_NOLEGGIO,
  formatPhoneDisplay,
} from "@/lib/nap";
import type { ImpostazioniSito } from "@/types/impostazioni";

function formatOrariLines(testo: string): string[] {
  return testo
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);
}

export interface SedeOperativa {
  id: "noleggio" | "autolavaggio";
  titolo: string;
  indirizzo: string;
  /** Nota sotto l'indirizzo (es. ingresso/uscita). */
  indirizzoNota?: string;
  /** Query dedicata per embed/link Google Maps. */
  mapsQuery: string;
  mapsLabel: string;
  telefono: string;
  servizi: readonly string[];
  /** Righe orari già formattate per OrariList. */
  orariRighe: readonly string[];
  /** Stringa multi-riga per sync impostazioni_sito. */
  orariTesto: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export const SEDE_NOLEGGIO: SedeOperativa = {
  id: "noleggio",
  titolo: "Lilo Autonoleggio e Furgoni Trieste",
  indirizzo: NAP_NOLEGGIO_ADDRESS_FULL,
  mapsQuery: NAP_NOLEGGIO_MAPS_QUERY,
  mapsLabel: "LILO Autonoleggio Trieste",
  telefono: NAP_PHONE_DISPLAY,
  servizi: NAP_SERVIZI_NOLEGGIO,
  orariRighe: NAP_ORARI_NOLEGGIO_RIGHE,
  orariTesto: NAP_ORARI_NOLEGGIO,
  ctaHref: "/flotta",
  ctaLabel: "Vedi la flotta",
};

export const SEDE_AUTOLAVAGGIO: SedeOperativa = {
  id: "autolavaggio",
  titolo: "Lilo Autolavaggio Trieste",
  indirizzo: NAP_AUTOLAVAGGIO_ADDRESS_FULL,
  indirizzoNota: NAP_AUTOLAVAGGIO_NOTE,
  mapsQuery: NAP_AUTOLAVAGGIO_MAPS_QUERY,
  mapsLabel: "LILO Autolavaggio Trieste",
  telefono: NAP_PHONE_DISPLAY,
  servizi: NAP_SERVIZI_AUTOLAVAGGIO,
  orariRighe: NAP_ORARI_AUTOLAVAGGIO_RIGHE,
  orariTesto: NAP_ORARI_AUTOLAVAGGIO,
  ctaHref: "/autolavaggio",
  ctaLabel: "Scopri l'autolavaggio",
};

export const SEDI_OPERATIVE = [SEDE_NOLEGGIO, SEDE_AUTOLAVAGGIO] as const;

function firstAddressLine(raw: string | null | undefined, fallback: string): string {
  const line = (raw ?? "")
    .split("\n")
    .map((r) => r.trim())
    .find(Boolean);
  return line || fallback;
}

function noteFromIndirizzo(raw: string | null | undefined, fallback?: string): string | undefined {
  const lines = (raw ?? "")
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);
  if (lines.length > 1) return lines.slice(1).join(" — ");
  return fallback;
}

/** Sede noleggio: overlay da `impostazioni_sito` con fallback NAP. */
export function resolveSedeNoleggio(
  impostazioni?: Pick<
    ImpostazioniSito,
    | "orari_noleggio"
    | "telefono_noleggio"
    | "indirizzo_noleggio"
    | "servizi_noleggio_lista"
  > | null,
): SedeOperativa {
  if (!impostazioni) return SEDE_NOLEGGIO;
  const orari =
    impostazioni.orari_noleggio?.trim() || NAP_ORARI_NOLEGGIO;
  const serviziRaw = impostazioni.servizi_noleggio_lista?.trim();
  const servizi = serviziRaw
    ? serviziRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : SEDE_NOLEGGIO.servizi;
  return {
    ...SEDE_NOLEGGIO,
    indirizzo: firstAddressLine(
      impostazioni.indirizzo_noleggio,
      SEDE_NOLEGGIO.indirizzo,
    ),
    telefono: formatPhoneDisplay(
      impostazioni.telefono_noleggio || SEDE_NOLEGGIO.telefono,
    ),
    orariTesto: orari,
    orariRighe: formatOrariLines(orari),
    servizi,
  };
}

/** Sede autolavaggio: overlay da `impostazioni_sito` con fallback NAP. */
export function resolveSedeAutolavaggio(
  impostazioni?: Pick<
    ImpostazioniSito,
    | "orari_autolavaggio"
    | "telefono_autolavaggio"
    | "indirizzo_autolavaggio"
    | "autolavaggio_lista_servizi"
  > | null,
): SedeOperativa {
  if (!impostazioni) return SEDE_AUTOLAVAGGIO;
  const orari =
    impostazioni.orari_autolavaggio?.trim() || NAP_ORARI_AUTOLAVAGGIO;
  const serviziRaw = impostazioni.autolavaggio_lista_servizi?.trim();
  const servizi = serviziRaw
    ? serviziRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : SEDE_AUTOLAVAGGIO.servizi;
  return {
    ...SEDE_AUTOLAVAGGIO,
    indirizzo: firstAddressLine(
      impostazioni.indirizzo_autolavaggio,
      SEDE_AUTOLAVAGGIO.indirizzo,
    ),
    indirizzoNota: noteFromIndirizzo(
      impostazioni.indirizzo_autolavaggio,
      SEDE_AUTOLAVAGGIO.indirizzoNota,
    ),
    telefono: formatPhoneDisplay(
      impostazioni.telefono_autolavaggio || SEDE_AUTOLAVAGGIO.telefono,
    ),
    orariTesto: orari,
    orariRighe: formatOrariLines(orari),
    servizi,
  };
}
