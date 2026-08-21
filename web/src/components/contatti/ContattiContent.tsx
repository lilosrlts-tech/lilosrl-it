import { SedeCard } from "@/components/shared/SedeCard";
import { SeoLongContentSections } from "@/components/shared/SeoLongContentSections";
import { CONTATTI_LONG_CONTENT } from "@/lib/seo-page-content";
import { SEDE_AUTOLAVAGGIO, SEDE_NOLEGGIO } from "@/lib/sedi";
import type { ImpostazioniSito } from "@/types/impostazioni";

interface ContattiContentProps {
  impostazioni: ImpostazioniSito;
}

export function ContattiContent({ impostazioni }: ContattiContentProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Contatti</h1>
      <p className="mt-2 text-slate-600">
        Sede noleggio, autolavaggio e recapiti LILO S.r.l. a Trieste
      </p>

      <div className="mt-10 space-y-8">
        <SedeCard sede={SEDE_NOLEGGIO} mapHeightClass="h-[360px] lg:h-full lg:min-h-[420px]" />
        <SedeCard sede={SEDE_AUTOLAVAGGIO} mapHeightClass="h-[360px] lg:h-full lg:min-h-[420px]" />
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
        <a
          href={`mailto:${impostazioni.email_contatto}`}
          className="mt-1 block text-lg text-brand-600 hover:underline"
        >
          {impostazioni.email_contatto}
        </a>
      </section>

      <SeoLongContentSections content={CONTATTI_LONG_CONTENT} idPrefix="contatti" />
    </div>
  );
}
