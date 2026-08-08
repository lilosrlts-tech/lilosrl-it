import Image from "next/image";
import Link from "next/link";
import type { ImpostazioniSito } from "@/types/impostazioni";
import { PhoneLink } from "@/components/shared/PhoneLink";

/** Desktop / fallback (1600×560). */
export const HERO_DESKTOP = "/images/hero-home.webp";
/** Tablet / large phone — ~39 KB. */
export const HERO_800 = "/images/hero-home-800.webp";
/** Phone — ~23 KB. */
export const HERO_640 = "/images/hero-home-640.webp";

const HERO_WIDTH = 1600;
const HERO_HEIGHT = 560;

interface HeroSectionProps {
  impostazioni: ImpostazioniSito;
}

/**
 * Hero LCP: next/image con priority + eager (no lazy).
 * Preload responsive con media query: vedi HomeHeroPreloads in page.tsx (head).
 * src = 640px così il preload automatico di `priority` non tira il 1600px su mobile;
 * <picture> sceglie 800/desktop sui viewport più grandi.
 */
export function HeroSection({ impostazioni }: HeroSectionProps) {
  return (
    <section
      className="relative isolate w-full overflow-hidden bg-slate-800 text-white"
      aria-label="Presentazione LILO Autonoleggio Trieste"
    >
      {/* Mobile: altezza da contenuto (no clip). Da sm: ratio panoramico. */}
      <div className="relative min-h-[320px] w-full sm:aspect-[20/7] sm:min-h-0 sm:max-h-[440px]">
        <picture>
          <source media="(min-width: 1024px)" srcSet={HERO_DESKTOP} type="image/webp" />
          <source media="(min-width: 641px)" srcSet={HERO_800} type="image/webp" />
          <Image
            src={HERO_640}
            alt="Furgone LILO a Trieste"
            width={640}
            height={224}
            priority
            loading="eager"
            fetchPriority="high"
            unoptimized
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
            decoding="async"
          />
        </picture>
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-900/82 via-slate-900/50 to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 flex h-full items-center px-4 py-8 sm:px-6 sm:py-0">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-lg">
              {impostazioni.hero_badge_home?.trim() ? (
                <p className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37] sm:text-sm">
                  {impostazioni.hero_badge_home}
                </p>
              ) : null}
              <h1
                className={`text-2xl font-bold leading-tight sm:text-4xl ${
                  impostazioni.hero_badge_home?.trim() ? "mt-2" : ""
                }`}
              >
                {impostazioni.hero_titolo_home}
              </h1>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-100 sm:mt-3 sm:line-clamp-none sm:text-base">
                {impostazioni.testo_hero_home}
              </p>

              {/* Mobile: 1 primario + 1 secondario */}
              <div className="mt-5 flex flex-wrap gap-2 sm:hidden">
                <Link
                  href="/flotta"
                  className="rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
                >
                  Vedi la flotta
                </Link>
                <a
                  href="#preventivo-whatsapp"
                  className="rounded-full border border-white/50 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                >
                  Preventivo WhatsApp
                </a>
              </div>

              {/* Desktop / tablet: flotta + dove siamo + telefono */}
              <div className="mt-6 hidden flex-wrap gap-3 sm:flex">
                <Link
                  href="/flotta"
                  className="rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-slate-900 hover:opacity-90"
                >
                  Vedi la flotta
                </Link>
                <a
                  href="#contatti"
                  className="rounded-full border border-white/50 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
                >
                  Dove siamo
                </a>
                <PhoneLink
                  phone={impostazioni.telefono_noleggio}
                  className="rounded-full border border-white/50 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
                >
                  {impostazioni.telefono_noleggio}
                </PhoneLink>
              </div>

              <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-200/90 sm:mt-4 sm:text-sm">
                <span className="tracking-wide text-amber-300" aria-hidden="true">
                  ★★★★★
                </span>
                <span>Recensioni Google</span>
                <span className="text-white/40" aria-hidden="true">
                  ·
                </span>
                <span>20+ anni di esperienza a Trieste</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Preload hero in <head> (React 19 hoisting) — solo l’asset del viewport. */
export function HomeHeroPreloads() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href={HERO_640}
        type="image/webp"
        media="(max-width: 640px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={HERO_800}
        type="image/webp"
        media="(min-width: 641px) and (max-width: 1023px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={HERO_DESKTOP}
        type="image/webp"
        media="(min-width: 1024px)"
        fetchPriority="high"
      />
    </>
  );
}
