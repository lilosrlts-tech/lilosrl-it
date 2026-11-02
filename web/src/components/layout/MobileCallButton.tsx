"use client";

import { usePathname } from "next/navigation";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { FLOTTA_CATEGORIE_NAV } from "@/lib/nav-config";

const CATEGORIE_FLOTTA = new Set<string>(FLOTTA_CATEGORIE_NAV.map((item) => item.slug));

function isSchedaVeicolo(pathname: string): boolean {
  const match = pathname.match(/^\/flotta\/([^/]+)\/?$/);
  if (!match) return false;
  return !CATEGORIE_FLOTTA.has(match[1]);
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

/** Tasto chiama mobile: stessa misura del tondo che era in testata, fermo a un quarto di pagina. */
export function MobileCallButton({
  phone,
  phoneDisplay,
}: {
  phone: string;
  phoneDisplay: string;
}) {
  const pathname = usePathname();
  if (isSchedaVeicolo(pathname)) return null;

  return (
    <PhoneLink
      phone={phone}
      className="fixed right-3 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-sm hover:bg-[#15803d] lg:hidden"
      style={{ top: "25vh" }}
      aria-label={`Chiama ${phoneDisplay}`}
    >
      <PhoneIcon />
    </PhoneLink>
  );
}
