/**
 * Fonte unica NAP (Name / Address / Phone) + orari operativi LILO.
 *
 * - UI card sedi, DEMO_IMPOSTAZIONI, migration Supabase e fallback COMPANY
 *   devono allinearsi a questi valori (allineati alle schede Google Business).
 * - La sede legale resta distinta (`COMPANY.legalAddress`).
 * - In produzione i valori live possono arrivare da `impostazioni_sito`;
 *   se il DB diverge, aggiornare il DB (non reintrodurre stringhe sparse).
 */

export const NAP_PHONE_DISPLAY = "040 2471720" as const;
export const NAP_PHONE_DIGITS = "0402471720" as const;
export const NAP_PHONE_E164 = "+390402471720" as const;

export const NAP_EMAIL = "info@lilosrl.it" as const;

/** Indirizzo operativo noleggio (ritiro / riconsegna) — forma canonica display. */
export const NAP_NOLEGGIO_STREET = "Viale Campi Elisi 38/b" as const;
export const NAP_NOLEGGIO_CITY = "Trieste" as const;
export const NAP_NOLEGGIO_POSTAL = "34143" as const;
export const NAP_NOLEGGIO_REGION = "Friuli-Venezia Giulia" as const;
export const NAP_NOLEGGIO_COUNTRY = "IT" as const;

export const NAP_NOLEGGIO_ADDRESS_FULL =
  `${NAP_NOLEGGIO_STREET}, ${NAP_NOLEGGIO_POSTAL} ${NAP_NOLEGGIO_CITY} (TS)` as const;

export const NAP_NOLEGGIO_MAPS_QUERY = `${NAP_NOLEGGIO_STREET}, ${NAP_NOLEGGIO_CITY}` as const;

export const NAP_AUTOLAVAGGIO_STREET = "Via Giovanni Schiaparelli 21/a" as const;
export const NAP_AUTOLAVAGGIO_ADDRESS_FULL =
  `${NAP_AUTOLAVAGGIO_STREET}, ${NAP_NOLEGGIO_POSTAL} ${NAP_NOLEGGIO_CITY} (TS)` as const;
export const NAP_AUTOLAVAGGIO_NOTE =
  "Ingresso da Via Schiaparelli 21/a — Uscita su Via G. De Coletti 7" as const;
export const NAP_AUTOLAVAGGIO_MAPS_QUERY =
  `${NAP_AUTOLAVAGGIO_STREET}, ${NAP_NOLEGGIO_CITY}` as const;

/** Orari GMB-aligned (noleggio). */
export const NAP_ORARI_NOLEGGIO_RIGHE = [
  "Lunedì – Venerdì: 08:30 – 12:30 / 15:00 – 17:30",
  "Sabato: 08:30 – 12:30",
  "Domenica: Chiuso",
] as const;

export const NAP_ORARI_NOLEGGIO = NAP_ORARI_NOLEGGIO_RIGHE.join("\n");

export const NAP_ORARI_AUTOLAVAGGIO_RIGHE = [
  "Lunedì – Sabato: 09:00 – 13:00 / 14:00 – 18:30",
  "Domenica: Chiuso",
] as const;

export const NAP_ORARI_AUTOLAVAGGIO = NAP_ORARI_AUTOLAVAGGIO_RIGHE.join("\n");

export const NAP_SERVIZI_NOLEGGIO = [
  "Noleggio Furgoni (S, M, L, XL)",
  "Noleggio Autovetture e Utilitarie",
  "Noleggio Pulmini 9 Posti",
  "Ritiro e Consegna Veicoli in Sede",
] as const;

export const NAP_SERVIZI_AUTOLAVAGGIO = [
  "Lavaggio Completo Interno ed Esterno",
  "Sanificazione Abitacolo",
  "Lavaggio e Cura Tappezzeria",
  "Asciugatura Professionale e Trattamenti Carrozzeria",
] as const;

/** Display leggibile da qualsiasi formato telefono (spazi / +39 / cifre). */
export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const national =
    digits.startsWith("39") && digits.length >= 12
      ? digits.slice(2)
      : digits;
  if (national.length === 10 && national.startsWith("0")) {
    return `${national.slice(0, 3)} ${national.slice(3)}`;
  }
  return phone.trim() || NAP_PHONE_DISPLAY;
}

/** Display con prefisso internazionale (navbar / CTA). */
export function formatPhoneDisplayIntl(phone: string): string {
  const national = formatPhoneDisplay(phone);
  if (national.startsWith("+")) return national;
  return `+39 ${national}`;
}
