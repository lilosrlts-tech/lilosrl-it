/**
 * Dati canonici sedi operative LILO — usati dalle card uniformi (Contatti, Home, Chi Siamo, Autolavaggio).
 * Orari allineati alle schede Google Business.
 */
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
  indirizzo: "Viale Campi Elisi 38/b, 34143 Trieste (TS)",
  mapsQuery: "Viale Campi Elisi 38/b, Trieste",
  mapsLabel: "LILO Autonoleggio Trieste",
  telefono: "040 2471720",
  servizi: [
    "Noleggio Furgoni (S, M, L, XL)",
    "Noleggio Autovetture e Utilitarie",
    "Noleggio Pulmini 9 Posti",
    "Ritiro e Consegna Veicoli in Sede",
  ],
  orariRighe: [
    "Lunedì – Venerdì: 08:30 – 12:30 / 15:00 – 17:30",
    "Sabato: 08:30 – 12:30",
    "Domenica: Chiuso",
  ],
  orariTesto:
    "Lunedì – Venerdì: 08:30 – 12:30 / 15:00 – 17:30\nSabato: 08:30 – 12:30\nDomenica: Chiuso",
  ctaHref: "/flotta",
  ctaLabel: "Vedi la flotta",
};

export const SEDE_AUTOLAVAGGIO: SedeOperativa = {
  id: "autolavaggio",
  titolo: "Lilo Autolavaggio Trieste",
  indirizzo: "Via Giovanni Schiaparelli 21/a, 34143 Trieste (TS)",
  indirizzoNota: "Ingresso da Via Schiaparelli 21/a — Uscita su Via G. De Coletti 7",
  mapsQuery: "Via Giovanni Schiaparelli 21/a, Trieste",
  mapsLabel: "LILO Autolavaggio Trieste",
  telefono: "040 2471720",
  servizi: [
    "Lavaggio Completo Interno ed Esterno",
    "Sanificazione Abitacolo",
    "Lavaggio e Cura Tappezzeria",
    "Asciugatura Professionale e Trattamenti Carrozzeria",
  ],
  orariRighe: [
    "Lunedì – Sabato: 09:00 – 13:00 / 14:00 – 18:30",
    "Domenica: Chiuso",
  ],
  orariTesto: "Lunedì – Sabato: 09:00 – 13:00 / 14:00 – 18:30\nDomenica: Chiuso",
  ctaHref: "/autolavaggio",
  ctaLabel: "Scopri l'autolavaggio",
};

export const SEDI_OPERATIVE = [SEDE_NOLEGGIO, SEDE_AUTOLAVAGGIO] as const;
