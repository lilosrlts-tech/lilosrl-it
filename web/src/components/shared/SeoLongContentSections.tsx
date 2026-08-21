import { VeicoloFaq } from "@/components/flotta/VeicoloFaq";
import type { SeoLongContent } from "@/lib/seo-page-content";

interface SeoLongContentSectionsProps {
  content: SeoLongContent;
  /** id prefix for aria / heading anchors */
  idPrefix?: string;
}

/** Sezioni H2 + paragrafi + FAQ per pagine thin-content. */
export function SeoLongContentSections({
  content,
  idPrefix = "seo",
}: SeoLongContentSectionsProps) {
  return (
    <div className="mt-12 space-y-10">
      {content.sections.map((section, index) => (
        <section
          key={section.h2}
          aria-labelledby={`${idPrefix}-h2-${index}`}
          className="max-w-3xl"
        >
          <h2
            id={`${idPrefix}-h2-${index}`}
            className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
          >
            {section.h2}
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-600">
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </section>
      ))}
      <VeicoloFaq items={content.faq} />
    </div>
  );
}
