export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white p-4 shadow-card">
      <div className="skeleton aspect-[4/3] rounded-3xl" />
      <div className="space-y-3 px-2 pb-3 pt-5">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-7 w-4/5 rounded-lg" />
        <div className="skeleton h-5 w-2/5 rounded-lg" />
        <div className="skeleton mt-5 h-11 rounded-full" />
      </div>
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="skeleton mb-8 h-4 w-56 rounded" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,.98fr)] lg:gap-14">
        <div className="skeleton aspect-square rounded-4xl" />
        <div className="space-y-5 py-2">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-12 w-4/5 rounded-xl" />
          <div className="skeleton h-20 rounded-2xl" />
          <div className="skeleton h-28 rounded-3xl" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton h-28 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
