import { COMPANY, SITE_URL } from "@/lib/constants";
import { telefonoE164 } from "@/lib/impostazioni";
import { googleMapsLink } from "@/lib/maps";
import { orariToOpeningHoursSpecification } from "@/lib/opening-hours-schema";
import {
  FLOTTA_CATEGORIA_COPY,
  FLOTTA_CATEGORIA_SLUGS,
  flottaCategoriaCanonical,
  getFlottaCategoriaNavLabel,
} from "@/lib/flotta-categoria-config";
import {
  getCoverImage,
  getDisplayName,
  getPrezzoGiornaliero,
} from "@/lib/veicoli";
import { isFurgoneCategory } from "@/lib/specifiche-tecniche-utils";
import { useCasesForVeicolo } from "@/lib/cosa-trasporti";
import { getVeicoloFotoAlt, getVeicoloImageUrlsForSchema, stripTargaFromPublicCopy } from "@/lib/veicolo-seo";
import { veicoloCanonicalUrl } from "@/lib/seo";
import {
  getNotaCauzione,
  getNotaKmInclusi,
  getTariffaPerVeicolo,
  type TariffaCategoriaSlug,
} from "@/lib/tariffe-categoria";
import type { VeicoloPubblico, AiFaqItem } from "@/types/veicolo";
import type { ImpostazioniSito } from "@/types/impostazioni";

function autoRentalProvider() {
  return {
    "@type": "AutoRental" as const,
    "@id": `${SITE_URL}/#autonoleggio`,
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    url: SITE_URL,
    telephone: COMPANY.phoneE164,
    email: COMPANY.email,
    address: {
      "@type": "PostalAddress" as const,
      streetAddress: COMPANY.streetAddress,
      addressLocality: COMPANY.city,
      addressRegion: COMPANY.region,
      postalCode: COMPANY.postalCode,
      addressCountry: COMPANY.country,
    },
    geo: {
      "@type": "GeoCoordinates" as const,
      latitude: COMPANY.geo.latitude,
      longitude: COMPANY.geo.longitude,
    },
    areaServed: [
      { "@type": "City" as const, name: "Trieste" },
      { "@type": "AdministrativeArea" as const, name: "Provincia di Trieste" },
    ],
  };
}

/** Tipi schema: Vehicle in testa per furgoni/pulmini (AI + Google). */
function schemaTypes(categoriaSlug: string | undefined): string[] {
  if (categoriaSlug === "auto") return ["Car", "Vehicle", "Product"];
  return ["Vehicle", "Product"];
}

function quantitativeMm(value: number) {
  return {
    "@type": "QuantitativeValue" as const,
    value,
    unitCode: "MMT",
    unitText: "mm",
  };
}

function quantitativeMc(value: number) {
  return {
    "@type": "QuantitativeValue" as const,
    value,
    unitCode: "MTQ",
    unitText: "m³",
  };
}

/** Spec vano di carico con fallback campi legacy. */
function resolveCargoSpecs(veicolo: VeicoloPubblico) {
  const spec = veicolo.specifiche_tecniche;
  return {
    volumeMc: spec.volume_metri_cubi ?? spec.volume_carico_mc,
    portataKg: spec.portata_utile_kg ?? spec.portata_kg,
    lunghezzaMm: spec.lunghezza_vano_mm ?? spec.vano_lunghezza_mm,
    larghezzaMm: spec.larghezza_vano_mm ?? spec.vano_larghezza_mm,
    altezzaMm: spec.altezza_vano_mm ?? spec.vano_altezza_mm,
    larghezzaPassaruotaMm: spec.larghezza_tra_passaruota_mm,
  };
}

function propertyValue(
  name: string,
  value: string | number,
  extras?: Record<string, unknown>,
): Record<string, unknown> {
  return {
    "@type": "PropertyValue",
    name,
    value,
    ...extras,
  };
}

function buildVehicleAdditionalProperties(veicolo: VeicoloPubblico): Record<string, unknown>[] {
  const spec = veicolo.specifiche_tecniche;
  const cargo = resolveCargoSpecs(veicolo);
  const props: Record<string, unknown>[] = [];
  const tariffa = getTariffaPerVeicolo(veicolo);

  if (isFurgoneCategory(veicolo)) {
    if (cargo.volumeMc != null) {
      props.push(
        propertyValue("Volume vano di carico", cargo.volumeMc, {
          unitCode: "MTQ",
          unitText: "m³",
        }),
      );
    }
    if (cargo.portataKg != null) {
      props.push(
        propertyValue("Portata utile", cargo.portataKg, {
          unitCode: "KGM",
          unitText: "kg",
        }),
      );
    }
    if (cargo.lunghezzaMm != null) {
      props.push(
        propertyValue("Lunghezza vano di carico", cargo.lunghezzaMm, {
          unitCode: "MMT",
          unitText: "mm",
        }),
      );
    }
    if (cargo.larghezzaMm != null) {
      props.push(
        propertyValue("Larghezza vano di carico", cargo.larghezzaMm, {
          unitCode: "MMT",
          unitText: "mm",
        }),
      );
    }
    if (cargo.altezzaMm != null) {
      props.push(
        propertyValue("Altezza vano di carico", cargo.altezzaMm, {
          unitCode: "MMT",
          unitText: "mm",
        }),
      );
    }
    if (cargo.larghezzaPassaruotaMm != null) {
      props.push(
        propertyValue("Larghezza tra passaruota", cargo.larghezzaPassaruotaMm, {
          unitCode: "MMT",
          unitText: "mm",
        }),
      );
    }
  } else if (cargo.portataKg != null) {
    props.push(
      propertyValue("Portata utile", cargo.portataKg, {
        unitCode: "KGM",
        unitText: "kg",
      }),
    );
  }

  if (tariffa) {
    props.push(
      propertyValue("Cauzione", tariffa.cauzioneEuro, {
        unitCode: "EUR",
        unitText: "EUR",
        description: getNotaCauzione(tariffa),
      }),
    );
    props.push(propertyValue("Km inclusi", getNotaKmInclusi(tariffa)));
  }

  if (spec.classe_ambientale) {
    props.push(propertyValue("Classe ambientale", spec.classe_ambientale));
  }

  if (spec.capacita_bagagliaio_valigie != null) {
    props.push(
      propertyValue("Capacità bagagliaio", spec.capacita_bagagliaio_valigie, {
        unitText: "valigie",
      }),
    );
  }

  if (spec.configurazione_sedili) {
    props.push(propertyValue("Configurazione sedili", spec.configurazione_sedili));
  }

  const useCases = useCasesForVeicolo(veicolo);
  if (useCases.length > 0) {
    props.push(propertyValue("Ideale per", useCases.map((u) => u.label).join(", ")));
  }

  return props;
}

function buildVeicoloFaqEntities(veicolo: VeicoloPubblico): AiFaqItem[] {
  return (veicolo.ai_faq ?? [])
    .map((item) => ({
      q: stripTargaFromPublicCopy(item.q).trim(),
      a: stripTargaFromPublicCopy(item.a).trim(),
    }))
    .filter((item) => item.q.length > 0 && item.a.length > 0);
}

/** FAQPage top-level (rich results Google + parsing AI). */
function buildVeicoloFaqPageJsonLd(
  veicolo: VeicoloPubblico,
  faqItems: AiFaqItem[],
): Record<string, unknown> | null {
  if (faqItems.length === 0) return null;
  const canonical = veicoloCanonicalUrl(veicolo.slug);
  return {
    "@type": "FAQPage",
    "@id": `${canonical}#faq`,
    url: canonical,
    name: `Domande frequenti — ${getDisplayName(veicolo)}`,
    isPartOf: { "@id": `${canonical}#veicolo` },
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function buildVeicoloJsonLd(veicolo: VeicoloPubblico): Record<string, unknown> {
  const name = getDisplayName(veicolo);
  const canonical = veicoloCanonicalUrl(veicolo.slug);
  const prezzo = getPrezzoGiornaliero(veicolo);
  const images = getVeicoloImageUrlsForSchema(veicolo);
  const coverFoto =
    veicolo.foto.find((f) => f.is_copertina) ?? veicolo.foto[0] ?? null;
  const imageAlt = getVeicoloFotoAlt(veicolo, coverFoto);

  const categoriaNome = veicolo.categoria?.nome ?? "Veicolo";
  const types = schemaTypes(veicolo.categoria?.slug);
  const cargo = resolveCargoSpecs(veicolo);
  const useCases = useCasesForVeicolo(veicolo);
  const additionalProperty = buildVehicleAdditionalProperties(veicolo);
  const tariffa = getTariffaPerVeicolo(veicolo);
  const faqItems = buildVeicoloFaqEntities(veicolo);
  const faqPage = buildVeicoloFaqPageJsonLd(veicolo, faqItems);

  const offerAdditional: Record<string, unknown>[] = [];
  if (tariffa) {
    offerAdditional.push(
      propertyValue("Cauzione", tariffa.cauzioneEuro, {
        unitCode: "EUR",
        unitText: "EUR",
        description: getNotaCauzione(tariffa),
      }),
      propertyValue("Km inclusi / condizioni", getNotaKmInclusi(tariffa)),
    );
  }

  const keywordParts = [
    ...useCases.map((u) => u.label),
    "noleggio Trieste",
    categoriaNome,
  ];
  if (cargo.volumeMc != null) {
    keywordParts.push(`${String(cargo.volumeMc).replace(".", ",")} m³`);
  }
  if (cargo.portataKg != null) {
    keywordParts.push(`portata ${cargo.portataKg} kg`);
  }

  const generated: Record<string, unknown> = {
    "@type": types,
    "@id": `${canonical}#veicolo`,
    name,
    description: stripTargaFromPublicCopy(
      veicolo.ai_summary ??
        veicolo.descrizione_breve ??
        `Noleggio ${veicolo.marca} ${veicolo.modello} a Trieste presso LILO S.r.l.`,
    ),
    url: canonical,
    image:
      images.length > 0
        ? images.map((url) => ({ "@type": "ImageObject", url, caption: imageAlt }))
        : undefined,
    category: categoriaNome,
    keywords: keywordParts.filter(Boolean).join(", "),
    brand: {
      "@type": "Brand",
      name: veicolo.marca,
    },
    model: veicolo.modello,
    vehicleConfiguration: veicolo.versione ?? undefined,
    color: veicolo.colore ?? undefined,
    fuelType: veicolo.alimentazione ?? undefined,
    vehicleTransmission: veicolo.cambio ?? undefined,
    numberOfDoors: veicolo.porte ?? undefined,
    seatingCapacity: veicolo.posti ?? undefined,
    cargoVolume: cargo.volumeMc != null ? quantitativeMc(cargo.volumeMc) : undefined,
    vehicleInteriorLength:
      cargo.lunghezzaMm != null ? quantitativeMm(cargo.lunghezzaMm) : undefined,
    vehicleInteriorWidth:
      cargo.larghezzaMm != null ? quantitativeMm(cargo.larghezzaMm) : undefined,
    vehicleInteriorHeight:
      cargo.altezzaMm != null ? quantitativeMm(cargo.altezzaMm) : undefined,
    additionalProperty: additionalProperty.length > 0 ? additionalProperty : undefined,
    offers: prezzo
      ? {
          "@type": "Offer",
          "@id": `${canonical}#offerta`,
          name: `Tariffa giornaliera — ${name}`,
          price: prezzo.importo,
          priceCurrency: prezzo.valuta,
          availability: "https://schema.org/InStock",
          url: canonical,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: prezzo.importo,
            priceCurrency: prezzo.valuta,
            unitText: "DAY",
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: 1,
              unitCode: "DAY",
            },
          },
          additionalProperty: offerAdditional.length > 0 ? offerAdditional : undefined,
          seller: autoRentalProvider(),
          availableAtOrFrom: {
            "@type": "Place",
            name: "LILO Autonoleggio — Viale Campi Elisi 38/B",
            address: {
              "@type": "PostalAddress",
              streetAddress: COMPANY.streetAddress,
              addressLocality: COMPANY.city,
              postalCode: COMPANY.postalCode,
              addressRegion: COMPANY.region,
              addressCountry: COMPANY.country,
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: COMPANY.geo.latitude,
              longitude: COMPANY.geo.longitude,
            },
          },
          areaServed: {
            "@type": "City",
            name: "Trieste",
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: "Friuli-Venezia Giulia",
            },
          },
        }
      : undefined,
    provider: autoRentalProvider(),
    locationCreated: {
      "@type": "Place",
      name: "LILO S.r.l. — Trieste",
      address: {
        "@type": "PostalAddress",
        streetAddress: COMPANY.streetAddress,
        addressLocality: COMPANY.city,
        addressCountry: COMPANY.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: COMPANY.geo.latitude,
        longitude: COMPANY.geo.longitude,
      },
    },
    subjectOf: faqPage ? { "@id": `${canonical}#faq` } : undefined,
  };

  const graph: Record<string, unknown>[] = [generated, buildVeicoloBreadcrumbList(veicolo)];
  if (faqPage) graph.push(faqPage);

  if (veicolo.json_ld && Object.keys(veicolo.json_ld).length > 0) {
    graph.push({ ...veicolo.json_ld, url: canonical });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function buildVeicoloBreadcrumbList(veicolo: VeicoloPubblico): Record<string, unknown> {
  const name = getDisplayName(veicolo);
  const canonical = veicoloCanonicalUrl(veicolo.slug);
  const catSlug = veicolo.categoria?.slug;
  const catName = veicolo.categoria?.nome;

  const items: Array<Record<string, unknown>> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inizio",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Flotta",
      item: `${SITE_URL}/flotta`,
    },
  ];

  if (catSlug && catName) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: catName,
      item: `${SITE_URL}/flotta/${catSlug}`,
    });
    items.push({
      "@type": "ListItem",
      position: 4,
      name,
      item: canonical,
    });
  } else {
    items.push({
      "@type": "ListItem",
      position: 3,
      name,
      item: canonical,
    });
  }

  return {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: items,
  };
}

export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY.legalName,
    alternateName: COMPANY.name,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo-lilo.jpg`,
      caption: "LILO S.r.l. — Autonoleggio Trieste",
    },
    foundingDate: "2003",
    description:
      "Noleggio auto e furgoni, autolavaggio professionale e servizi di trasporto a Trieste dal 2003.",
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.streetAddress,
      addressLocality: COMPANY.city,
      postalCode: COMPANY.postalCode,
      addressRegion: COMPANY.region,
      addressCountry: COMPANY.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: COMPANY.geo.latitude,
      longitude: COMPANY.geo.longitude,
    },
    telephone: COMPANY.phoneE164,
    email: COMPANY.email,
    vatID: COMPANY.vatNumber,
    areaServed: [
      { "@type": "City", name: "Trieste" },
      { "@type": "AdministrativeArea", name: "Provincia di Trieste" },
    ],
  };
}

export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "LILO S.r.l. — Autonoleggio Trieste",
    url: SITE_URL,
    inLanguage: "it-IT",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/flotta/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildHomeJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationJsonLd(),
      buildWebSiteJsonLd(),
      { ...autoRentalProvider(), parentOrganization: { "@id": `${SITE_URL}/#organization` } },
      {
        "@type": "HowTo",
        "@id": `${SITE_URL}/#come-scegliere-furgone`,
        name: "Come scegliere il furgone giusto a Trieste",
        description:
          "Indica cosa trasporti e confronta volume, altezza vano e portata dei furgoni a Trieste.",
        url: `${SITE_URL}/cosa-trasporti`,
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Indica il carico",
            text: "Scegli cosa trasporti: scatole, frigo, armadio, moto, trasloco…",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Confronta i mezzi",
            text: "Il wizard propone 1–2 furgoni in base a m³, altezza vano e portata.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Apri la scheda o richiedi preventivo",
            text: "Vedi dettagli, extra (es. rampa carico moto) e richiedi il preventivo online.",
          },
        ],
      },
    ],
  };
}

/** Pagina /cosa-trasporti — HowTo + FAQ per AI e rich results. */
export function buildCosaTrasportiJsonLd(faqItems: AiFaqItem[]): Record<string, unknown> {
  const canonical = `${SITE_URL}/cosa-trasporti`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationJsonLd(),
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: "Cosa trasporti? Trova il furgone giusto a Trieste | LILO",
        description:
          "Wizard LILO: indica il carico (frigo, armadio, trasloco, moto) e trova i furgoni adatti in flotta a Trieste.",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#autonoleggio` },
      },
      {
        "@type": "HowTo",
        "@id": `${canonical}#howto`,
        name: "Come scegliere il furgone in base al carico",
        description:
          "Guida interattiva LILO basata su volume (m³), altezza vano e portata utile dei veicoli pubblicati.",
        url: canonical,
        totalTime: "PT2M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Seleziona cosa trasporti",
            text: "Frigorifero, armadio, divano, moto, trasloco monolocale/bilocale/trilocale o consegne piccole.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Leggi i veicoli consigliati",
            text: "Vengono mostrati fino a due furgoni con volume, altezza e portata coerenti con il carico.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Apri la scheda e richiedi preventivo",
            text: "Dalla scheda veicolo puoi aggiungere extra (rampa carico moto, carrello) e inviare la richiesta.",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inizio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Cosa trasporti?", item: canonical },
        ],
      },
      buildFaqJsonLd(faqItems),
    ],
  };
}

export function buildFaqJsonLd(items: AiFaqItem[]): Record<string, unknown> {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** FAQ + Offer per la pagina Offerta del Mese (Promo Weekend — solo furgoni-grandi-citta). */
export function buildOfferteJsonLd(faqItems: AiFaqItem[]): Record<string, unknown> {
  const canonical = `${SITE_URL}/offerte`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationJsonLd(),
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: "Noleggio Furgone Uso Città Weekend Trieste da 83€ | Promo LILO",
        description:
          "Promo Weekend riservata ai Furgoni grandi (uso città): dal sabato al lunedì a 83€ IVA inclusa. Paghi 1 giorno e mezzo, tieni il mezzo 48 ore!",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: {
          "@type": "Offer",
          name: "Promo Weekend — Furgoni grandi (uso città) Trieste",
          description:
            "Noleggio furgone grande uso città L2H2 da sabato 08:30 a lunedì 08:30: 83€ IVA inclusa, 75 km inclusi. Valida solo per la categoria Furgoni grandi (uso città).",
          price: "83.00",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: canonical,
          category: "Furgoni grandi (uso città)",
          seller: { "@id": `${SITE_URL}/#organization` },
          itemOffered: {
            "@type": "Product",
            name: "Noleggio Furgone grande uso città L2H2",
            category: "Furgoni grandi (uso città)",
            url: `${SITE_URL}/flotta/furgoni-grandi-citta`,
          },
        },
      },
      buildFaqJsonLd(faqItems),
    ],
  };
}

export function buildChiSiamoJsonLd(faqItems: AiFaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [buildOrganizationJsonLd(), buildFaqJsonLd(faqItems)],
  };
}

export function buildFlottaJsonLd(veicoli: VeicoloPubblico[]): Record<string, unknown> {
  const canonical = `${SITE_URL}/flotta`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      autoRentalProvider(),
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#flotta`,
        name: "Flotta Noleggio Furgoni e Auto a Trieste | Lilo Srl",
        description:
          "Catalogo noleggio LILO S.r.l. a Trieste: auto, pulmini 9 posti e furgoni per ogni esigenza.",
        url: canonical,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        provider: autoRentalProvider(),
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: FLOTTA_CATEGORIA_SLUGS.length,
          itemListElement: FLOTTA_CATEGORIA_SLUGS.map((slug, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: flottaCategoriaCanonical(slug),
            name: getFlottaCategoriaNavLabel(slug),
            description: FLOTTA_CATEGORIA_COPY[slug].hubDescription,
          })),
        },
      },
    ],
  };
}

export function buildFlottaCategoriaJsonLd(
  slug: TariffaCategoriaSlug,
  veicoli: VeicoloPubblico[],
): Record<string, unknown> {
  const canonical = flottaCategoriaCanonical(slug);
  const copy = FLOTTA_CATEGORIA_COPY[slug];

  return {
    "@context": "https://schema.org",
    "@graph": [
      autoRentalProvider(),
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#categoria`,
        name: copy.seoTitle,
        description: copy.seoDescription,
        url: canonical,
        isPartOf: { "@id": `${SITE_URL}/flotta#flotta` },
        provider: autoRentalProvider(),
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: veicoli.length,
          itemListElement: veicoli.map((veicolo, index) => {
            const name = getDisplayName(veicolo);
            const prezzo = getPrezzoGiornaliero(veicolo);
            return {
              "@type": "ListItem",
              position: index + 1,
              url: veicoloCanonicalUrl(veicolo.slug),
              item: {
                "@type": "Product",
                name,
                description: (() => {
                  const raw = veicolo.descrizione_breve ?? veicolo.ai_summary ?? undefined;
                  return raw ? stripTargaFromPublicCopy(raw) : undefined;
                })(),
                image: getCoverImage(veicolo) ?? undefined,
                offers: prezzo
                  ? {
                      "@type": "Offer",
                      price: prezzo.importo,
                      priceCurrency: prezzo.valuta,
                      availability: "https://schema.org/InStock",
                    }
                  : undefined,
              },
            };
          }),
        },
      },
    ],
  };
}

export function buildContattiJsonLd(impostazioni: ImpostazioniSito): Record<string, unknown> {
  const canonical = `${SITE_URL}/contatti`;
  const mapsUrl = googleMapsLink(impostazioni.indirizzo_noleggio, "LILO S.r.l.");
  const openingHoursSpecification = orariToOpeningHoursSpecification(
    impostazioni.orari_noleggio,
  );

  const sameAs = [
    impostazioni.social_facebook,
    impostazioni.social_instagram,
    impostazioni.social_linkedin,
    mapsUrl,
  ].filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["AutoRental", "LocalBusiness"],
        "@id": `${canonical}#sede-noleggio`,
        name: COMPANY.legalName,
        alternateName: COMPANY.name,
        description:
          "Noleggio auto, furgoni e pulmini 9 posti a Trieste. Ritiro in sede in Viale Campi Elisi.",
        url: canonical,
        telephone: telefonoE164(impostazioni.telefono_noleggio),
        email: impostazioni.email_contatto,
        image: `${SITE_URL}/logo-lilo.jpg`,
        logo: `${SITE_URL}/logo-lilo.jpg`,
        priceRange: "€€",
        currenciesAccepted: "EUR",
        paymentAccepted: "Cash, Credit Card, Debit Card",
        address: {
          "@type": "PostalAddress",
          streetAddress: COMPANY.streetAddress,
          addressLocality: COMPANY.city,
          postalCode: COMPANY.postalCode,
          addressRegion: COMPANY.region,
          addressCountry: COMPANY.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: COMPANY.geo.latitude,
          longitude: COMPANY.geo.longitude,
        },
        hasMap: mapsUrl,
        sameAs,
        openingHoursSpecification,
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
        areaServed: [
          { "@type": "City", name: "Trieste" },
          { "@type": "AdministrativeArea", name: "Provincia di Trieste" },
        ],
      },
      buildOrganizationJsonLd(),
    ],
  };
}
