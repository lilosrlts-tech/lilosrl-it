const PARTNERS = [
  "Esercito Italiano",
  "Guardia di Finanza",
  "Corte d'Appello di Trieste",
  "Fincantieri",
  "Comune di Trieste",
  "Università degli Studi",
] as const;

export function InstitutionalPartnersSection() {
  return (
    <section
      className="border-y border-slate-200 bg-slate-100 py-10 sm:py-12"
      aria-labelledby="partners-heading"
    >
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2
          id="partners-heading"
          className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500 sm:text-base"
        >
          La scelta di grandi aziende ed enti pubblici
        </h2>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 sm:gap-x-1">
          {PARTNERS.map((name, index) => (
            <li key={name} className="flex items-center">
              <span className="px-2 text-sm font-semibold text-slate-800 sm:text-base">
                {name}
              </span>
              {index < PARTNERS.length - 1 && (
                <span
                  className="hidden text-[#A16207] sm:inline"
                  aria-hidden="true"
                >
                  •
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
