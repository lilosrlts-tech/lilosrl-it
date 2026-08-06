import type { ReactNode } from "react";
import type { ImpostazioniSito } from "@/types/impostazioni";
import { parsePuntiForza } from "@/lib/cms";

const GOLD = "#D4AF37";

interface Strength {
  title: string;
  description: string;
  icon: ReactNode;
}

function ExperienceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
      <path
        d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 17l.9-5.4L4.2 7.7l5.4-.8L12 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlexIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
      <rect x="3" y="8" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="18" r="1.5" fill="currentColor" />
      <circle cx="16" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

function HygieneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
      <path
        d="M12 3c-3 4-6 6-6 10a6 6 0 0 0 12 0c0-4-3-6-6-10z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 14l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TransparencyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const ICONS = [ExperienceIcon, FlexIcon, HygieneIcon, TransparencyIcon];

interface StrengthsSectionProps {
  impostazioni: ImpostazioniSito;
}

export function StrengthsSection({ impostazioni }: StrengthsSectionProps) {
  const punti = parsePuntiForza(impostazioni.home_punti_forza_json);
  const strengths: Strength[] = punti.map((item, index) => ({
    ...item,
    icon: (() => {
      const Icon = ICONS[index % ICONS.length];
      return <Icon />;
    })(),
  }));

  return (
    <section className="py-16 sm:py-20" aria-labelledby="strengths-heading">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm"
            style={{ color: GOLD }}
          >
            Perché LILO
          </p>
          <h2
            id="strengths-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {impostazioni.home_punti_forza_titolo}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map((item) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                {item.icon}
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
