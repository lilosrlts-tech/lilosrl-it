"use client";

import { useState } from "react";
import { VeicoloCoverImage } from "@/components/flotta/VeicoloCoverImage";
import { VeicoloImagePlaceholder } from "@/components/flotta/VeicoloImagePlaceholder";
import type { VeicoloPlaceholderVariant } from "@/components/flotta/VeicoloImagePlaceholder";
import {
  isPlaceholderPhotoCopy,
  stripPlaceholderPhotoCopy,
} from "@/lib/veicolo-seo";
import type { FotoPubblica } from "@/types/veicolo";

interface ImageGalleryProps {
  foto: FotoPubblica[];
  imageAlt: string;
  variant?: VeicoloPlaceholderVariant;
}

function isValidImageUrl(url: string | null | undefined): url is string {
  if (!url?.trim()) return false;
  if (url.startsWith("/")) return true;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function resolveFotoAlt(foto: FotoPubblica, fallback: string): string {
  const raw = foto.alt_text?.trim();
  if (!raw || isPlaceholderPhotoCopy(raw)) return fallback;
  const cleaned = stripPlaceholderPhotoCopy(raw);
  return cleaned || fallback;
}

function resolveFotoCaption(text: string | null | undefined): string | null {
  if (!text?.trim() || isPlaceholderPhotoCopy(text)) return null;
  const cleaned = stripPlaceholderPhotoCopy(text);
  return cleaned || null;
}

function GalleryThumb({
  foto,
  active,
  onSelect,
  variant,
  imageAlt,
}: {
  foto: FotoPubblica;
  active: boolean;
  onSelect: () => void;
  variant: VeicoloPlaceholderVariant;
  imageAlt: string;
}) {
  const [failed, setFailed] = useState(false);
  const valid = isValidImageUrl(foto.url_pubblico) && !failed;
  const alt = resolveFotoAlt(foto, imageAlt);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200/80 transition ${
        active ? "ring-brand-600 ring-2" : "hover:ring-slate-300"
      }`}
      aria-label={alt}
    >
      {valid ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={foto.url_pubblico.trim()}
          alt={alt}
          title={resolveFotoCaption(foto.titolo) || undefined}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain object-center p-0.5"
          onError={() => setFailed(true)}
        />
      ) : (
        <VeicoloImagePlaceholder variant={variant} />
      )}
    </button>
  );
}

export function ImageGallery({ foto, imageAlt, variant = "furgone" }: ImageGalleryProps) {
  const sorted = [...foto]
    .filter((f) => isValidImageUrl(f.url_pubblico))
    .sort((a, b) => a.ordine - b.ordine);
  const initial = sorted.find((f) => f.is_copertina) ?? sorted[0];
  const [active, setActive] = useState<FotoPubblica | undefined>(initial);

  if (!active || sorted.length === 0) {
    return (
      <VeicoloCoverImage
        src={null}
        alt={imageAlt}
        variant={variant}
        placeholderLabel={imageAlt}
      />
    );
  }

  const activeAlt = resolveFotoAlt(active, imageAlt);
  const caption = resolveFotoCaption(active.didascalia);

  return (
    <div className="space-y-3">
      <div className="relative">
        <VeicoloCoverImage
          src={active.url_pubblico}
          alt={activeAlt}
          title={resolveFotoCaption(active.titolo) || undefined}
          variant={variant}
          placeholderLabel={imageAlt}
          priority
        />
        {caption ? (
          <p className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 text-sm text-white">
            {caption}
          </p>
        ) : null}
      </div>

      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((item) => (
            <GalleryThumb
              key={item.id}
              foto={item}
              active={active.id === item.id}
              onSelect={() => setActive(item)}
              variant={variant}
              imageAlt={imageAlt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
