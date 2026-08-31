import Link from "next/link";
import { VeicoloFaq } from "@/components/flotta/VeicoloFaq";
import type { GuideArticle } from "@/lib/guide/types";

interface GuideArticleContentProps {
  article: GuideArticle;
}

export function GuideArticleContent({ article }: GuideArticleContentProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-brand-600">
              Inizio
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/guide" className="hover:text-brand-600">
              Guide
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-slate-800" aria-current="page">
            {article.title}
          </li>
        </ol>
      </nav>

      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Guida LILO</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Aggiornato il{" "}
          {new Date(article.updatedAt).toLocaleDateString("it-IT", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      <section
        className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/60 p-5 sm:p-6"
        aria-labelledby="in-breve-heading"
      >
        <h2 id="in-breve-heading" className="text-sm font-bold uppercase tracking-wide text-brand-800">
          In breve
        </h2>
        <p className="mt-2 text-base leading-relaxed text-slate-800">{article.inBreve}</p>
      </section>

      <div className="mt-10 space-y-10">
        {article.sections.map((section) => (
          <section key={section.h2}>
            <h2 className="text-xl font-bold text-slate-900">{section.h2}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 48)} className="mt-3 text-base leading-relaxed text-slate-700">
                {p}
              </p>
            ))}
            {section.bullets && section.bullets.length > 0 && (
              <ul className="mt-4 list-disc space-y-1.5 pl-5 text-slate-700">
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {article.faq && article.faq.length > 0 && (
        <div className="mt-12">
          <VeicoloFaq items={article.faq} />
        </div>
      )}

      <aside className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Approfondisci</h2>
        <ul className="mt-3 space-y-2">
          {article.relatedLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm font-medium text-brand-700 hover:underline">
                {link.label} →
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={article.ctaPrimary.href}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {article.ctaPrimary.label}
          </Link>
          {article.ctaSecondary && (
            <Link
              href={article.ctaSecondary.href}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {article.ctaSecondary.label}
            </Link>
          )}
        </div>
      </aside>
    </article>
  );
}
