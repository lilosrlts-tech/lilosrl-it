import type { AiFaqItem } from "@/types/veicolo";

interface VeicoloFaqProps {
  items: AiFaqItem[];
}

export function VeicoloFaq({ items }: VeicoloFaqProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 id="faq-heading" className="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
        Domande frequenti
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl border border-slate-100 bg-slate-50 open:bg-white open:shadow-sm"
          >
            <summary className="cursor-pointer list-none px-3 py-3 text-sm font-medium text-slate-900 marker:content-none sm:px-4 sm:text-base [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0 flex-1 text-left leading-snug">{item.q}</span>
                <span className="shrink-0 text-brand-600 transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="border-t border-slate-100 px-3 py-3 text-sm leading-relaxed text-slate-600 sm:px-4">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
