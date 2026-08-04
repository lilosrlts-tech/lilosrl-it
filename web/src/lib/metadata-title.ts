import type { Metadata } from "next";

/**
 * Evita il suffisso duplicato dal template layout (`%s | LILO Autonoleggio Trieste`)
 * quando il titolo è già completo (contiene brand o separatore).
 */
export function resolveMetadataTitle(title: string): Metadata["title"] {
  const trimmed = title.trim();
  if (!trimmed) return trimmed;
  if (trimmed.includes("|") || /lilo/i.test(trimmed)) {
    return { absolute: trimmed };
  }
  return trimmed;
}
