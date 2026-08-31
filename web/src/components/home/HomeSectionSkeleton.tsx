export function FleetPreviewSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16" aria-hidden="true">
      <div className="mb-8 h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="aspect-[16/10] animate-pulse bg-slate-100" />
            <div className="space-y-2 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomeBelowFoldSkeleton() {
  return <div className="min-h-[480px] bg-slate-50/50" aria-hidden="true" />;
}
