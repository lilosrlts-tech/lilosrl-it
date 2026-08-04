export type VeicoloPlaceholderVariant = "auto" | "pulmino" | "furgone";

interface VeicoloImagePlaceholderProps {
  variant?: VeicoloPlaceholderVariant;
  /** Breve etichetta sotto l'icona (es. marca/modello) */
  label?: string;
}

function VehicleIcon({ variant }: { variant: VeicoloPlaceholderVariant }) {
  if (variant === "auto") {
    return (
      <svg viewBox="0 0 64 40" className="h-16 w-24 text-brand-600/70" aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 28h4l1.5-6h37l2 6h4c1.1 0 2 .9 2 2v2H6v-2c0-1.1.9-2 2-2zm6.2-8 2.8-7.2C17.8 11.3 19.3 10 21 10h22c1.7 0 3.2 1.3 3.4 2.8L49.8 20H14.2zM14 34a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        />
      </svg>
    );
  }

  if (variant === "pulmino") {
    return (
      <svg viewBox="0 0 72 40" className="h-16 w-28 text-brand-600/70" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6 28h3l1.2-5h46l1.8 5h3c1.1 0 2 .9 2 2v2H4v-2c0-1.1.9-2 2-2zm5.5-7 2.5-6.5C14.8 12.8 16.5 11 18.5 11h35c2 0 3.7 1.8 4 3.5L60.5 21H11.5zM12 34a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm40 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM22 17h4v3h-4v-3zm8 0h4v3h-4v-3zm8 0h4v3h-4v-3z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 72 40" className="h-16 w-28 text-brand-600/70" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 28h4l1.8-7h44l2.2 7h4c1.1 0 2 .9 2 2v2H2v-2c0-1.1.9-2 2-2zm7-9 3-8C14.6 9.5 16.4 8 18.5 8h35c2.1 0 3.9 1.5 4.2 3.5l3 8H11zM10 34a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm44 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
      />
    </svg>
  );
}

export function VeicoloImagePlaceholder({
  variant = "furgone",
  label,
}: VeicoloImagePlaceholderProps) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-brand-50/40 to-slate-100 px-4"
      role="img"
      aria-label={label ? `Immagine non disponibile — ${label}` : "Immagine veicolo non disponibile"}
    >
      <div className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-slate-200/80">
        <VehicleIcon variant={variant} />
      </div>
      <p className="mt-3 text-center text-xs font-medium uppercase tracking-wider text-slate-400">
        Foto in arrivo
      </p>
      {label && (
        <p className="mt-1 max-w-[90%] truncate text-center text-sm font-medium text-slate-500">
          {label}
        </p>
      )}
    </div>
  );
}
