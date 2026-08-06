/**
 * Rinomina slug schede veicolo: rimozione targa dall’URL.
 * Usato da legacy-redirects (301) e documentazione.
 *
 * Ordine applicativo in DB: prima liberare conflitti (es. ford-transit-l2h2 → …-citta),
 * poi applicare le altre rinomine.
 */
export const VEICOLO_SLUG_RENAMES: ReadonlyArray<{ from: string; to: string }> = [
  // Conflitto Transit L2H2: la scheda città libera lo slug “pulito”
  { from: "ford-transit-l2h2", to: "ford-transit-l2h2-citta" },
  // Con targa → slug stabili
  { from: "ford-transit-gg551rd", to: "ford-transit-l2h2" },
  { from: "ford-transit-custom-fj932zy", to: "ford-transit-custom-l1h1" },
  { from: "ford-transit-custom-gj446ak", to: "ford-transit-custom-l1h1-ibrido" },
  { from: "citroen-jumpy-fr523sw", to: "citroen-jumpy-l1h1" },
  { from: "fiat-doblo-gh618pt", to: "fiat-doblo-cargo" },
  { from: "citroen-jumper-es772tn", to: "citroen-jumper-l1h1" },
  { from: "peugeot-boxer-l2h2-ew858wc", to: "peugeot-boxer-l2h2" },
  { from: "renault-master-l2h2-gf883sb", to: "renault-master-l2h2" },
  { from: "renault-master-gg290xm", to: "renault-master-l2h3" },
  { from: "nissan-interstar-l3h2-gt436zp", to: "nissan-interstar-l3h2" },
  { from: "opel-movano-gc328pk", to: "opel-movano-l2h2" },
  // Legacy demo / alias
  { from: "ford-transit-350m-dv344hd", to: "ford-transit-l2h2-citta" },
  { from: "peugeot-boxer-l3h3-ix345ij", to: "peugeot-boxer-l3h3" },
];

/**
 * 301 pubblici: vecchie URL (con targa o alias) → slug puliti.
 * Esclude il rename interno città (ford-transit-l2h2 → -citta): quello slug
 * diventa la scheda grandi; i bookmark città usano /flotta/ford-transit-l2h2-citta.
 */
export const VEICOLO_SLUG_REDIRECTS_301: ReadonlyArray<{ from: string; to: string }> =
  VEICOLO_SLUG_RENAMES.filter((r) => r.from !== "ford-transit-l2h2");
