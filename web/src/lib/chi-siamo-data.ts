import type { AiFaqItem } from "@/types/veicolo";

export const GOLD = "#D4AF37";
/** Testo oro su sfondo chiaro (WCAG AA). */
export const GOLD_TEXT = "#A16207";

export interface TimelineEvent {
  year: string;
  title: string;
  body: string;
  bullets?: string[];
}

export interface InstitutionalClient {
  name: string;
  subtitle?: string;
  cig?: string;
  href?: string;
  linkLabel?: string;
}

export interface ValueItem {
  title: string;
  description: string;
}

export interface WhyChooseItem {
  title: string;
  description: string;
}

export const CHI_SIAMO_HERO = {
  title: "LILO SRL: 20 ANNI DI ESPERIENZA NEI TRASPORTI E SERVIZI A TRIESTE",
  subtitle: "La Nostra Storia: Dal 2003 a Oggi",
};

export const TIMELINE: TimelineEvent[] = [
  {
    year: "2003",
    title: "Gli Inizi: LILO AUTOTRASPORTI",
    body: "La storia di LILO inizia nel 2003 a Trieste, quando nasce LILO AUTOTRASPORTI (P.IVA 01065680322) con un unico furgone e una grande ambizione: offrire servizi di trasporto professionale e affidabile. Fin dal primo giorno, la nostra azienda ha collaborato con BRT Corriere presso la filiale di Trieste.",
    bullets: [
      "Trasporti per conto terzi",
      "Traslochi professionali",
      "Sgomberi completi",
    ],
  },
  {
    year: "2006",
    title: "La Prima Espansione",
    body: "Grazie alla fiducia dei clienti e alla qualità del servizio, LILO AUTOTRASPORTI compie il primo grande passo: l’acquisto di 3 nuovi automezzi che portano la flotta a 6 furgoni, consolidando la partnership con BRT Trieste.",
  },
  {
    year: "2009–2016",
    title: "Partner Esclusivo SDA Express Courier e UPS",
    body: "LILO AUTOTRASPORTI diventa fornitore ufficiale di SDA Express Courier, conquistando l’esclusiva territoriale per i servizi di consegna nella città di Trieste e provincia, con gestione anche delle consegne UPS attraverso la rete SDA.",
    bullets: [
      "Flotta ampliata fino a 78 automezzi",
      "Team di oltre 80 professionisti tra dipendenti e collaboratori",
      "Copertura capillare di tutto il territorio triestino",
      "7 anni di partnership consolidata (2009-2016)",
    ],
  },
  {
    year: "2012–2015",
    title: "Distribuzione Farmaceutica con UNICO",
    body: "Parallelamente ai servizi corriere, LILO S.r.l. si distingue nel settore farmaceutico collaborando con UNICO – La Farmacia dei Farmacisti per la distribuzione di medicinali a Trieste e provincia, ottenendo l’esclusiva territoriale.",
  },
  {
    year: "2014",
    title: "La Trasformazione in LILO SRL",
    body: "Per rispondere alle crescenti esigenze del mercato, LILO AUTOTRASPORTI si trasforma in LILO S.R.L. (P.IVA 01249580323), mantenendo tutti i contratti e le partnership esistenti e rafforzando la struttura aziendale.",
  },
  {
    year: "2017",
    title: "Diversificazione e Nuovi Servizi",
    body: "Pur mantenendo il DNA nel settore trasporti, LILO S.R.L. amplia la propria offerta investendo in nuovi servizi integrati per privati, aziende ed enti.",
    bullets: [
      "Autolavaggio professionale servito – tecnologia all’avanguardia",
      "Noleggio veicoli – furgoni, pulmini e auto per ogni esigenza",
      "Vendita autoveicoli – consulenza e assistenza completa",
    ],
  },
];

export const STATS = [
  "Flotta moderna a noleggio a Trieste",
  "20+ anni di esperienza nel settore",
  "Partner certificato di enti pubblici e grandi aziende",
  "Ex fornitore esclusivo SDA e UPS per Trieste",
];

export const NOLEGGIO_CATEGORIES = [
  "Furgoni piccoli – ideali per traslochi urbani e consegne cittadine",
  "Furgoni medi – perfetti per trasporti aziendali e traslochi residenziali",
  "Furgoni grandi – per traslochi completi e trasporti voluminosi",
  "Furgoni XL – massima capacità di carico per esigenze professionali",
  "Pulmini 9 posti – per viaggi di gruppo, eventi e trasferimenti",
  "Auto – soluzioni di mobilità flessibile",
];

export const NOLEGGIO_BENEFITS = [
  "Tariffe competitive e trasparenti",
  "Mezzi sempre controllati e certificati",
  "Disponibilità immediata",
  "Cauzione flessibile: contanti in città, carta fuori città",
  "Assistenza personalizzata",
];

export const AUTOLAVAGGIO_FEATURES = [
  "Tunnel di lavaggio ultima generazione",
  "Sistema a riciclo totale dell’acqua – sostenibilità ambientale",
  "Spazzole antigraffio di alta qualità",
  "Prodotti professionali certificati",
];

export const AUTOLAVAGGIO_SERVICES = [
  "Lavaggio esterno con tunnel",
  "Lavaggio completo esterno + interno",
  "Lavaggio Full tappezzeria",
  "Sanificazione completa con ozono e vapore",
  "Lavaggio antibatterico",
  "Lucidatura e trattamenti cera",
  "Pulizia sottoscocca",
];

export const AUTOLAVAGGIO_SPECIALITA =
  "Il nostro servizio di lavaggio Full della tappezzeria e la sanificazione completa con ozono e vapore rappresentano l’eccellenza nella cura dell’abitacolo. Utilizziamo macchinari di ultima generazione e trattiamo ogni veicolo con la massima attenzione ai dettagli, garantendo un risultato professionale e duraturo.";

export const INSTITUTIONAL_CLIENTS: InstitutionalClient[] = [
  {
    name: "Esercito Italiano",
    subtitle: "Comando Forze Operative Nord",
    cig: "ZE733041EA",
    href: undefined,
    linkLabel: "Cliente istituzionale verificato",
  },
  {
    name: "Guardia di Finanza",
    subtitle: "Reparto TLA Friuli Venezia Giulia",
    cig: "B605720938",
    href: "https://www.gdf.gov.it/it/stazioni-appaltanti/bandi-di-gara/archivio/anno-2025/re-t-l-a-friuli-venezia-giulia/marzo/affidamento-del-servizio-di-n-10-lavaggi-per-i-mezzi/esiti/avviso-di-aggiudicazione.pdf",
    linkLabel: "Verifica online",
  },
  {
    name: "Prefettura / DIA",
    subtitle: "Direzione Investigativa Antimafia",
    href: undefined,
    linkLabel: "Cliente istituzionale verificato",
  },
  {
    name: "Aeronautica Militare",
    subtitle: "Sanificazione Mezzi Logistici",
    cig: "9201298F4D",
    href: "https://www.aeronautica.difesa.it/wp-content/uploads/Bandidigara/CIG_9201298F4D/CIG%209201298F4D%20Esito%20di%20Affidamento.pdf",
    linkLabel: "Verifica esito",
  },
  {
    name: "Marina Militare",
    subtitle: "Capitaneria di Porto Trieste",
    cig: "Z552F40FC1",
    href: undefined,
    linkLabel: "Cliente istituzionale verificato",
  },
  {
    name: "Comune di Trieste",
    subtitle: "Polizia Locale e Servizi Educativi",
    cig: "B43ED70965",
    href: "https://bandieconcorsi.comune.trieste.it/contenuti/allegati/Det_3152_2024.pdf",
    linkLabel: "Scarica determina",
  },
  {
    name: "Università di Trieste",
    subtitle: "Gestione Parco Automezzi",
    linkLabel: "Portale trasparenza",
  },
  {
    name: "OGS",
    subtitle: "Ist. Nazionale Oceanografia",
    cig: "Z1837B4C55",
    linkLabel: "Verifica pagamento",
  },
  {
    name: "ASUGI Trieste",
    subtitle: "Azienda Sanitaria Universitaria",
    cig: "B0E0C5F364",
    href: "https://asugi.sanita.fvg.it/export/sites/aas1/it/bandi-gara/_allegati/asugi/Servizi_TS/Esiti/2024_003_Verbale-1-SCAGS-ASUIT-2024-0002287.pdf",
    linkLabel: "Scarica verbale",
  },
  {
    name: "RAI / RAI Way",
    subtitle: "Servizio Lavaggio Mezzi Tecnici",
    cig: "Z6530E33D8",
    href: "https://eprocurement.raiway.it/PortaleAppalti/resources/appaltiavcp/2021/Z6530E33D8.xml",
    linkLabel: "Dati AVCP",
  },
  {
    name: "COSELAG",
    subtitle: "Consorzio Sviluppo Economico",
    cig: "B465935A55",
    href: "https://www.coselag.it/media/files/A00412/attachment/Affidamenti_alle_Imprese_2025_-_I_trimestre.pdf",
    linkLabel: "Esito 2025",
  },
  {
    name: "SAMER & CO. Spedizioni",
    subtitle: "Partner Logistico Internazionale — noleggio e cura flotta aziendale dal 2025",
  },
  {
    name: "ASP Italo Svevo",
    subtitle: "Servizi alla persona",
    cig: "B1C79E1EE5",
    href: undefined,
    linkLabel: "Cliente istituzionale verificato",
  },
];
export const PRIVATE_CLIENTS = ["Fincantieri", "Cartubi", "Orion", "E molti altri partner privati"];

export const VALUES: ValueItem[] = [
  {
    title: "Professionalità",
    description:
      "Oltre 20 anni di esperienza ci hanno insegnato che solo la massima professionalità garantisce la soddisfazione del cliente.",
  },
  {
    title: "Affidabilità",
    description:
      "Dalla collaborazione con BRT, SDA e UPS agli accordi con grandi enti pubblici, abbiamo costruito la nostra reputazione sulla fiducia.",
  },
  {
    title: "Sostenibilità",
    description:
      "Autolavaggio a riciclo totale, flotta moderna ed efficiente: il rispetto dell’ambiente è parte del nostro DNA.",
  },
  {
    title: "Innovazione",
    description:
      "Dalla logistica tradizionale ai servizi integrati di mobilità: ci evolviamo costantemente per servire meglio i nostri clienti.",
  },
  {
    title: "Territorio",
    description:
      "Nati a Trieste, per Trieste: conosciamo ogni strada, ogni esigenza del nostro territorio.",
  },
];

export const WHY_CHOOSE: WhyChooseItem[] = [
  {
    title: "Esperienza Consolidata",
    description:
      "20 anni nel settore trasporti e logistica, con partnership prestigiose come SDA Express Courier, UPS, BRT e UNICO Farmacia.",
  },
  {
    title: "Flotta Moderna e Numerosa",
    description:
      "Flotta moderna e controllata, revisionata e pronta all’uso: auto, pulmini e furgoni per ogni esigenza a Trieste.",
  },
  {
    title: "Servizi Integrati",
    description:
      "Dall’autolavaggio al noleggio, dalla vendita all’assistenza: tutto in un’unica struttura.",
  },
  {
    title: "Clienti Istituzionali",
    description:
      "La fiducia di Regione FVG, Università di Trieste, Porto di Trieste, Fincantieri e altri enti pubblici garantisce la nostra affidabilità.",
  },
  {
    title: "Sostenibilità Ambientale",
    description:
      "Tecnologie eco-friendly con sistema di riciclo dell’acqua e attenzione all’impatto ambientale.",
  },
  {
    title: "Prezzi Competitivi",
    description: "Tariffe trasparenti senza costi nascosti. Noleggio a partire da 40€.",
  },
  {
    title: "Assistenza Personalizzata",
    description:
      "Un team dedicato pronto ad aiutarti a trovare la soluzione perfetta per ogni esigenza.",
  },
];

export const MISSION_BULLETS = [
  "Massima professionalità",
  "Affidabilità certificata",
  "Rispetto per l’ambiente",
  "Attenzione al cliente",
];

export const MISSION_TEXT =
  "Essere il punto di riferimento a Trieste per mobilità, trasporti e servizi per autoveicoli, combinando l’esperienza ventennale nel settore logistico con servizi innovativi e sostenibili.";

export const VISION_TEXT =
  "Continuare a crescere come partner di fiducia per privati, aziende ed enti pubblici, ampliando i servizi e mantenendo gli standard qualitativi che ci hanno reso leader nel territorio triestino.";

export const CHI_SIAMO_FAQ: AiFaqItem[] = [
  {
    q: "Da quanti anni operate a Trieste?",
    a: "LILO S.r.l. opera dal 2003, con oltre 20 anni di esperienza nel settore trasporti e servizi automotive.",
  },
  {
    q: "Dove si trovano le vostre sedi?",
    a: "Abbiamo tre sedi operative a Trieste: la sede legale in Via De Coletti 7, l’autolavaggio in Via Giovanni Schiaparelli 21/A e l’autonoleggio in Viale Campi Elisi 38/B.",
  },
  {
    q: "Offrite servizi per aziende?",
    a: "Sì, lavoriamo con numerose aziende private ed enti pubblici, offrendo soluzioni personalizzate e contratti dedicati.",
  },
  {
    q: "È necessaria la carta di credito per il noleggio?",
    a: "Dipende dall’utilizzo. Per noleggi in città la cauzione è accettata anche in contanti (auto e furgoni). Per fuori città ed estero è richiesta carta di credito o debito. I pulmini 9 posti richiedono solo carta di credito (cauzione €500).",
  },
  {
    q: "Quanto costa la cauzione?",
    a: "Varia per categoria: €200 per furgoni piccoli, medi e grandi; €300 per auto e furgoni XL; €500 per pulmini 9 posti. L’importo viene restituito a fine noleggio salvo danni o addebiti previsti dal contratto.",
  },
  {
    q: "Quali mezzi avete disponibili per il noleggio?",
    a: "In flotta troviamo auto, pulmini 9 posti e furgoni da piccoli a XL. Le schede online mostrano i mezzi pubblicati; per disponibilità aggiornata contattaci o richiedi un preventivo.",
  },
  {
    q: "Avete esperienza nella logistica?",
    a: "Sì, siamo stati fornitori esclusivi per SDA Express Courier e UPS a Trieste dal 2009 al 2016, gestendo fino a 78 automezzi.",
  },
  {
    q: "Cosa include il servizio di sanificazione?",
    a: "La sanificazione combina ozono e vapore per eliminare batteri, virus, allergeni e cattivi odori dall’abitacolo, garantendo un ambiente salubre e igienizzato.",
  },
  {
    q: "Il lavaggio è ecologico?",
    a: "Sì, il nostro autolavaggio utilizza un sistema a riciclo totale dell’acqua, garantendo il massimo rispetto per l’ambiente.",
  },
];
