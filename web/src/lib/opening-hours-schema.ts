const DAY_MAP: Record<string, string[]> = {
  "lunedì – venerdì": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "lunedì-venerdì": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "lun – ven": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "lun-ven": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "lunedì – sabato": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "lunedì-sabato": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  lunedì: ["Monday"],
  martedì: ["Tuesday"],
  mercoledì: ["Wednesday"],
  giovedì: ["Thursday"],
  venerdì: ["Friday"],
  sabato: ["Saturday"],
  domenica: ["Sunday"],
};

function normalizeTime(value: string): string {
  const [hours, minutes = "00"] = value.trim().split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}

function normalizeDaysKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s*[–—−-]\s*/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/** Converte testo orari impostazioni_sito in OpeningHoursSpecification schema.org */
export function orariToOpeningHoursSpecification(
  orari: string,
): Record<string, unknown>[] {
  const specs: Record<string, unknown>[] = [];

  for (const rawLine of orari.split("\n")) {
    const line = rawLine.trim();
    if (!line || /chiuso/i.test(line)) continue;

    // Prima occorrenza di "HH:MM" delimita giorni vs fasce orarie
    const timeStart = line.search(/\d{1,2}:\d{2}/);
    if (timeStart <= 0) continue;

    const daysPart = line.slice(0, timeStart).replace(/[:\s]+$/, "").trim();
    const timesPart = line.slice(timeStart).trim();
    if (!daysPart || !timesPart) continue;

    const daysKey = normalizeDaysKey(daysPart);
    const dayOfWeek =
      DAY_MAP[daysKey] ||
      DAY_MAP[daysKey.replace(/-/g, " – ")] ||
      DAY_MAP[daysPart.trim().toLowerCase()];
    if (!dayOfWeek) continue;

    const slots = timesPart.split("/").map((slot) => slot.trim());
    for (const slot of slots) {
      const match = slot.match(/(\d{1,2}:\d{2})\s*[–—−-]\s*(\d{1,2}:\d{2})/);
      if (!match) continue;

      specs.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek,
        opens: normalizeTime(match[1]),
        closes: normalizeTime(match[2]),
      });
    }
  }

  return specs;
}
