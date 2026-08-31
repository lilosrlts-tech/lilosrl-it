import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticleContent } from "@/components/guide/GuideArticleContent";
import { SitePageWrapper, loadImpostazioni } from "@/lib/site-page";
import { getGuideBySlug, getGuideSlugs } from "@/lib/guide";
import { resolveMetadataTitle } from "@/lib/metadata-title";
import { canonicalUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { pruneJsonLd } from "@/lib/json-ld";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideBySlug(slug);
  if (!article) return { title: "Guida non trovata" };

  const canonical = canonicalUrl(`/guide/${article.slug}`);
  return {
    title: resolveMetadataTitle(article.metaTitle),
    description: article.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: canonical,
      type: "article",
      locale: "it_IT",
      siteName: "LILO S.r.l. — Autonoleggio Trieste",
      images: [{ url: `${SITE_URL}/logo-lilo.webp` }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
    },
  };
}

function buildArticleJsonLd(article: NonNullable<ReturnType<typeof getGuideBySlug>>) {
  const url = canonicalUrl(`/guide/${article.slug}`);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: article.title,
      description: article.metaDescription,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      inLanguage: "it-IT",
      author: { "@type": "Organization", name: "LILO S.r.l.", url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: "LILO S.r.l.",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-lilo.webp` },
      },
      mainEntityOfPage: url,
      url,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inizio", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Guide",
          item: canonicalUrl("/guide"),
        },
        { "@type": "ListItem", position: 3, name: article.title, item: url },
      ],
    },
  ];

  if (article.faq && article.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: article.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return pruneJsonLd({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getGuideBySlug(slug);
  if (!article) notFound();

  const impostazioni = await loadImpostazioni();
  const jsonLd = buildArticleJsonLd(article);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SitePageWrapper impostazioni={impostazioni}>
        <main>
          <GuideArticleContent article={article} />
        </main>
      </SitePageWrapper>
    </>
  );
}
