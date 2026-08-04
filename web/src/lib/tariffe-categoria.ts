import type { VeicoloPubblico } from "@/types/veicolo";

export type TariffaCategoriaSlug =
  | "auto"
  | "pulmini-9-posti"
  | "furgoni-piccoli"
  | "furgoni-medi"
  | "furgoni-grandi-citta"
  | "furgoni-grandi"
  | "furgoni-xl";

export interface TariffaCategoria {
  slug: TariffaCategoriaSlug;
  label: string;
  prezzoGiornaliero: number;
  kmInclusi: number;
  cauzioneEuro: number;
  /** Modalità accettate per la cauzione */
  cauzioneModalita: "flotta" | "pulmino_solo_carta";
}

export const TARIFFE_CATEGORIA: Record<TariffaCategoriaSlug, TariffaCategoria> = {
  auto: {
    slug: "auto",
    label: "Auto",
    prezzoGiornaliero: 40,
    kmInclusi: 100,
    cauzioneEuro: 300,
    cauzioneModalita: "flotta",
  },
  "pulmini-9-posti": {
    slug: "pulmini-9-posti",
    label: "Pulmini 9 posti",
    prezzoGiornaliero: 90,
    kmInclusi: 150,
    cauzioneEuro: 500,
    cauzioneModalita: "pulmino_solo_carta",
  },
  "furgoni-piccoli": {
    slug: "furgoni-piccoli",
    label: "Furgoni piccoli",
    prezzoGiornaliero: 50,
    kmInclusi: 100,
    cauzioneEuro: 200,
    cauzioneModalita: "flotta",
  },
  "furgoni-medi": {
    slug: "furgoni-medi",
    label: "Furgoni medi",
    prezzoGiornaliero: 55,
    kmInclusi: 100,
    cauzioneEuro: 200,
    cauzioneModalita: "flotta",
  },
  "furgoni-grandi-citta": {
    slug: "furgoni-grandi-citta",
    label: "Furgoni grandi (uso città)",
    prezzoGiornaliero: 55,
    kmInclusi: 50,
    cauzioneEuro: 200,
    cauzioneModalita: "flotta",
  },
  "furgoni-grandi": {
    slug: "furgoni-grandi",
    label: "Furgoni grandi",
    prezzoGiornaliero: 60,
    kmInclusi: 100,
    cauzioneEuro: 200,
    cauzioneModalita: "flotta",
  },
  "furgoni-xl": {
    slug: "furgoni-xl",
    label: "Furgoni XL",
    prezzoGiornaliero: 70,
    kmInclusi: 100,
    cauzioneEuro: 300,
    cauzioneModalita: "flotta",
  },
};

export function resolveTariffaSlug(veicolo: VeicoloPubblico): TariffaCategoriaSlug | null {
  const slug = veicolo.categoria?.slug;
  if (!slug) return null;
  if (slug in TARIFFE_CATEGORIA) return slug as TariffaCategoriaSlug;
  return null;
}

export function getTariffaPerVeicolo(veicolo: VeicoloPubblico): TariffaCategoria | null {
  const slug = resolveTariffaSlug(veicolo);
  return slug ? TARIFFE_CATEGORIA[slug] : null;
}

export function getNotaKmInclusi(tariffa: TariffaCategoria): string {
  if (tariffa.slug === "furgoni-grandi-citta") {
    return `Fino a ${tariffa.kmInclusi} km inclusi — Ottimizzato per Trieste città`;
  }
  return `${tariffa.kmInclusi} km inclusi / Assicurazione base`;
}

export function getNotaCauzione(tariffa: TariffaCategoria): string {
  const importo = tariffa.cauzioneEuro.toLocaleString("it-IT");

  if (tariffa.cauzioneModalita === "pulmino_solo_carta") {
    return `Cauzione €${importo}: solo carta di credito.`;
  }

  return `Cauzione €${importo}: per uso in città anche in contanti; per fuori città ed estero carta di credito o debito.`;
}

/** Chiarimento operativo per contratto e pagine legali */
export const CAUZIONE_USO_CITTA_NOTA =
  "Per «uso in città» si intende un noleggio con percorrenza entro l'area urbana di Trieste e nei limiti chilometrici previsti dalla tariffa scelta.";

export function getElencoCauzioniLegale(): { categoria: string; nota: string }[] {
  return Object.values(TARIFFE_CATEGORIA).map((tariffa) => ({
    categoria: tariffa.label,
    nota: getNotaCauzione(tariffa),
  }));
}
