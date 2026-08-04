import { COMPANY } from "@/lib/constants";
import { getDisplayName } from "@/lib/veicolo-utils";
import {
  isAutoCategory,
  isFurgoneCategory,
  isPulminoCategory,
} from "@/lib/specifiche-tecniche-utils";
import { stripTargaFromPublicCopy } from "@/lib/veicolo-seo";
import type { VeicoloPubblico } from "@/types/veicolo";

const SEDE = `${COMPANY.streetAddress} a ${COMPANY.city}`;

function volumeHint(veicolo: VeicoloPubblico): string | null {
  const v =
    veicolo.specifiche_tecniche.volume_metri_cubi ??
    veicolo.specifiche_tecniche.volume_carico_mc;
  if (v == null) return null;
  return `${String(v).replace(".", ",")} m³`;
}

/**
 * Testo “In sintesi” vendibile e locale — vale per tutte le schede.
 * Nessuna ripetizione del marchio: l’utente è già sul sito aziendale.
 */
export function getVeicoloSintesiVendibile(veicolo: VeicoloPubblico): string {
  const name = getDisplayName(veicolo);
  const slug = veicolo.categoria?.slug ?? "";
  const vol = volumeHint(veicolo);
  const ritiro = `Ritiro in sede in ${SEDE}.`;

  if (isPulminoCategory(veicolo)) {
    return `Il ${name} è il pulmino 9 posti più richiesto a Trieste per trasferte di gruppo, famiglie e gite fuori porta. Spazio comodo per passeggeri e bagagli. ${ritiro}`;
  }

  if (isAutoCategory(veicolo)) {
    return `Noleggia ${name} a Trieste per spostamenti in città, weekend e trasferte leggere. Ideale se cerchi agilità, parcheggio facile e tariffe chiare. ${ritiro}`;
  }

  if (slug === "furgoni-piccoli") {
    return `Il ${name} è il furgone compatto per consegne e piccoli trasporti a Trieste${vol ? ` (vano circa ${vol})` : ""}. Perfetto in centro e per carichi leggeri. ${ritiro}`;
  }

  if (slug === "furgoni-medi") {
    return `Con ${name} sposti elettrodomestici, mobili medi e consegne impegnative a Trieste${vol ? `: vano circa ${vol}` : ""}. Equilibrio tra spazio e manovrabilità. ${ritiro}`;
  }

  if (slug === "furgoni-grandi-citta") {
    return `${name} è il furgone grande ottimizzato per l’uso in città a Trieste${vol ? ` (circa ${vol})` : ""}: traslochi urbani, lavori e più viaggi in giornata. Tariffa dedicata. ${ritiro}`;
  }

  if (slug === "furgoni-grandi") {
    return `Il ${name} è pensato per traslochi e carichi voluminosi a Trieste e provincia${vol ? `: circa ${vol} di vano` : ""}. Ideale per armadi, elettrodomestici grandi e materiali da lavoro. ${ritiro}`;
  }

  if (slug === "furgoni-xl") {
    return `Il ${name} è la soluzione XL per traslochi importanti e carichi massimi a Trieste${vol ? ` (vano circa ${vol})` : ""}. Quando lo spazio non basta con un furgone standard. ${ritiro}`;
  }

  if (isFurgoneCategory(veicolo)) {
    return `Noleggia ${name} a Trieste per trasporti e traslochi${vol ? ` — vano circa ${vol}` : ""}. Tariffe trasparenti. ${ritiro}`;
  }

  const fallback = veicolo.ai_summary || veicolo.descrizione_breve;
  if (fallback?.trim()) {
    return stripTargaFromPublicCopy(fallback.trim());
  }

  return `Noleggio ${name} a Trieste: ritiro in sede in ${SEDE}, tariffe chiare e assistenza dedicata.`;
}
