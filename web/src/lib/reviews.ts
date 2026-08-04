export interface Review {
  id: string;
  author: string;
  rating: number;
  /** Data come mostrata su Google (es. "6 mesi fa", "un anno fa"). */
  dateLabel: string;
  text: string;
  source: "Google";
}

/** Scheda Google Business — sede noleggio Viale Campi Elisi. */
export const GOOGLE_NOLEGGIO_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=LILO+S.R.L.+Viale+Campi+Elisi+38b+34143+Trieste";

/**
 * Recensioni reali dalla scheda Google Business Profile (sede noleggio).
 * dateLabel allineata a quanto mostrato su Google Maps.
 */
export const REVIEWS: Review[] = [
  {
    id: "google-christian-boccone",
    author: "Christian Boccone",
    rating: 5,
    dateLabel: "6 mesi fa",
    text: "Ho noleggiato un furgone per un trasloco e mi sono trovato davvero bene. Prenotazione online con successivo supporto dall'ufficio ben organizzato, di conseguenza al ritiro tutto veloce senza perdere tempo. Il mezzo era pulito e funzionava perfettamente, nessun problema durante tutto il giorno. Prezzi chiari fin da subito, niente sorprese sul conto finale. Il ragazzo che mi ha consegnato le chiavi è stato cordiale e mi ha fatto un rapido giro del mezzo per mostrarmi comandi e vano di carico. Riconsegna altrettanto veloce, hanno controllato il furgone e via. Servizio serio ed efficiente, lo consiglio senza problemi. La prossima volta che mi servirà un furgone saprò già dove andare.",
    source: "Google",
  },
  {
    id: "google-gian-lorenzo-montina",
    author: "Gian Lorenzo Montina",
    rating: 5,
    dateLabel: "9 mesi fa",
    text: "Ho noleggiato un furgone per ritiro mobile ikea a villesse, personale molto competente e disponibile, furgone in ottime condizioni, e prezzo super onesto. Pur avendo leggermente sforato i 100km compresi nel noleggio l'extra mi è stato gentilmente abbuonato. Consigliatissimi",
    source: "Google",
  },
  {
    id: "google-esmeralda-yryku",
    author: "Esmeralda Yryku",
    rating: 5,
    dateLabel: "un anno fa",
    text: "Servizio impeccabile e pulmino in condizioni eccellenti! Era praticamente nuovo, con meno di 20.000 km, e si guidava alla perfezione. Pulizia e comfort davvero al top, ideale sia per viaggi brevi che lunghi. Il personale è stato cordiale e disponibile, rendendo il processo di noleggio rapido e semplice. Sicuramente tornerò per i miei futuri noleggi!",
    source: "Google",
  },
  {
    id: "google-nicoletta-bucher",
    author: "Nicoletta Bucher",
    rating: 5,
    dateLabel: "3 anni fa",
    text: "Gentili, disponibili, precisi e ben organizzati, ottimi veicoli. Raccomandatissimi!",
    source: "Google",
  },
];

export function averageRating(): number {
  if (REVIEWS.length === 0) return 0;
  const sum = REVIEWS.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / REVIEWS.length) * 10) / 10;
}
