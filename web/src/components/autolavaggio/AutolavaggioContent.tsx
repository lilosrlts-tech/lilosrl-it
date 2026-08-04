import { SedeCard } from "@/components/shared/SedeCard";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { SEDE_AUTOLAVAGGIO } from "@/lib/sedi";
import type { ImpostazioniSito } from "@/types/impostazioni";

interface AutolavaggioContentProps {
  impostazioni: ImpostazioniSito;
}

export function AutolavaggioContent({ impostazioni }: AutolavaggioContentProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Servizi LILO</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Autolavaggio a Trieste</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-700">
        {impostazioni.descrizione_autolavaggio}
      </p>

      <div className="mt-10">
        <SedeCard
          sede={SEDE_AUTOLAVAGGIO}
          mapHeightClass="h-[360px] lg:h-full lg:min-h-[440px]"
          showCta={false}
        />
      </div>

      <section className="mt-8 rounded-2xl border border-brand-100 bg-brand-50 p-6">
        <h2 className="font-semibold text-brand-900">Contatti</h2>
        <p className="mt-2">
          <PhoneLink
            phone={impostazioni.telefono_autolavaggio || SEDE_AUTOLAVAGGIO.telefono}
            className="text-xl font-bold text-brand-700 hover:underline"
          >
            {impostazioni.telefono_autolavaggio || SEDE_AUTOLAVAGGIO.telefono}
          </PhoneLink>
        </p>
        <p className="mt-2">
          <a href={`mailto:${impostazioni.email_contatto}`} className="text-brand-600 hover:underline">
            {impostazioni.email_contatto}
          </a>
        </p>
      </section>
    </div>
  );
}
