function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`pf-skeleton ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-16 rounded" />
        <Skeleton className="h-5 w-4/5 rounded-lg" />
        <Skeleton className="h-4 w-1/3 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="bg-slate-50">
      {/* Breadcrumb skeleton */}
      <div className="hidden border-b border-slate-100 bg-white px-4 py-3 lg:block lg:px-10">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-3 w-36 rounded" />
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pb-28 pt-6 sm:px-8 lg:px-10">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,1fr)] lg:gap-10">
          {/* Image skeleton */}
          <div className="flex gap-3">
            <div className="hidden flex-col gap-2 lg:flex">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[72px] w-[72px] rounded-lg" />
              ))}
            </div>
            <Skeleton className="aspect-square flex-1 rounded-2xl" />
          </div>

          {/* Details skeleton */}
          <div className="space-y-4 py-2">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-3 w-1/3 rounded" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <div className="grid grid-cols-2 gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
