/** URL Google Maps generati dinamicamente dagli indirizzi in impostazioni_sito. */
export function googleMapsEmbedUrl(indirizzo: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(indirizzo)}&z=16&output=embed`;
}

export function googleMapsLink(indirizzo: string, label?: string): string {
  const query = label ? `${label} ${indirizzo}` : indirizzo;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
