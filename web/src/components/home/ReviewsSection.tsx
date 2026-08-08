import { REVIEWS, GOOGLE_NOLEGGIO_REVIEWS_URL } from "@/lib/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-amber-700" aria-label={`${rating} stelle su 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true">
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section id="recensioni" className="bg-slate-100 py-16 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Recensioni su Google</h2>
          <p className="mt-2 text-slate-600">
            Recensioni reali della nostra scheda Google Business — sede noleggio Viale Campi Elisi
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {REVIEWS.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <Stars rating={review.rating} />
                <span className="text-xs font-medium text-slate-600">{review.source}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">&ldquo;{review.text}&rdquo;</p>
              <p className="mt-3 text-sm font-medium text-slate-900">
                {review.author}
                <span className="font-normal text-slate-600"> · {review.dateLabel}</span>
              </p>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          <a
            href={GOOGLE_NOLEGGIO_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:underline"
          >
            Leggi tutte le recensioni su Google →
          </a>
        </p>
      </div>
    </section>
  );
}
