"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AUTOLAVAGGIO_URL,
  FLOTTA_CATEGORIE_NAV,
  GOLD,
  flottaCategoriaHref,
} from "@/lib/nav-config";
import { PhoneLink } from "@/components/shared/PhoneLink";

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isFlottaActive(pathname: string): boolean {
  return pathname === "/flotta" || pathname.startsWith("/flotta/");
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      {open ? (
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          d="M6 6l12 12M18 6L6 18"
        />
      ) : (
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          d="M4 7h16M4 12h16M4 17h16"
        />
      )}
    </svg>
  );
}

function navLinkClass(isActive: boolean) {
  if (isActive) return "font-semibold transition-colors";
  return "font-medium text-slate-700 transition-colors hover:text-slate-900";
}

function navLinkStyle(isActive: boolean): CSSProperties | undefined {
  return isActive ? { color: GOLD } : undefined;
}

const dropdownLinkClass =
  "block px-6 py-3 text-sm text-slate-700 transition-colors duration-200 hover:bg-amber-50/80 hover:text-slate-900";

const dropdownLinkPrimaryClass =
  "block px-6 py-3 text-sm font-medium text-slate-800 transition-colors duration-200 hover:bg-amber-50/80 hover:text-slate-900";

interface NavbarProps {
  phone: string;
  phoneDisplay: string;
  offertaAttiva?: boolean;
}

function buildSimpleLinks(offertaAttiva: boolean) {
  const links = [
    ...(offertaAttiva ? [{ href: "/offerte", label: "Offerta del Mese" }] : []),
    { href: "/chi-siamo", label: "Chi Siamo" },
    { href: "/contatti", label: "Contatti" },
  ] as const;
  return links;
}

function FlottaDropdown({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const active = isFlottaActive(pathname);

  return (
    <div className="group relative">
      <Link
        href="/flotta"
        className={`inline-flex items-center gap-1 ${navLinkClass(active)}`}
        style={navLinkStyle(active)}
        aria-current={active ? "page" : undefined}
        onClick={onNavigate}
      >
        Flotta Noleggio
        <ChevronIcon className="h-4 w-4 text-slate-400 transition group-hover:text-slate-600" />
      </Link>

      <div className="invisible absolute left-0 top-full z-50 min-w-[16rem] pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <ul
          className="overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-lg"
          role="menu"
          aria-label="Categorie flotta"
        >
          <li role="none">
            <Link
              href="/flotta"
              className={dropdownLinkPrimaryClass}
              role="menuitem"
              onClick={onNavigate}
            >
              Tutta la flotta
            </Link>
          </li>
          <li className="mx-4 my-1 border-t border-slate-100" role="separator" />
          {FLOTTA_CATEGORIE_NAV.map((categoria) => (
            <li key={categoria.slug} role="none">
              <Link
                href={flottaCategoriaHref(categoria.slug)}
                className={dropdownLinkClass}
                role="menuitem"
                onClick={onNavigate}
              >
                {categoria.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Navbar({ phone, phoneDisplay, offertaAttiva = true }: NavbarProps) {
  const pathname = usePathname();
  const panelId = useId();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [flottaMobileOpen, setFlottaMobileOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  /** Evita chiusura immediata su iOS (stesso tap apre e colpisce il backdrop). */
  const backdropArmedRef = useRef(false);
  const armTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setFlottaMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (armTimerRef.current) {
      clearTimeout(armTimerRef.current);
      armTimerRef.current = null;
    }

    if (!mobileOpen) {
      backdropArmedRef.current = false;
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    backdropArmedRef.current = false;
    armTimerRef.current = setTimeout(() => {
      backdropArmedRef.current = true;
      armTimerRef.current = null;
    }, 350);

    return () => {
      if (armTimerRef.current) {
        clearTimeout(armTimerRef.current);
        armTimerRef.current = null;
      }
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function closeMobileMenu() {
    setMobileOpen(false);
    setFlottaMobileOpen(false);
  }

  function toggleMobileMenu() {
    setMobileOpen((open) => {
      if (open) setFlottaMobileOpen(false);
      return !open;
    });
  }

  function onBackdropPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!backdropArmedRef.current) return;
    closeMobileMenu();
  }

  const phoneButton = (
    <PhoneLink
      phone={phone}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
      style={{ backgroundColor: GOLD }}
    >
      <PhoneIcon className="h-4 w-4 shrink-0" />
      <span>{phoneDisplay}</span>
    </PhoneLink>
  );

  const simpleLinks = buildSimpleLinks(offertaAttiva);

  const mobileDrawer =
    portalReady &&
    createPortal(
      <>
        <div
          className={`fixed inset-0 top-[4.5rem] z-[60] bg-black/30 transition-opacity duration-200 lg:hidden ${
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onPointerDown={onBackdropPointerDown}
          aria-hidden="true"
        />
        <nav
          id={panelId}
          className={`fixed right-0 top-[4.5rem] z-[70] h-[calc(100dvh-4.5rem)] w-full max-w-sm overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-xl transition-transform duration-200 lg:hidden ${
            mobileOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
          }`}
          aria-label="Menu mobile"
          aria-hidden={!mobileOpen}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                className={`block rounded-lg px-4 py-3 ${navLinkClass(isNavActive(pathname, "/"))}`}
                style={navLinkStyle(isNavActive(pathname, "/"))}
                onClick={closeMobileMenu}
              >
                Inizio
              </Link>
            </li>

            <li>
              <button
                type="button"
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left ${navLinkClass(isFlottaActive(pathname))}`}
                style={navLinkStyle(isFlottaActive(pathname))}
                aria-expanded={flottaMobileOpen}
                onClick={() => setFlottaMobileOpen((open) => !open)}
              >
                Flotta Noleggio
                <ChevronIcon
                  className={`h-4 w-4 transition ${flottaMobileOpen ? "rotate-180" : ""}`}
                />
              </button>
              {flottaMobileOpen && (
                <ul className="ml-3 mt-1 space-y-0.5 border-l border-slate-200 pl-3">
                  <li>
                    <Link
                      href="/flotta"
                      className={`rounded-lg ${dropdownLinkPrimaryClass}`}
                      onClick={closeMobileMenu}
                    >
                      Tutta la flotta
                    </Link>
                  </li>
                  {FLOTTA_CATEGORIE_NAV.map((categoria) => (
                    <li key={categoria.slug}>
                      <Link
                        href={flottaCategoriaHref(categoria.slug)}
                        className={`rounded-lg ${dropdownLinkClass}`}
                        onClick={closeMobileMenu}
                      >
                        {categoria.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <a
                href={AUTOLAVAGGIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
                onClick={closeMobileMenu}
              >
                Autolavaggio
              </a>
            </li>

            {simpleLinks.map((item) => {
              const active = isNavActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-lg px-4 py-3 ${navLinkClass(active)}`}
                    style={navLinkStyle(active)}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 border-t border-slate-100 pt-6">{phoneButton}</div>
        </nav>
      </>,
      document.body,
    );

  return (
    <>
      <nav
        className="hidden items-center gap-5 text-[0.95rem] lg:gap-7 lg:flex"
        aria-label="Menu principale"
      >
        <Link
          href="/"
          className={navLinkClass(isNavActive(pathname, "/"))}
          style={navLinkStyle(isNavActive(pathname, "/"))}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          Inizio
        </Link>

        <FlottaDropdown pathname={pathname} />

        <a
          href={AUTOLAVAGGIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={navLinkClass(false)}
        >
          Autolavaggio
        </a>

        {simpleLinks.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={navLinkClass(active)}
              style={navLinkStyle(active)}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}

        {phoneButton}
      </nav>

      <div className="flex items-center gap-3 lg:hidden">
        <PhoneLink
          phone={phone}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm lg:hidden"
          style={{ backgroundColor: GOLD }}
          aria-label={`Chiama ${phoneDisplay}`}
        >
          <PhoneIcon className="h-4 w-4" />
        </PhoneLink>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700"
          aria-expanded={mobileOpen}
          aria-controls={panelId}
          aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
          onClick={(event) => {
            event.stopPropagation();
            toggleMobileMenu();
          }}
        >
          <MenuIcon open={mobileOpen} />
        </button>
      </div>

      {mobileDrawer}
    </>
  );
}
