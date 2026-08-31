import type { CSSProperties } from "react";

/**
 * Link email con @ offuscato nel markup HTML (`&#64;`) contro gli harvester.
 * Il browser decodifica l’entity: mailto e testo restano usabili.
 */
export function obfuscateEmailAt(email: string): string {
  return email.trim().replace(/@/g, "&#64;");
}

interface ObfuscatedEmailLinkProps {
  email: string;
  className?: string;
  style?: CSSProperties;
}

export function ObfuscatedEmailLink({
  email,
  className,
  style,
}: ObfuscatedEmailLinkProps) {
  const trimmed = email.trim();
  if (!trimmed) return null;

  const obfuscated = obfuscateEmailAt(trimmed);

  return (
    <a
      href={`mailto:${obfuscated}`}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: obfuscated }}
    />
  );
}
