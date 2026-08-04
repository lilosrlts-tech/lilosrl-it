import { COMPANY } from "@/lib/constants";
import { telefonoE164 } from "@/lib/impostazioni";

export const DESTINAZIONI_PREVENTIVO = [
  { value: "trieste-citta", label: "Trieste città" },
  { value: "fuori-citta", label: "Fuori città / Italia" },
  { value: "estero", label: "Estero" },
] as const;

export type DestinazionePreventivo = (typeof DESTINAZIONI_PREVENTIVO)[number]["value"];

export function labelDestinazionePreventivo(value: string): string {
  return (
    DESTINAZIONI_PREVENTIVO.find((d) => d.value === value)?.label ?? value
  );
}

export const INFO_ORARI_NOLEGGIO =
  "Giornata contrattuale 08:30 → 08:30 del giorno successivo. Sabato e domenica esclusi dalla fascia standard.";

export function buildPreventivoWhatsAppUrl(params: {
  telefonoCliente: string;
  kmPrevisti: string | number;
  destinazione: string;
  veicoloName: string;
  dataRitiro?: string;
  dataRiconsegna?: string;
  nome?: string;
  accessoriLine?: string;
  note?: string;
}): string {
  const digits = telefonoE164(COMPANY.phone).replace(/\D/g, "");
  const destinazione = labelDestinazionePreventivo(params.destinazione);
  const lines = [
    "Ciao, vorrei un preventivo noleggio.",
    "",
    params.nome?.trim() ? `Nome: ${params.nome.trim()}` : null,
    `Telefono: ${String(params.telefonoCliente).trim()}`,
    `Km previsti (totale): ${String(params.kmPrevisti).trim()} km`,
    `Destinazione: ${destinazione}`,
    `Veicolo: ${params.veicoloName}`,
    `Data ritiro: ${params.dataRitiro || "da definire"}`,
    `Data riconsegna: ${params.dataRiconsegna || "da definire"}`,
    params.accessoriLine ? `Accessori: ${params.accessoriLine}` : null,
    params.note?.trim() ? `Note: ${params.note.trim()}` : null,
    "",
    `Nota: ${INFO_ORARI_NOLEGGIO}`,
  ].filter((line): line is string => line != null);

  return `https://wa.me/${digits}?text=${encodeURIComponent(lines.join("\n"))}`;
}
