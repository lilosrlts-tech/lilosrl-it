import Link from "next/link";
import { VeicoloFaq } from "@/components/flotta/VeicoloFaq";
import { StaffAccoglienzaSection } from "@/components/home/StaffAccoglienzaSection";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { SedeCard } from "@/components/shared/SedeCard";
import { parseListaServizi } from "@/lib/cms";
import {
  AUTOLAVAGGIO_FEATURES,
  AUTOLAVAGGIO_SERVICES,
  AUTOLAVAGGIO_SPECIALITA,
  CHI_SIAMO_FAQ,
  CHI_SIAMO_HERO,
  GOLD,
  GOLD_TEXT,
  INSTITUTIONAL_CLIENTS,
  MISSION_BULLETS,
  MISSION_TEXT,
  NOLEGGIO_BENEFITS,
  NOLEGGIO_CATEGORIES,
  PRIVATE_CLIENTS,
  STATS,
  TIMELINE,
  VALUES,
  VISION_TEXT,
  WHY_CHOOSE,
} from "@/lib/chi-siamo-data";
import { resolveSedeAutolavaggio, resolveSedeNoleggio } from "@/lib/sedi";
import type { ImpostazioniSito } from "@/types/impostazioni";

interface ChiSiamoContentProps {
  impostazioni: ImpostazioniSito;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{children}</h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-slate-600">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: GOLD }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ChiSiamoContent({ impostazioni }: ChiSiamoContentProps) {
  const tel = impostazioni.telefono_noleggio;
  const heroTitle = impostazioni.chi_siamo_hero_titolo ?? CHI_SIAMO_HERO.title;
  const heroSubtitle = impostazioni.chi_siamo_hero_sottotitolo ?? CHI_SIAMO_HERO.subtitle;
  const serviziNoleggio = parseListaServizi(impostazioni.servizi_noleggio_lista, NOLEGGIO_BENEFITS);
  const sedeNoleggio = resolveSedeNoleggio(impostazioni);
  const sedeAutolavaggio = resolveSedeAutolavaggio(impostazioni);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: GOLD_TEXT }}>
          Chi Siamo
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
          {heroTitle}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{heroSubtitle}</p>
        {impostazioni.chi_siamo_intro && (
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
            {impostazioni.chi_siamo_intro.replace(/\bDal 2003 LILO opera\b/i, "Dal 2003 LILO S.r.l. opera").replace(/\bDal 2003 LILO\b(?!\s*S\.?\s*[Rr])/i, "Dal 2003 LILO S.r.l.")}
          </p>
        )}
      </header>

      <section className="mt-12" aria-labelledby="timeline-heading" id="storia">
        <SectionTitle>
          <span id="timeline-heading">{heroSubtitle}</span>
        </SectionTitle>
        <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-6">
          {TIMELINE.map((event) => (
            <article
              key={event.year}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
                <span
                  className="inline-flex w-fit max-w-full shrink-0 self-start rounded-full px-3 py-1 text-xs font-bold text-white sm:text-sm"
                  style={{ backgroundColor: GOLD }}
                >
                  {event.year}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {event.body}
                  </p>
                  {event.bullets && <BulletList items={event.bullets} />}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-slate-900 px-6 py-10 text-white sm:px-10">
        <h2 className="text-2xl font-bold sm:text-3xl">LILO SRL Oggi: Eccellenza e Affidabilità a Trieste</h2>
        <h3 className="mt-6 text-lg font-semibold" style={{ color: GOLD_TEXT }}>
          I Nostri Numeri
        </h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {STATS.map((stat) => (
            <li key={stat} className="flex items-start gap-2 text-slate-200">
              <span className="text-lg" style={{ color: GOLD_TEXT }} aria-hidden="true">
                ✓
              </span>
              {stat}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 space-y-10" aria-labelledby="servizi-heading">
        <SectionTitle>
          <span id="servizi-heading">I Nostri Servizi</span>
        </SectionTitle>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">
            Noleggio Furgoni, Pulmini 9 Posti e Auto
          </h3>
          <p className="mt-2 text-slate-600">Flotta moderna a Trieste per ogni esigenza</p>
          <BulletList items={NOLEGGIO_CATEGORIES} />
          <h4 className="mt-6 font-semibold text-slate-900">Vantaggi del noleggio LILO</h4>
          <BulletList items={serviziNoleggio} />
          <Link
            href="/flotta"
            className="mt-6 inline-block rounded-full px-5 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: GOLD }}
          >
            Scopri la flotta
          </Link>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Autolavaggio Professionale</h3>
          <p className="mt-2 text-slate-600">Tecnologia avanzata e rispetto ambientale</p>
          <BulletList items={AUTOLAVAGGIO_FEATURES} />
          <h4 className="mt-6 font-semibold text-slate-900">Servizi Autolavaggio</h4>
          <BulletList items={AUTOLAVAGGIO_SERVICES} />
          <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
            <strong className="text-slate-900">La nostra specialità: </strong>
            {AUTOLAVAGGIO_SPECIALITA}
          </p>
          <Link
            href="/autolavaggio"
            className="mt-6 inline-block font-semibold hover:underline"
            style={{ color: GOLD_TEXT }}
          >
            Vai all&apos;autolavaggio →
          </Link>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Vendita Autoveicoli</h3>
          <p className="mt-2 text-slate-600">
            Consulenza professionale per l&apos;acquisto del veicolo più adatto alle tue esigenze.
          </p>
        </article>
      </section>

      <section className="mt-16" aria-labelledby="clienti-heading">
        <SectionTitle>
          <span id="clienti-heading">I Nostri Clienti Istituzionali</span>
        </SectionTitle>
        <p className="mt-3 text-slate-600">
          Partner affidabile per enti pubblici e grandi aziende. Affidabilità documentata con
          contratti ufficiali verificabili.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INSTITUTIONAL_CLIENTS.map((client) => (
            <div
              key={client.name}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{client.name}</h3>
              {client.subtitle && (
                <p className="mt-1 text-sm text-slate-500">{client.subtitle}</p>
              )}
              {client.cig && (
                <p className="mt-2 text-xs font-medium text-slate-400">CIG: {client.cig}</p>
              )}
              {client.href ? (
                <a
                  href={client.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-4 text-sm font-semibold hover:underline"
                  style={{ color: GOLD_TEXT }}
                >
                  {client.linkLabel ?? "Documentazione"} →
                </a>
              ) : client.linkLabel ? (
                <p className="mt-auto pt-4 text-sm font-medium text-slate-500">{client.linkLabel}</p>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-xl bg-slate-50 p-5">
          <h3 className="font-semibold text-slate-900">Grandi Aziende</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {PRIVATE_CLIENTS.map((name) => (
              <li
                key={name}
                className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 ring-1 ring-slate-200"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="valori-heading">
        <SectionTitle>
          <span id="valori-heading">I Nostri Valori</span>
        </SectionTitle>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value) => (
            <div key={value.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold" style={{ color: GOLD_TEXT }}>
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="sedi-heading">
        <SectionTitle>
          <span id="sedi-heading">Le Nostre Sedi</span>
        </SectionTitle>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">LILO S.R.L. – Sede Legale</h3>
          <p className="mt-2 text-sm text-slate-600">
            Via Giuseppe De Coletti, 7
            <br />
            34143 Trieste (TS)
          </p>
          <p className="mt-3 text-sm">
            <PhoneLink phone={tel} className="font-semibold hover:underline" style={{ color: GOLD_TEXT }}>
              {tel}
            </PhoneLink>
            <br />
            <a href="mailto:info@lilosrl.it" className="text-slate-600 hover:underline">
              info@lilosrl.it
            </a>
          </p>
          <p className="mt-3 text-xs text-slate-500">P.IVA 01249580323 · REA TS-135864</p>
        </div>

        <div className="mt-8 space-y-8">
          <SedeCard sede={sedeNoleggio} />
          <SedeCard sede={sedeAutolavaggio} />
        </div>
      </section>

      <div className="mt-16">
        <StaffAccoglienzaSection />
      </div>

      <section className="mt-10" aria-label="Altri motivi per scegliere LILO">
        <div className="grid gap-4 sm:grid-cols-2">
          {WHY_CHOOSE.map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">La Nostra Mission</h2>
          <p className="mt-3 leading-relaxed text-slate-600">{MISSION_TEXT}</p>
          <BulletList items={MISSION_BULLETS} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">La Nostra Vision</h2>
          <p className="mt-3 leading-relaxed text-slate-600">{VISION_TEXT}</p>
        </div>
      </section>

      <section className="mt-16">
        <VeicoloFaq items={CHI_SIAMO_FAQ} />
      </section>

      <section className="mt-12 rounded-2xl px-6 py-8 text-center text-white sm:px-10" style={{ backgroundColor: GOLD }}>
        <h2 className="text-xl font-bold">Hai bisogno di un preventivo?</h2>
        <p className="mt-2 text-white/90">Contattaci per noleggio, autolavaggio o soluzioni aziendali.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <PhoneLink
            phone={tel}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Chiama {tel}
          </PhoneLink>
          <Link
            href="/contatti"
            className="rounded-full border border-white/60 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Contatti
          </Link>
        </div>
      </section>
    </div>
  );
}
