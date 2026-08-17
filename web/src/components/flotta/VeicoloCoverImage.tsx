"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  VeicoloImagePlaceholder,
  type VeicoloPlaceholderVariant,
} from "@/components/flotta/VeicoloImagePlaceholder";
import {
  FLEET_PHOTO_FRAME,
  FLEET_VEHICLE_IMG,
  fleetPhotoAspectClass,
  isEnvironmentalFleetPhoto,
  type FleetPhotoAspect,
} from "@/lib/fleet-photo-utils";

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

interface VeicoloCoverImageProps {
  src: string | null | undefined;
  fallbackSrc?: string | null;
  alt: string;
  title?: string | null;
  variant?: VeicoloPlaceholderVariant;
  placeholderLabel?: string;
  className?: string;
  framed?: boolean;
  aspect?: FleetPhotoAspect;
  /** LCP: solo copertina above-the-fold (scheda veicolo). */
  priority?: boolean;
  sizes?: string;
}

export function VeicoloCoverImage({
  src,
  fallbackSrc,
  alt,
  title,
  variant = "furgone",
  placeholderLabel,
  className = "",
  framed = true,
  aspect = "4/3",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 720px",
}: VeicoloCoverImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  useEffect(() => {
    const primary = isValidImageUrl(src) ? src.trim() : null;
    const fallback = isValidImageUrl(fallbackSrc) ? fallbackSrc.trim() : null;
    setCurrentSrc(primary ?? fallback);
  }, [src, fallbackSrc]);

  const handleError = () => {
    const fallback = isValidImageUrl(fallbackSrc) ? fallbackSrc.trim() : null;
    if (fallback && currentSrc !== fallback) {
      setCurrentSrc(fallback);
      return;
    }
    setCurrentSrc(null);
  };

  const environmental = isEnvironmentalFleetPhoto(currentSrc);
  const frameClass = framed
    ? "overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-slate-200/90"
    : FLEET_PHOTO_FRAME.outer;

  return (
    <div className={`relative ${fleetPhotoAspectClass(aspect)} ${frameClass} ${className}`}>
      {currentSrc ? (
        <div className={`relative h-full w-full ${FLEET_PHOTO_FRAME.inner}`}>
          {environmental && (
            <div className={FLEET_PHOTO_FRAME.environmentalOverlay} aria-hidden="true" />
          )}
          <Image
            key={currentSrc}
            src={currentSrc}
            alt={alt}
            title={title?.trim() || undefined}
            fill
            sizes={sizes}
            quality={75}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className={
              environmental ? FLEET_VEHICLE_IMG.environmental : FLEET_VEHICLE_IMG.studio
            }
            onError={handleError}
          />
        </div>
      ) : (
        <VeicoloImagePlaceholder variant={variant} label={placeholderLabel} />
      )}
    </div>
  );
}

interface FlottaHubCategoryImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

/** Immagine categoria Hub — foto reali a riempimento card. */
export function FlottaHubCategoryImage({
  src,
  alt,
  priority = false,
}: FlottaHubCategoryImageProps) {
  const environmental = isEnvironmentalFleetPhoto(src);

  return (
    <div className={`relative ${fleetPhotoAspectClass("16/10")} ${FLEET_PHOTO_FRAME.outer}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={75}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={
          environmental ? FLEET_VEHICLE_IMG.environmentalHub : FLEET_VEHICLE_IMG.studioHub
        }
      />
    </div>
  );
}
