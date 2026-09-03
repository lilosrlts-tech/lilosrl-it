import type { AiFaqItem } from "@/types/veicolo";
import type { TariffaCategoriaSlug } from "@/lib/tariffe-categoria";

export interface SeoLongContent {
  sections: Array<{ h2: string; paragraphs: string[] }>;
  faq: AiFaqItem[];
}

/** Contenuti editoriali (≥300 parole) per hub flotta — thin content Ahrefs. */
export const FLOTTA_CATEGORIA_LONG_CONTENT: Record<TariffaCategoriaSlug, SeoLongContent> = {
  auto: {
    sections: [
      {
        h2: "Quando conviene noleggiare un’auto a Trieste",
        paragraphs: [
          "Il noleggio auto a Trieste è la soluzione pratica se ti serve mobilità per pochi giorni senza impegnare il tuo veicolo. Privati, aziende e professionisti scelgono le nostre auto per sostituzioni temporanee, trasferte di lavoro, visite clienti in Friuli-Venezia Giulia o semplicemente per avere un mezzo affidabile in città e fuori porta. Tutte le auto della flotta LILO S.r.l. sono disponibili con ritiro in sede in Viale Campi Elisi 38/B.",
          "Le nostre auto sono pensate per l’uso urbano ed extraurbano: dimensioni maneggevoli, consumi contenuti e tariffe giornaliere IVA inclusa già indicate in scheda. Prima della consegna verifichiamo lo stato del veicolo insieme a te; al rientro controlliamo chilometri e condizioni. La cauzione e i km inclusi dipendono dalla categoria: trovi i dettagli aggiornati nel listino e nella scheda del singolo modello.",
        ],
      },
      {
        h2: "Dotazioni, ritiro e vantaggi del noleggio LILO",
        paragraphs: [
          "In sede ti spieghiamo in pochi minuti come funziona il contratto, cosa è incluso nella tariffa e come gestire eventuali extra (giorni aggiuntivi, chilometri oltre il forfait). Non serve una procedura complicata: documenti, firma, consegna delle chiavi. Se preferisci, puoi richiedere un preventivo online dalla scheda veicolo o contattarci via telefono e WhatsApp.",
          "Scegliere LILO S.r.l. significa affidarti a un’azienda di Trieste con esperienza pluriennale nel noleggio: flotta curata, prezzi trasparenti e assistenza locale. Confronta i modelli in catalogo nella griglia qui sotto, apri la scheda che ti interessa e richiedi subito il preventivo per le date di ritiro e riconsegna.",
        ],
      },
    ],
    faq: [
      {
        q: "Serve la carta di credito per noleggiare un’auto?",
        a: "Dipende dal veicolo e dalla cauzione richiesta. Contattaci: ti indichiamo le modalità di garanzia accettate per la categoria auto.",
      },
      {
        q: "Posso usare l’auto fuori da Trieste?",
        a: "Sì, salvo diverse indicazioni in contratto. La sede di ritiro e riconsegna resta Viale Campi Elisi a Trieste.",
      },
      {
        q: "Come scelgo il modello giusto?",
        a: "Guarda posti, bagagliaio e tariffa giornaliera in scheda. Se hai dubbi, il team LILO ti consiglia in base a percorso e durata.",
      },
    ],
  },
  "pulmini-9-posti": {
    sections: [
      {
        h2: "Pulmini 9 posti per gruppi, eventi e trasferimenti",
        paragraphs: [
          "I pulmini 9 posti a noleggio a Trieste sono ideali quando dovete muovere un gruppo senza dividervi su più auto: gite, eventi sportivi, cerimonie, transfer aeroportuali o trasferimenti aziendali. Un unico mezzo riduce costi, stress di coordinamento e rischi di ritardi. In flotta LILO trovi pulmini spaziosi con configurazione fino a 9 passeggeri, adatti sia a percorsi urbani sia a tratte più lunghe nella regione.",
          "Prima del ritiro ti consigliamo di verificare bagagli e attrezzature: con 9 posti lo spazio bagagli è comunque generoso rispetto a un’auto, ma per carichi voluminosi può essere più adatto un furgone. In scheda trovi posti, alimentazione e prezzo giornaliero IVA inclusa. Il ritiro avviene in Viale Campi Elisi 38/B: ti spieghiamo orari, cauzione e chilometri inclusi in modo chiaro.",
        ],
      },
      {
        h2: "Come funziona il noleggio e perché scegliere LILO",
        paragraphs: [
          "La procedura è semplice: scegli il pulmino, richiedi il preventivo con le date, prepara i documenti richiesti e ritira in sede. Al ritorno riconsegni il mezzo nello stesso indirizzo. Per gruppi ricorrenti (scuole, associazioni, aziende) possiamo aiutarti a pianificare più uscite con tariffe coerenti e disponibilità aggiornata.",
          "LILO S.r.l. opera a Trieste da anni: conosciamo le esigenze locali di famiglie, società sportive e aziende. Preferisci WhatsApp o telefono? Contattaci e ti indirizziamo sul modello più adatto al numero di passeggeri e al tipo di percorso.",
        ],
      },
    ],
    faq: [
      {
        q: "Quante persone entrano davvero?",
        a: "Fino a 9 posti (conducente incluso). Controlla sempre la scheda del singolo veicolo per la configurazione esatta.",
      },
      {
        q: "Posso caricare anche bagagli grandi?",
        a: "Sì, entro i limiti del vano bagagli. Per attrezzature molto voluminose valuta un furgone dedicato.",
      },
      {
        q: "Serve patente speciale?",
        a: "Per i pulmini 9 posti della nostra flotta è sufficiente la patente B, salvo diverse indicazioni di legge o del contratto.",
      },
    ],
  },
  "furgoni-piccoli": {
    sections: [
      {
        h2: "Furgoni piccoli: manovrabilità e vano di carico utile",
        paragraphs: [
          "I furgoni piccoli a noleggio a Trieste sono la scelta tipica per consegne urbane, piccoli traslochi, lavori artigianali e trasporti leggeri. Offrono un vano di carico pratico (spesso nell’ordine di pochi metri cubi, a seconda del modello) mantenendo dimensioni compatte: più facili da parcheggiare e da guidare in centro rispetto a un mezzo grande.",
          "In scheda trovi volume, portata e dimensioni indicative del vano quando disponibili, oltre alla tariffa giornaliera IVA inclusa. Prima del ritiro ti aiutiamo a capire se il carico (scatole, elettrodomestici medi, attrezzature) entra comodamente oppure se conviene salire di categoria. Il ritiro è in Viale Campi Elisi 38/B, con contratto chiaro su km e cauzione.",
        ],
      },
      {
        h2: "Dotazioni e vantaggi per lavoro e privati",
        paragraphs: [
          "Molti clienti usano i furgoni piccoli per e-commerce, falegnameria, idraulica, traslochi di monolocali o spostamenti di arredi leggeri. La flotta LILO è curata e aggiornata: scegli il modello, richiedi il preventivo online e concordi data e ora di ritiro. Se non sei sicuro del volume necessario, usa anche la guida «Cosa trasporti?» sul sito per un confronto rapido.",
          "Con LILO S.r.l. hai un referente locale a Trieste, non un call center remoto: assistenza diretta, prezzi trasparenti e possibilità di valutare accessori o alternative in flotta se il carico cambia all’ultimo momento.",
        ],
      },
    ],
    faq: [
      {
        q: "Quanto carico entra in un furgone piccolo?",
        a: "Dipende dal modello: controlla volume (m³) e portata (kg) in scheda. Per dubbi, scrivici cosa trasporti e ti consigliamo la categoria.",
      },
      {
        q: "È adatto al centro città?",
        a: "Sì: le dimensioni compatte lo rendono più maneggevole di un furgone medio o grande.",
      },
      {
        q: "Posso noleggiarlo per un solo giorno?",
        a: "Sì. Le tariffe sono giornaliere IVA inclusa; per più giorni chiedi un preventivo sulle date esatte.",
      },
    ],
  },
  "furgoni-medi": {
    sections: [
      {
        h2: "Furgoni medi: equilibrio tra capacità e facilità di guida",
        paragraphs: [
          "I furgoni medi a noleggio a Trieste coprono la fascia più richiesta da artigiani, negozianti e privati: abbastanza spazio per traslochi di media entità o consegne voluminose, senza arrivare alle dimensioni di un XL. Il vano di carico, a seconda del modello (es. L1H1), offre tipicamente un buon compromesso tra altezza interna, lunghezza e portata utile.",
          "Nella flotta LILO trovi anche versioni ibride, come il Ford Transit Custom Ibrido, pensate per chi vuole ridurre consumi e impatto in ambito urbano. Confronta le schede: volume in m³, portata in kg, alimentazione e tariffa giornaliera IVA inclusa. Il ritiro avviene in sede a Viale Campi Elisi 38/B con spiegazione di cauzione e chilometri inclusi.",
        ],
      },
      {
        h2: "Quando scegliere un medio invece di un piccolo o un grande",
        paragraphs: [
          "Se un furgone piccolo non basta per divani, elettrodomestici alti o più viaggi ripetuti, il medio riduce i giri e il tempo. Se invece ti serve il massimo volume per un trasloco completo, valuta grandi o XL. Il team LILO ti aiuta a decidere in base a elenco oggetti, piano e durata del noleggio.",
          "Richiedi il preventivo dalla scheda veicolo, oppure contattaci via telefono o WhatsApp. Operiamo a Trieste con tariffe trasparenti e flotta sempre aggiornata: aggiorniamo prezzi e disponibilità dalla gestione interna, così ciò che vedi sul sito è allineato al listino reale.",
        ],
      },
    ],
    faq: [
      {
        q: "Che differenza c’è tra Custom diesel e Custom ibrido?",
        a: "Stessa fascia di vano (circa 6 m³), ma l’ibrido punta a consumi ridotti e uso più efficiente in città. Confronta le schede dedicate.",
      },
      {
        q: "Posso caricare pallet o carichi alti?",
        a: "Verifica altezza e lunghezza vano in scheda. Per carichi speciali chiedici conferma prima della prenotazione.",
      },
      {
        q: "Come funziona la consegna?",
        a: "Ritiro e riconsegna in sede LILO a Trieste. Ti spieghiamo controlli, documentazione e orari al momento della prenotazione.",
      },
    ],
  },
  "furgoni-grandi": {
    sections: [
      {
        h2: "Furgoni grandi per traslochi e trasporti professionali",
        paragraphs: [
          "I furgoni grandi a noleggio a Trieste sono pensati per chi ha bisogno di volume serio: traslochi, logistica, trasporto merci e carichi che non entrano in un medio. Passo e altezza vano (configurazioni tipo L2H2 o superiori) aumentano capacità utile; in scheda trovi metri cubi, portata e prezzo giornaliero IVA inclusa quando pubblicati.",
          "Prima di prenotare, elenca i pezzi principali (mobili, elettrodomestici, scaffali) e valuta se ti serve anche accesso alto o lunghezza maggiore. LILO S.r.l. ti aiuta a scegliere tra grandi standard e altre categorie (uso città, XL) in base a percorso — città, autostrada, cantieri — e durata del noleggio. Ritiro in Viale Campi Elisi 38/B.",
        ],
      },
      {
        h2: "Procedure di ritiro e vantaggi locali",
        paragraphs: [
          "Al ritiro verifichiamo insieme lo stato del mezzo e ti consegniamo le informazioni essenziali su uso, chilometri e cauzione. Al rientro riconsegni nello stesso punto. Per aziende con fabbisogno ricorrente possiamo supportarti nella pianificazione di più giornate o mezzi alternativi in caso di picchi di lavoro.",
          "Affidarti a un noleggio locale a Trieste significa avere interlocutori rapidi e conoscenza del territorio. Apri le schede nella griglia, confronta i prezzi e richiedi il preventivo online oppure contattaci: ti rispondiamo con disponibilità reale sulle date richieste. Se il carico è incerto, parti da un elenco oggetti: ti indichiamo se serve un grande, un XL o un uso città.",
        ],
      },
    ],
    faq: [
      {
        q: "Quanto spazio offre un furgone grande?",
        a: "Dipende dal modello (passo e tetto). Controlla volume e dimensioni vano in scheda o chiedici consiglio sul carico.",
      },
      {
        q: "È difficile da guidare in città?",
        a: "Richiede più attenzione di un medio. Se lavori soprattutto in centro con pochi km, valuta anche la categoria «uso città».",
      },
      {
        q: "Posso noleggiare per un trasloco weekend?",
        a: "Sì. Per la promo weekend specifica, verifica se rientri nella categoria Furgoni grandi uso città e consulta la pagina offerte.",
      },
    ],
  },
  "furgoni-grandi-citta": {
    sections: [
      {
        h2: "Furgoni grandi uso città: tariffa Trieste e Promo Weekend",
        paragraphs: [
          "La categoria Furgoni grandi (uso città) è pensata per chi opera soprattutto nell’area di Trieste e vuole un forfait chilometrico dedicato (tipicamente 50 km nella tariffa di categoria, salvo aggiornamenti in scheda). I mezzi restano furgoni grandi utili per traslochi e carichi voluminosi, ma con condizioni commerciali orientate all’uso urbano.",
          "È anche l’unica categoria a cui si applica l’Offerta del Mese / Promo Weekend: dal sabato mattina al lunedì mattina a tariffa promozionale IVA inclusa, con chilometri inclusi dedicati. Ideale per traslochi nel weekend senza pagare tre giornate intere. Controlla sempre disponibilità e dettagli aggiornati nella pagina offerte e nelle schede veicolo.",
        ],
      },
      {
        h2: "Come scegliere e ritirare il mezzo",
        paragraphs: [
          "Confronta volume, portata e configurazione (es. L2H2) nelle schede. Se il percorso è prevalentemente urbano e il carico è importante, questa categoria è spesso il miglior equilibrio. Il ritiro avviene in sede LILO, Viale Campi Elisi 38/B: ti spieghiamo cauzione, orari e cosa fare in caso di km oltre il forfait.",
          "LILO S.r.l. aggiorna prezzi e promozioni dalla gestione interna: ciò che vedi online riflette le condizioni commerciali attuali. Richiedi preventivo online o contattaci via telefono/WhatsApp per bloccare le date del weekend o dei giorni feriali. In sede ti spieghiamo anche cauzione, documentazione e cosa fare se superi i chilometri inclusi.",
        ],
      },
    ],
    faq: [
      {
        q: "Cosa include la Promo Weekend?",
        a: "Di norma sabato 08:30 → lunedì 08:30 a 83€ IVA inclusa con km promo dedicati, solo su questa categoria. Verifica dettagli in pagina offerte.",
      },
      {
        q: "Posso uscire da Trieste?",
        a: "La tariffa è calibrata sull’uso città. Per tratte lunghe valuta altre categorie o chiedici un preventivo ad hoc.",
      },
      {
        q: "Come prenoto?",
        a: "Apri la scheda del veicolo, invia il preventivo con le date, oppure scrivici: confermiamo disponibilità e condizioni.",
      },
    ],
  },
  "furgoni-xl": {
    sections: [
      {
        h2: "Furgoni XL: massima capacità per carichi speciali",
        paragraphs: [
          "I furgoni XL a noleggio a Trieste rispondono alle esigenze di chi deve spostare carichi molto voluminosi: traslochi importanti, scaffalature, materiale edile leggero, attrezzature lunghe o imballi che superano le capacità di un grande standard. Configurazioni con passo lungo e tetto alto (es. L3H3) aumentano volume utile e altezza interna: verifica sempre i dati in scheda.",
          "Prima della prenotazione conviene misurare i pezzi critici e confrontarli con lunghezza, larghezza e altezza vano pubblicate. Il team LILO ti aiuta a evitare sottodimensionamenti che costringono a due viaggi. Ritiro e riconsegna in Viale Campi Elisi 38/B, con tariffe giornaliere IVA inclusa e indicazioni su km e cauzione.",
        ],
      },
      {
        h2: "Guida, sicurezza e supporto in sede",
        paragraphs: [
          "Un XL richiede attenzione in manovra e in altezza (sottopassi, garage). Al ritiro ti diamo le indicazioni essenziali e restiamo disponibili durante il noleggio. Per professionisti con usi ricorrenti possiamo valutare disponibilità su più date o mezzi alternativi se il carico cambia.",
          "Scegliere LILO S.r.l. a Trieste significa avere un partner locale: flotta curata, prezzi chiari e assistenza diretta. Confronta i modelli XL nella griglia, apri la scheda e richiedi il preventivo per le tue date.",
        ],
      },
    ],
    faq: [
      {
        q: "Quando serve davvero un XL?",
        a: "Quando volume o lunghezza superano un grande standard, oppure per ridurre drasticamente il numero di viaggi.",
      },
      {
        q: "Posso guidarlo con patente B?",
        a: "I mezzi della flotta pubblica sono selezionati per uso con patente B, salvo diverse indicazioni in scheda o contratto. Confermiamo al preventivo.",
      },
      {
        q: "Come verifico se il carico entra?",
        a: "Usa le misure vano in scheda o inviaci dimensioni/foto degli oggetti: ti indichiamo la categoria più adatta.",
      },
    ],
  },
};

export const AUTOLAVAGGIO_LONG_CONTENT: SeoLongContent = {
  sections: [
    {
      h2: "Autolavaggio LILO a Trieste: servizio e posizione",
      paragraphs: [
        "L’autolavaggio LILO a Trieste è pensato per chi vuole un lavaggio professionale o self-service senza allontanarsi troppo dalla zona operativa dell’azienda. Accanto al noleggio veicoli, LILO S.r.l. offre un punto dedicato alla cura dell’auto: esterno, interno e trattamenti in base alle disponibilità del momento. La sede dell’autolavaggio ha ingresso e uscita dedicati: consulta la mappa e i recapiti in pagina per orientarti facilmente.",
        "Privati e aziende scelgono il nostro autolavaggio per mantenere i veicoli presentabili dopo il lavoro, prima di una consegna o semplicemente per la manutenzione ordinaria. Se noleggi un mezzo LILO e vuoi restituirlo in ordine, o se usi la tua auto quotidiana, puoi contattarci per orari e tipi di lavaggio disponibili.",
      ],
    },
    {
      h2: "Come contattarci e cosa sapere prima di arrivare",
      paragraphs: [
        "Prima di presentarti, verifica orari e telefono dell’autolavaggio indicati in scheda sede: così eviti attese inutili e puoi chiedere disponibilità per lavaggi interni più approfonditi. Per informazioni commerciali o richieste combinate (noleggio + lavaggio) puoi anche scrivere all’email generale LILO.",
        "LILO S.r.l. è un’azienda di Trieste radicata nel territorio: un unico interlocutore per mobilità e cura del veicolo. Usa la mappa qui sotto per raggiungere la sede, salva il numero e chiamaci se hai esigenze particolari (veicoli commerciali, flotte aziendali, orari dedicati).",
      ],
    },
  ],
  faq: [
    {
      q: "L’autolavaggio è nella stessa sede del noleggio?",
      a: "Sono servizi correlati ma con accessi dedicati. Controlla indirizzo e mappa in pagina per l’ingresso corretto.",
    },
    {
      q: "Posso lavare anche un furgone noleggiato?",
      a: "Dipende dal tipo di lavaggio e dalla disponibilità. Chiamaci: ti indichiamo cosa è possibile fare prima della riconsegna.",
    },
    {
      q: "Come prenoto?",
      a: "Per molte attività basta presentarsi negli orari di apertura; per trattamenti più lunghi conviene chiamare in anticipo.",
    },
  ],
};

export const CONTATTI_LONG_CONTENT: SeoLongContent = {
  sections: [
    {
      h2: "Come raggiungere LILO a Trieste e cosa fare al ritiro",
      paragraphs: [
        "La sede operativa del noleggio LILO S.r.l. si trova in Viale Campi Elisi 38/B a Trieste: qui ritiri e riconsegni i veicoli, firmi il contratto e ricevi le istruzioni su chilometri, cauzione e orari. Arrivare in anticipo di pochi minuti aiuta a completare i controlli senza fretta. Porta i documenti richiesti (patente e documento d’identità; altre garanzie come da contratto).",
        "Per l’autolavaggio usa i riferimenti dedicati in mappa: ingresso e uscita possono differire dalla sede noleggio. In entrambe le sedi trovi i numeri di telefono aggiornati. Preferisci scrivere? Usa l’email indicata in pagina: rispondiamo per preventivi, disponibilità flotta e informazioni commerciali.",
      ],
    },
    {
      h2: "Telefono, WhatsApp e preventivi online",
      paragraphs: [
        "Il modo più rapido per una disponibilità immediata è chiamare o scrivere su WhatsApp al numero del noleggio. Se stai confrontando più veicoli, puoi anche partire dalla scheda online e inviare la richiesta di preventivo con le date: arriverà al team con il contesto del mezzo scelto.",
        "LILO S.r.l. serve privati, professionisti e realtà istituzionali a Trieste. Che tu debba noleggiare un’auto, un pulmino 9 posti o un furgone per trasloco, contattaci: ti indirizziamo sulla categoria giusta e ti confermiamo orari di ritiro e riconsegna. Per urgenze o disponibilità last minute, il telefono resta il canale più veloce.",
      ],
    },
  ],
  faq: [
    {
      q: "Qual è l’indirizzo del noleggio?",
      a: "Viale Campi Elisi 38/B, Trieste. Usa la mappa della sede noleggio in questa pagina per le indicazioni stradali.",
    },
    {
      q: "Posso lasciare un messaggio fuori orario?",
      a: "Sì: email e WhatsApp restano i canali più comodi. Ti richiamiamo appena possibile negli orari di servizio.",
    },
    {
      q: "Come chiedo un preventivo?",
      a: "Dalla scheda veicolo sul sito, oppure telefonicamente/WhatsApp indicando date, categoria e tipo di carico o uso.",
    },
  ],
};

export const COOKIE_POLICY_LONG_CONTENT: SeoLongContent = {
  sections: [
    {
      h2: "Finalità e base giuridica dei cookie sul sito LILO",
      paragraphs: [
        "Il sito di LILO S.r.l. (noleggio e servizi a Trieste) utilizza cookie e strumenti analoghi per far funzionare le pagine in modo sicuro, ricordare le tue preferenze di consenso e — solo se lo autorizzi — misurare l’utilizzo del sito o supportare attività di marketing. I cookie tecnici sono necessari al servizio: senza di essi alcune funzioni (sessione, sicurezza, salvataggio del consenso) non sarebbero affidabili.",
        "Per le metriche di hosting usiamo Vercel Web Analytics e Speed Insights in modalità cookieless (dati aggregati/anonimi, senza cookie di profilazione): non richiedono il previo consenso e restano attivi come misura tecnica. Google Analytics e gli strumenti di marketing, quando presenti, vengono attivati solo dopo una scelta consapevole nel banner (livelli Privato, Equilibrato o Personalizzato). Puoi modificare o revocare quel consenso in qualsiasi momento dal link «Preferenze cookie» nel footer. Il titolare del trattamento è LILO S.r.l.; per i dettagli sul trattamento dei dati personali consulta la Privacy Policy collegata in fondo a questa pagina.",
      ],
    },
    {
      h2: "Gestione del consenso, terze parti e diritti dell’interessato",
      paragraphs: [
        "Al primo accesso mostriamo un’informativa sintetica e le opzioni di consenso. Se scegli il livello più riservato, restano attivi i cookie necessari e le metriche cookieless di hosting (Vercel), mentre Google Analytics e il marketing restano disattivati. Se abiliti le statistiche nel banner, Google Analytics può registrare visite in forma aggregata secondo le impostazioni di consenso. Widget di mappe o social, se presenti, possono impostare cookie di terzi: in quel caso il trattamento segue anche le policy dei rispettivi fornitori.",
        "Hai diritto di ottenere informazioni, rettifica, cancellazione e limitazione del trattamento nei limiti di legge, nonché di opporti o proporre reclamo all’Autorità Garante. Per esercitare i diritti o chiarire dubbi sui cookie del sito, contatta l’indirizzo email indicato nelle impostazioni di contatto LILO. Conserviamo la prova delle scelte di consenso per dimostrare il rispetto della normativa vigente.",
      ],
    },
  ],
  faq: [
    {
      q: "Posso navigare senza accettare cookie analitici?",
      a: "Sì. Scegli «Privato» o disattiva analitica/marketing nelle preferenze: il sito resta utilizzabile con i soli cookie necessari.",
    },
    {
      q: "Come cambio le preferenze in seguito?",
      a: "Dal link «Preferenze cookie» in fondo a ogni pagina puoi riaprire il pannello e aggiornare le scelte.",
    },
    {
      q: "I cookie di mappa o social sono obbligatori?",
      a: "No. Se non li autorizzi, alcune mappe o contenuti incorporati potrebbero non caricarsi completamente.",
    },
  ],
};
