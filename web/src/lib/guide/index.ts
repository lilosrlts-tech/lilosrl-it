import type { GuideArticle } from "@/lib/guide/types";
import {
  PREZZO_IVA_DICITURA,
  TARIFFE_CATEGORIA,
} from "@/lib/tariffe-categoria";
import { NAP_NOLEGGIO_STREET, NAP_PHONE_DISPLAY } from "@/lib/nap";

const pic = TARIFFE_CATEGORIA["furgoni-piccoli"].prezzoGiornaliero;
const med = TARIFFE_CATEGORIA["furgoni-medi"].prezzoGiornaliero;
const graCitta = TARIFFE_CATEGORIA["furgoni-grandi-citta"].prezzoGiornaliero;
const gra = TARIFFE_CATEGORIA["furgoni-grandi"].prezzoGiornaliero;
const xl = TARIFFE_CATEGORIA["furgoni-xl"].prezzoGiornaliero;

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    slug: "quale-furgone-scegliere-per-trasloco",
    title: "Quale furgone scegliere per un trasloco?",
    metaTitle: "Quale furgone per un trasloco a Trieste | Guida LILO",
    metaDescription:
      "Come scegliere il furgone per monolocale, bilocale o trilocale a Trieste: categorie LILO, volumi indicativi e quando chiedere conferma in sede.",
    inBreve:
      "La scelta del furgone per un trasloco dipende soprattutto da volume del carico, dimensioni dei pezzi più grandi e se ti muovi in città o fuori. In LILO le categorie vanno dai furgoni medi/grandi fino agli XL; per un monolocale spesso bastano i grandi (anche uso città), mentre per 3+ locali conviene valutare un XL. Le misure esatte sono in scheda veicolo: se hai dubbi, chiedici conferma prima del ritiro.",
    publishedAt: "2026-08-31",
    updatedAt: "2026-08-31",
    sections: [
      {
        h2: "Parti dal carico, non dal modello",
        paragraphs: [
          "Prima di fissare un mezzo, elenca i pezzi più ingombranti (armadi, divani, elettrodomestici) e stima se farai uno o più viaggi. Un furgone “troppo piccolo” costa di più in tempo e km; uno “troppo grande” può essere inutilmente impegnativo in centro.",
          `A Trieste il ritiro LILO è in ${NAP_NOLEGGIO_STREET}: in sede possiamo confrontare il tuo elenco con i vani reali della flotta.`,
        ],
      },
      {
        h2: "Indicazioni per tipologia di trasloco",
        paragraphs: [
          "Queste sono indicazioni di orientamento, non misure certificati del tuo appartamento. Usa il wizard «Cosa trasporti?» e le schede flotta per i dati di volume e altezza vano.",
        ],
        bullets: [
          "Monolocale / stanza: spesso furgoni grandi o grandi uso città",
          "Bilocale: grandi / XL a seconda di mobili e numero di viaggi",
          "Trilocale o più: XL o più viaggi con grande",
        ],
      },
      {
        h2: "Cosa verificare in scheda",
        paragraphs: [
          "Controlla volume (m³), lunghezza/altezza/larghezza vano se presenti, portata e tariffa giornaliera. Se un dato non è pubblicato, non inventarlo: chiedi in sede.",
        ],
      },
    ],
    faq: [
      {
        q: "Posso fare un trasloco in un giorno?",
        a: "Dipende da distanza, piano/scale e volume. Molti clienti completano monolocali o bilocali in giornata; per carichi grandi pianifica tempo extra o un secondo viaggio.",
      },
      {
        q: "Serve un mezzo con sponda o solo vano chiuso?",
        a: "La flotta LILO è a vano chiuso. Per carichi particolari (moto) valuta i mezzi con rampa dedicata o l’extra rampa dove disponibile.",
      },
    ],
    relatedLinks: [
      { href: "/cosa-trasporti", label: "Wizard Cosa trasporti?" },
      { href: "/flotta/furgoni-grandi", label: "Furgoni grandi" },
      { href: "/flotta/furgoni-xl", label: "Furgoni XL" },
      { href: "/noleggio-furgoni-trieste", label: "Noleggio furgoni a Trieste" },
    ],
    ctaPrimary: { href: "/cosa-trasporti", label: "Trova il furgone adatto" },
    ctaSecondary: { href: "/contatti", label: "Chiedi conferma in sede" },
  },
  {
    slug: "quanto-costa-noleggiare-furgone-trieste",
    title: "Quanto costa noleggiare un furgone a Trieste?",
    metaTitle: "Costo noleggio furgone Trieste | Tariffe LILO",
    metaDescription: `Tariffe giornaliere indicative LILO a Trieste (a partire da): piccoli €${pic}, medi €${med}, grandi €${gra}. ${PREZZO_IVA_DICITURA}.`,
    inBreve: `Presso LILO S.r.l. a Trieste le tariffe giornaliere di listino per i furgoni partono da circa €${pic}/giorno per i piccoli, €${med} per i medi, €${graCitta} per i grandi uso città, €${gra} per i grandi e €${xl} per gli XL (${PREZZO_IVA_DICITURA}). Il prezzo finale dipende da durata, chilometri, categoria e disponibilità: per un preventivo preciso usa la scheda veicolo o contattaci.`,
    publishedAt: "2026-08-31",
    updatedAt: "2026-08-31",
    sections: [
      {
        h2: "Listino di riferimento (a partire da)",
        paragraphs: [
          "I valori sotto sono le tariffe di categoria pubblicate sul sito. I singoli veicoli possono avere listino o promo durata diverse: guarda sempre la scheda.",
        ],
        bullets: [
          `Furgoni piccoli: da €${pic}/giorno`,
          `Furgoni medi: da €${med}/giorno`,
          `Furgoni grandi (uso città): da €${graCitta}/giorno`,
          `Furgoni grandi: da €${gra}/giorno`,
          `Furgoni XL: da €${xl}/giorno`,
        ],
      },
      {
        h2: "Cosa può far variare il prezzo",
        paragraphs: [
          "Durata del noleggio, km inclusi della categoria, periodo (es. promo weekend se attiva), accessori (es. rampa) e cauzione. Non trattiamo il listino come prezzo “chiuso” senza date.",
        ],
      },
      {
        h2: "Dove vedere i prezzi aggiornati",
        paragraphs: [
          "Consulta la pagina tariffe e le schede flotta. Per un preventivo con date di ritiro/riconsegna usa il form in scheda o WhatsApp/telefono.",
        ],
      },
    ],
    faq: [
      {
        q: "I prezzi includono l’IVA?",
        a: `Sì, le tariffe di listino sul sito sono comunicate ${PREZZO_IVA_DICITURA}.`,
      },
      {
        q: "Posso noleggiare solo per un giorno?",
        a: "Sì, il noleggio giornaliero è lo standard. Per weekend o periodi più lunghi chiedi disponibilità e eventuali promo durata.",
      },
    ],
    relatedLinks: [
      { href: "/tariffe-noleggio-furgoni-trieste", label: "Listino tariffe" },
      { href: "/flotta", label: "Flotta" },
      { href: "/noleggio-furgoni-trieste", label: "Noleggio furgoni Trieste" },
    ],
    ctaPrimary: {
      href: "/tariffe-noleggio-furgoni-trieste",
      label: "Vedi il listino",
    },
    ctaSecondary: { href: "/contatti", label: "Richiedi preventivo" },
  },
  {
    slug: "che-patente-serve-per-furgone",
    title: "Che patente serve per guidare un furgone a noleggio?",
    metaTitle: "Patente per furgone a noleggio | LILO Trieste",
    metaDescription:
      "Per i furgoni e i pulmini 9 posti della flotta LILO a Trieste di norma basta la patente B, salvo indicazioni diverse di legge o di contratto. Verifica sempre in sede.",
    inBreve:
      "Per i furgoni della flotta LILO a Trieste, nella pratica commerciale ordinaria è sufficiente la patente B, come per i pulmini 9 posti pubblicati. Restano ferme le norme del Codice della strada e le condizioni del contratto di noleggio: in caso di dubbi (massa, patente speciale, neopatentati) chiedi conferma in sede prima della prenotazione.",
    publishedAt: "2026-08-31",
    updatedAt: "2026-08-31",
    sections: [
      {
        h2: "Cosa diciamo oggi sul sito",
        paragraphs: [
          "Nelle FAQ delle categorie pulmini indichiamo che per i mezzi 9 posti della nostra flotta è sufficiente la patente B, salvo diverse indicazioni di legge o del contratto. Lo stesso approccio vale per i furgoni: non pubblichiamo requisiti inventati oltre a quanto verificabile in sede.",
        ],
      },
      {
        h2: "Cosa portare al ritiro",
        paragraphs: [
          `Documento di identità, patente in corso di validità e quanto richiesto per la cauzione della categoria. Ritiro in ${NAP_NOLEGGIO_STREET}, Trieste. Telefono: ${NAP_PHONE_DISPLAY}.`,
        ],
      },
    ],
    faq: [
      {
        q: "I neopatentati possono noleggiare?",
        a: "Dipende da veicolo, massa e policy assicurativa/contrattuale. Contattaci con il modello scelto: ti confermiamo se è noleggiabile.",
      },
    ],
    relatedLinks: [
      { href: "/flotta/pulmini-9-posti", label: "Pulmini 9 posti" },
      { href: "/flotta", label: "Flotta" },
      { href: "/contatti", label: "Contatti" },
    ],
    ctaPrimary: { href: "/contatti", label: "Verifica in sede" },
    ctaSecondary: { href: "/flotta", label: "Scegli un veicolo" },
  },
  {
    slug: "quanti-metri-cubi-servono-per-trasloco",
    title: "Quanti metri cubi servono per un trasloco?",
    metaTitle: "Metri cubi per trasloco: guida pratica | LILO",
    metaDescription:
      "Orientamento sui m³ per monolocale, bilocale e trilocale e come confrontarli con i volumi in scheda dei furgoni LILO a Trieste.",
    inBreve:
      "Non esiste un numero unico di metri cubi per ogni trasloco: contano arredi, imballi e se smonti i mobili. Come ordine di grandezza, molti monolocali stanno su volumi da furgone grande; bilocali e trilocali richiedono grandi/XL o più viaggi. Confronta sempre i m³ pubblicati nella scheda veicolo LILO e, se il carico è al limite, chiedi conferma.",
    publishedAt: "2026-08-31",
    updatedAt: "2026-08-31",
    sections: [
      {
        h2: "Perché i m³ da soli non bastano",
        paragraphs: [
          "Un armadio alto può richiedere altezza vano anche se il volume totale “sembra” sufficiente. Divani e elettrodomestici vincolano lunghezza e aperture. Per questo il wizard LILO considera anche altezza vano quando il dato è in scheda.",
        ],
      },
      {
        h2: "Come usare i dati LILO",
        paragraphs: [
          "Apri le categorie furgoni, confronta i volumi dichiarati sui modelli e usa «Cosa trasporti?» per uno scenario (frigo, armadio, trasloco). Se un veicolo non ha m³ in scheda, non assumere un valore: scegline un altro o chiamaci.",
        ],
      },
    ],
    faq: [
      {
        q: "I metri cubi in scheda sono netti di carico?",
        a: "Pubblichiamo i dati di scheda/OEM disponibili. Restano indicazioni di orientamento: forma del vano e imballi influenzano la capacità reale.",
      },
    ],
    relatedLinks: [
      { href: "/cosa-trasporti", label: "Cosa trasporti?" },
      { href: "/flotta/furgoni-medi", label: "Furgoni medi" },
      { href: "/guide/quale-furgone-scegliere-per-trasloco", label: "Guida trasloco" },
    ],
    ctaPrimary: { href: "/cosa-trasporti", label: "Confronta i furgoni" },
    ctaSecondary: { href: "/flotta", label: "Vedi la flotta" },
  },
  {
    slug: "furgone-per-frigorifero",
    title: "Quale furgone scegliere per trasportare un frigorifero?",
    metaTitle: "Furgone per frigorifero a Trieste | LILO",
    metaDescription:
      "Per un frigo in piedi serve vano alto e volume adeguato. Guida LILO: categorie consigliate e verifica misure in scheda a Trieste.",
    inBreve:
      "Per trasportare un frigorifero in piedi serve soprattutto altezza del vano e spazio per caricarlo senza inclinazioni pericolose. In LILO lo scenario «Frigorifero» orienta verso furgoni medi o grandi (anche uso città). Misura altezza e profondità del tuo elettrodomestico e confrontale con i dati in scheda; se mancano, chiedi conferma al numero della sede.",
    publishedAt: "2026-08-31",
    updatedAt: "2026-08-31",
    sections: [
      {
        h2: "Cosa controllare prima del noleggio",
        paragraphs: [
          "Altezza del frigo (e se ha piedini/imballo), larghezza porta di casa, e se lo trasporterai legato in piedi. Non forzare il carico: meglio un vano più alto.",
        ],
        bullets: [
          "Usa lo scenario Frigorifero in Cosa trasporti?",
          "Confronta altezza vano in scheda quando pubblicata",
          "In dubbio: medi / grandi, non i più compatti",
        ],
      },
      {
        h2: "Link utili",
        paragraphs: [
          "Dal wizard puoi aprire direttamente le schede consigliate. Per listino e disponibilità passa da tariffe e contatti.",
        ],
      },
    ],
    faq: [
      {
        q: "Posso stendere il frigo nel furgone?",
        a: "Dipende dal modello dell’elettrodomestico e dalle istruzioni del produttore. In generale conviene trasportarlo in piedi se il vano lo permette: chiedici se hai dubbi sul mezzo.",
      },
    ],
    relatedLinks: [
      { href: "/cosa-trasporti", label: "Scenario frigorifero" },
      { href: "/flotta/furgoni-medi", label: "Furgoni medi" },
      { href: "/flotta/furgoni-grandi", label: "Furgoni grandi" },
    ],
    ctaPrimary: { href: "/cosa-trasporti", label: "Apri il wizard" },
    ctaSecondary: { href: "/contatti", label: "Chiedi conferma" },
  },
];

export function getAllGuides(): GuideArticle[] {
  return GUIDE_ARTICLES;
}

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDE_ARTICLES.find((g) => g.slug === slug);
}

export function getGuideSlugs(): string[] {
  return GUIDE_ARTICLES.map((g) => g.slug);
}
