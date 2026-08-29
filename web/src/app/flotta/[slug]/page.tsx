import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlottaCategoriaPage } from "@/components/flotta/FlottaCategoriaPage";
import { VeicoloDettaglioContent } from "@/components/flotta/VeicoloDettaglioContent";
import {
  FLOTTA_CATEGORIA_SLUGS,
  buildFlottaCategoriaMetadata,
  isFlottaCategoriaSlug,
} from "@/lib/flotta-categoria-config";
import { buildVeicoloMetadata } from "@/lib/seo";
import { getPublishedSlugs, getVeicoloBySlug } from "@/lib/veicoli";
import { VEICOLO_SLUG_REDIRECTS_301 } from "@/lib/veicolo-slug-renames";

export const revalidate = 3600;

/** Slug che esistono solo come sorgente 301 (next.config / middleware). */
const SLUG_REDIRECT_TO = new Map(VEICOLO_SLUG_REDIRECTS_301.map((r) => [r.from, r.to]));

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedSlugs();
    return [
      ...FLOTTA_CATEGORIA_SLUGS.map((slug) => ({ slug })),
      ...slugs
        .filter((slug) => !SLUG_REDIRECT_TO.has(slug))
        .map((slug) => ({ slug })),
    ];
  } catch {
    return FLOTTA_CATEGORIA_SLUGS.map((slug) => ({ slug }));
  }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  // Query string (utm, filtri temporanei) non entra mai nel canonical.
  void searchParams;
  const { slug } = await params;

  // Difesa: se un redirect 301 non intercetta ancora, non indicizzare lo slug alias.
  const redirectTo = SLUG_REDIRECT_TO.get(slug);
  if (redirectTo) {
    return {
      title: "Reindirizzamento",
      robots: { index: false, follow: true },
      alternates: { canonical: `https://www.lilosrl.it/flotta/${redirectTo}` },
    };
  }

  if (isFlottaCategoriaSlug(slug)) {
    return buildFlottaCategoriaMetadata(slug);
  }

  const veicolo = await getVeicoloBySlug(slug);
  if (!veicolo) {
    return {
      title: "Pagina non trovata",
      robots: { index: false, follow: false },
    };
  }
  return buildVeicoloMetadata(veicolo);
}

export default async function FlottaSlugPage({ params }: PageProps) {
  const { slug } = await params;

  // I 301 veri sono in next.config/middleware (statusCode 301). Qui solo notFound
  // se lo slug alias fosse ancora raggiunto senza redirect (non deve succedere).
  if (SLUG_REDIRECT_TO.has(slug)) {
    notFound();
  }

  if (isFlottaCategoriaSlug(slug)) {
    return <FlottaCategoriaPage slug={slug} />;
  }

  const veicolo = await getVeicoloBySlug(slug);
  if (!veicolo) notFound();

  return <VeicoloDettaglioContent veicolo={veicolo} />;
}
