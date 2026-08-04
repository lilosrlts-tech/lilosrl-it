import Link from "next/link";
import { ImageGallery } from "@/components/flotta/ImageGallery";
import { MobileStickyCta } from "@/components/flotta/MobileStickyCta";
import { PreventivoForm } from "@/components/flotta/PreventivoForm";
import { VeicoloAccessori } from "@/components/flotta/VeicoloAccessori";
import { VeicoloFaq } from "@/components/flotta/VeicoloFaq";
import { VeicoloHighlights } from "@/components/flotta/VeicoloHighlights";
import { VeicoloPromoDurata } from "@/components/flotta/VeicoloPromoDurata";
import { VeicoloSpecs } from "@/components/flotta/VeicoloSpecs";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { buildVeicoloJsonLd } from "@/lib/json-ld";
import { flottaCategoriaHref } from "@/lib/nav-config";
import { labelPromoDurataSecondario } from "@/lib/promozioni-durata";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import { veicoloCanonicalUrl } from "@/lib/seo";
import {
  getPrezzoCommercialNote,
  getUnitaDisponibiliLabel,
  getVeicoloImageAlt,
  getVeicoloImageVariant,
} from "@/lib/veicolo-utils";
import { stripTargaFromPublicCopy, cleanPublicHighlight, isUsefulPublicHighlight, sanitizePublicBrandCopy } from "@/lib/veicolo-seo";
import { getVeicoloSintesiVendibile } from "@/lib/veicolo-sintesi";
import { getDisplayName, getPrezzoGiornaliero } from "@/lib/veicoli";
import type { VeicoloPubblico } from "@/types/veicolo";

interface VeicoloDettaglioContentProps {
  veicolo: VeicoloPubblico;
}

export async function VeicoloDettaglioContent({ veicolo }: VeicoloDettaglioContentProps) {
  const impostazioni = await loadImpostazioni();
  const name = getDisplayName(veicolo);
  const prezzo = getPrezzoGiornaliero(veicolo);
  const prezzoPromo = veicolo.prezzo_promo;
  const giornaliero = prezzoPromo?.giornaliero ?? prezzo?.importo ?? null;
  const promoLine = prezzoPromo ? labelPromoDurataSecondario(prezzoPromo) : null;
  const notaPrezzo = getPrezzoCommercialNote(veicolo);
  const imageAlt = getVeicoloImageAlt(veicolo);
  const canonical = veicoloCanonicalUrl(veicolo.slug);
  const jsonLd = buildVeicoloJsonLd(veicolo);
  const categoriaHref = veicolo.categoria?.slug
    ? flottaCategoriaHref(veicolo.categoria.slug)
    : "/flotta";
  const aiSummary = getVeicoloSintesiVendibile(veicolo);
  const descrizioneCompleta = veicolo.descrizione_completa
    ? sanitizePublicBrandCopy(stripTargaFromPublicCopy(veicolo.descrizione_completa))
    : null;
  const sottotitolo = veicolo.sottotitolo
    ? sanitizePublicBrandCopy(stripTargaFromPublicCopy(veicolo.sottotitolo))
    : null;
  const highlights = veicolo.ai_highlights
    .map((item) => cleanPublicHighlight(item))
    .filter(isUsefulPublicHighlight);
  const unitaLabel = getUnitaDisponibiliLabel(veicolo);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SitePageWrapper impostazioni={impostazioni}>
        <main className="mx-auto max-w-6xl px-4 py-8 pb-28 lg:pb-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/" className="hover:text-brand-600">
                  Inizio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/flotta" className="hover:text-brand-600">
                  Flotta
                </Link>
              </li>
              {veicolo.categoria && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href={categoriaHref} className="hover:text-brand-600">
                      {veicolo.categoria.nome}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li className="font-medium text-slate-800" aria-current="page">
                {veicolo.marca} {veicolo.modello}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <article itemScope itemType="https://schema.org/Product">
              <meta itemProp="name" content={name} />
              <link itemProp="url" href={canonical} />

              <header className="mb-6">
                {veicolo.categoria && (
                  <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                    <Link href={categoriaHref} className="hover:underline">
                      {veicolo.categoria.nome}
                    </Link>
                  </p>
                )}
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {name}
                </h1>
                {unitaLabel && (
                  <p className="mt-2 inline-flex rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                    {unitaLabel}
                  </p>
                )}
                {sottotitolo && (
                  <p className="mt-2 text-lg text-slate-600">{sottotitolo}</p>
                )}
                {giornaliero != null && (
                  <div
                    className="mt-4"
                    itemProp="offers"
                    itemScope
                    itemType="https://schema.org/Offer"
                  >
                    <meta itemProp="priceCurrency" content={prezzo?.valuta ?? "EUR"} />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Tariffa giornaliera
                    </p>
                    <p className="text-3xl font-extrabold tracking-tight text-slate-900">
                      <span itemProp="price" content={String(Math.round(giornaliero))}>
                        € {Math.round(giornaliero)}
                      </span>
                      <span className="text-lg font-semibold text-slate-600"> / giorno</span>
                    </p>
                    {promoLine && (
                      <p className="mt-1 text-sm text-emerald-700">{promoLine}</p>
                    )}
                    {notaPrezzo && (
                      <p className="mt-1.5 text-sm leading-snug text-slate-500">{notaPrezzo}</p>
                    )}
                    <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                      <span className="tracking-wide text-amber-500" aria-hidden="true">
                        ★★★★★
                      </span>
                      <span>Recensioni Google</span>
                      <span className="text-slate-300" aria-hidden="true">
                        ·
                      </span>
                      <span>20+ anni a Trieste</span>
                    </p>
                  </div>
                )}
              </header>

              <ImageGallery
                foto={veicolo.foto}
                imageAlt={imageAlt}
                variant={getVeicoloImageVariant(veicolo)}
              />

              {aiSummary && (
                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-2 text-lg font-semibold text-slate-900">In sintesi</h2>
                  <p className="leading-relaxed text-slate-700">{aiSummary}</p>
                </section>
              )}

              {highlights.length > 0 && <VeicoloHighlights items={highlights} />}

              <div className="mt-8 space-y-8">
                <VeicoloSpecs veicolo={veicolo} />

                <VeicoloAccessori accessori={veicolo.accessori ?? []} />

                {prezzoPromo && <VeicoloPromoDurata prezzo={prezzoPromo} />}

                {descrizioneCompleta && (
                  <section>
                    <h2 className="mb-3 text-lg font-semibold text-slate-900">Descrizione</h2>
                    <div className="prose prose-slate max-w-none leading-relaxed text-slate-700">
                      {descrizioneCompleta.split("\n").map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                )}

                {veicolo.ai_context && (
                  <section className="rounded-xl bg-slate-100 px-5 py-4 text-sm text-slate-600">
                    <strong className="text-slate-800">Servizio a Trieste: </strong>
                    {stripTargaFromPublicCopy(veicolo.ai_context)}
                  </section>
                )}

                <VeicoloFaq
                  items={veicolo.ai_faq.map((item) => ({
                    q: stripTargaFromPublicCopy(item.q),
                    a: stripTargaFromPublicCopy(item.a),
                  }))}
                />

                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-slate-900">Ritiro a Trieste</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Ritiro e riconsegna presso la sede in{" "}
                    {impostazioni.indirizzo_noleggio}. Serviamo Trieste e provincia con tariffe
                    trasparenti e assistenza dedicata. Tel.{" "}
                    <PhoneLink phone={impostazioni.telefono_noleggio} className="text-brand-600">
                      {impostazioni.telefono_noleggio}
                    </PhoneLink>
                  </p>
                </section>
              </div>
            </article>

            <div className="lg:pt-0">
              <PreventivoForm veicolo={veicolo} telefono={impostazioni.telefono_noleggio} />
            </div>
          </div>

          <MobileStickyCta
            telefono={impostazioni.telefono_noleggio}
            prezzoGiorno={prezzo?.importo}
            veicoloName={name}
          />
        </main>
      </SitePageWrapper>
    </>
  );
}
