"use client";

import {
  Briefcase,
  Building2,
  CreditCard,
  Fuel,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const ICON_BY_KEYWORD: { test: RegExp; Icon: LucideIcon }[] = [
  { test: /compat|citt[aà]|urbane|parchegg/i, Icon: Building2 },
  { test: /profession|privat|consegne|traslochi|strument/i, Icon: Briefcase },
  { test: /consum|carbur|economic/i, Icon: Fuel },
  { test: /carta|credito|flessib|noleggio/i, Icon: CreditCard },
];

function iconFor(text: string, index: number): LucideIcon {
  for (const row of ICON_BY_KEYWORD) {
    if (row.test.test(text)) return row.Icon;
  }
  const fallback: LucideIcon[] = [Building2, Briefcase, Fuel, CreditCard, Sparkles];
  return fallback[index % fallback.length]!;
}

interface VeicoloHighlightsProps {
  items: string[];
}

export function VeicoloHighlights({ items }: VeicoloHighlightsProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Punti di forza</h2>
      <ul className="grid gap-3">
        {items.map((item, index) => {
          const Icon = iconFor(item, index);
          const [title, ...rest] = item.split(":");
          const body = rest.join(":").trim();
          return (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-lime-500/20 bg-lime-500/10 text-lime-600"
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                {body ? (
                  <>
                    <p className="text-sm font-semibold text-slate-900 sm:text-base">{title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{body}</p>
                  </>
                ) : (
                  <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{item}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
