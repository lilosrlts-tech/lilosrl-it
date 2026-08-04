import type { ReactNode } from "react";
import type { CosaTrasportiId } from "@/lib/cosa-trasporti";

function IconWrap({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg ${
        active ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-700"
      }`}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5",
};

export function CosaTrasportiIcon({
  id,
  active = false,
}: {
  id: CosaTrasportiId;
  active?: boolean;
}) {
  switch (id) {
    case "scatole-consegne":
      return (
        <IconWrap active={active}>
          <svg {...svgProps}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <path d="M3.3 7 12 12l8.7-5M12 22V12" />
          </svg>
        </IconWrap>
      );
    case "elettrodomestico":
      return (
        <IconWrap active={active}>
          <svg {...svgProps}>
            <rect x="6" y="3" width="12" height="18" rx="2" />
            <circle cx="12" cy="15" r="2" />
            <path d="M9 7h6" />
          </svg>
        </IconWrap>
      );
    case "frigorifero":
      return (
        <IconWrap active={active}>
          <svg {...svgProps}>
            <rect x="7" y="2" width="10" height="20" rx="2" />
            <path d="M7 11h10M10 6v2M10 14v2" />
          </svg>
        </IconWrap>
      );
    case "divano":
      return (
        <IconWrap active={active}>
          <svg {...svgProps}>
            <path d="M4 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z" />
            <path d="M6 9V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M6 15v2M18 15v2" />
          </svg>
        </IconWrap>
      );
    case "armadio":
      return (
        <IconWrap active={active}>
          <svg {...svgProps}>
            <rect x="5" y="3" width="14" height="18" rx="1.5" />
            <path d="M12 3v18M9 12h.01M15 12h.01" />
          </svg>
        </IconWrap>
      );
    case "moto":
      return (
        <IconWrap active={active}>
          <svg {...svgProps}>
            <circle cx="6.5" cy="16.5" r="2.5" />
            <circle cx="17.5" cy="16.5" r="2.5" />
            <path d="M10 16.5h4M8 10l2 6.5M14 9l-1.5 7.5M8 10h4l2-1h3" />
          </svg>
        </IconWrap>
      );
    case "trasloco-monolocale":
      return (
        <IconWrap active={active}>
          <svg {...svgProps}>
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V20h14V9.5" />
            <path d="M10 20v-6h4v6" />
          </svg>
        </IconWrap>
      );
    case "trasloco-bilocale":
      return (
        <IconWrap active={active}>
          <svg {...svgProps}>
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V20h14V9.5" />
            <path d="M9 20v-5h6v5M12 9v2" />
          </svg>
        </IconWrap>
      );
    case "trasloco-trilocale":
      return (
        <IconWrap active={active}>
          <svg {...svgProps}>
            <path d="M3 11 12 3l9 8" />
            <path d="M5 10v10h14V10" />
            <path d="M8 20v-4h3v4M13 20v-4h3v4M9 8h6" />
          </svg>
        </IconWrap>
      );
    default:
      return null;
  }
}
