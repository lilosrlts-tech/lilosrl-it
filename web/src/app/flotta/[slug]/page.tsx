import type { Metadata } from "next";
import Link from "next/link";
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedSlugs();
    return [
      ...FLOTTA_CATEGORIA_SLUGS.map((slug) => ({ slug })),
      ...slugs.map((slug) => ({ slug })),
    ];
  } catch {
    return FLOTTA_CATEGORIA_SLUGS.map((slug) => ({ slug }));
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (isFlottaCategoriaSlug(slug)) {
    return buildFlottaCategoriaMetadata(slug);
  }

  const veicolo = await getVeicoloBySlug(slug);
  if (!veicolo) return { title: "Pagina non trovata" };
  return buildVeicoloMetadata(veicolo);
}

export default async function FlottaSlugPage({ params }: PageProps) {
  const { slug } = await params;

  if (isFlottaCategoriaSlug(slug)) {
    return <FlottaCategoriaPage slug={slug} />;
  }

  const veicolo = await getVeicoloBySlug(slug);
  if (!veicolo) notFound();

  return <VeicoloDettaglioContent veicolo={veicolo} />;
}
