import Link from "next/link";
import { COSA_TRASPORTI_USE_CASES } from "@/lib/cosa-trasporti";
import { flottaCategoriaHref } from "@/lib/nav-config";

/** Scenari editoriali (hub SEO) collegati a categorie flotta — senza inventare misure. */
const SCENARI_HUB: Array<{
  title: string;
  testo: string;
  verifica: string;
  categoriaSlug: string;
  categoriaLabel: string;
  useCaseId?: string;
}> = [
  {
    title: "Frigorifero / freezer",
    testo:
      "Serve soprattutto altezza vano e spazio per caricare l’elettrodomestico in piedi senza forzature.",
    verifica: "Misura altezza e profondità del tuo frigo e confrontale con i dati in scheda.",
    categoriaSlug: "furgoni-medi",
    categoriaLabel: "Furgoni medi",
    useCaseId: "frigorifero",
  },
  {
    title: "Lavatrice e elettrodomestici",
    testo: "Di solito bastano volume e altezza da furgone medio; evita i mezzi troppo compatti.",
    verifica: "Controlla peso e se lo trasporti in piedi; in dubbio chiedi conferma in sede.",
    categoriaSlug: "furgoni-medi",
    categoriaLabel: "Furgoni medi",
    useCaseId: "elettrodomestico",
  },
  {
    title: "Armadio e mobili alti",
    testo: "Contano lunghezza e altezza del vano. Spesso conviene un grande (anche uso città).",
    verifica: "Se l’armadio resta assemblato, verifica le tre dimensioni del pezzo più grande.",
    categoriaSlug: "furgoni-grandi",
    categoriaLabel: "Furgoni grandi",
    useCaseId: "armadio",
  },
  {
    title: "Divano e mobili di casa",
    testo: "Volume generoso e aperture laterali/posteriori: orientati su grandi / uso città.",
    verifica: "Misura il divano e valuta se smontare i piedi; non forzare il carico.",
    categoriaSlug: "furgoni-grandi-citta",
    categoriaLabel: "Furgoni grandi uso città",
    useCaseId: "divano",
  },
  {
    title: "Letto e materasso",
    testo:
      "Dipende se il letto è smontato e dalle dimensioni del materasso. Non esiste un’unica categoria “giusta”.",
    verifica: "Confronta lunghezza vano e volume in scheda; per dubbi usa il wizard o chiamaci.",
    categoriaSlug: "furgoni-medi",
    categoriaLabel: "Furgoni medi",
  },
  {
    title: "Moto / scooter",
    testo:
      "In flotta il Fiat Ducato ha rampa moto dedicata; sugli altri mezzi la rampa può essere un extra.",
    verifica: "Chiedi sempre conferma del mezzo e dell’eventuale rampa prima del ritiro.",
    categoriaSlug: "furgoni-grandi",
    categoriaLabel: "Furgoni grandi",
    useCaseId: "moto",
  },
  {
    title: "Scatoloni e consegne",
    testo: "Per carichi leggeri in città spesso bastano i furgoni piccoli o medi.",
    verifica: "Se hai pochi scatoloni, evita un XL inutilmente grande.",
    categoriaSlug: "furgoni-piccoli",
    categoriaLabel: "Furgoni piccoli",
    useCaseId: "scatole-consegne",
  },
  {
    title: "Trasloco (mono / bi / tri)",
    testo:
      "Il volume cresce con i locali e gli arredi. Usa il wizard per monolocale, bilocale o 3+ locali.",
    verifica: "Elenca i pezzi più grandi; confronta i m³ in scheda; pianifica eventuali viaggi multipli.",
    categoriaSlug: "furgoni-grandi",
    categoriaLabel: "Furgoni grandi",
    useCaseId: "trasloco-monolocale",
  },
  {
    title: "Materiali e attrezzature da lavoro",
    testo:
      "Peso e lunghezza dei pezzi contano quanto il volume. Non stimare la portata senza dati di scheda.",
    verifica: "Controlla portata (kg) pubblicata e, se manca, chiedi in sede prima di caricare.",
    categoriaSlug: "furgoni-medi",
    categoriaLabel: "Furgoni medi",
  },
];

export function CosaTrasportiScenariHub() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10" aria-labelledby="scenari-hub-heading">
      <h2 id="scenari-hub-heading" className="text-2xl font-bold text-slate-900">
        Scenari d’uso frequenti
      </h2>
      <p className="mt-2 max-w-3xl text-slate-600">
        Orientamento pratico verso le categorie flotta. Le misure del <em>tuo</em> carico vanno
        sempre verificate: se non possiamo determinarle dal solo nome dell’oggetto, lo diciamo
        chiaramente.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SCENARI_HUB.map((s) => (
          <li
            key={s.title}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{s.testo}</p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              <span className="font-semibold text-slate-600">Da verificare: </span>
              {s.verifica}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={flottaCategoriaHref(s.categoriaSlug)}
                className="text-sm font-semibold text-brand-700 hover:underline"
              >
                {s.categoriaLabel} →
              </Link>
              {s.useCaseId && COSA_TRASPORTI_USE_CASES.some((u) => u.id === s.useCaseId) && (
                <span className="text-sm text-slate-400">· usa il wizard sopra</span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-slate-600">
        Guide correlate:{" "}
        <Link href="/guide/furgone-per-frigorifero" className="font-medium text-brand-700 hover:underline">
          frigorifero
        </Link>
        {" · "}
        <Link
          href="/guide/quale-furgone-scegliere-per-trasloco"
          className="font-medium text-brand-700 hover:underline"
        >
          trasloco
        </Link>
        {" · "}
        <Link href="/guide" className="font-medium text-brand-700 hover:underline">
          tutte le guide
        </Link>
        {" · "}
        <Link
          href="/noleggio-furgoni-trieste"
          className="font-medium text-brand-700 hover:underline"
        >
          noleggio furgoni Trieste
        </Link>
      </p>
    </section>
  );
}
