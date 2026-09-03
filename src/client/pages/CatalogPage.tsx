import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, BadgeCheck, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';
import type { ProductSummaryDto } from '../../shared/types';
import { ErrorState } from '../components/ErrorState';
import { ProductCardSkeleton } from '../components/LoadingStates';
import { ProductCard } from '../components/ProductCard';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { requestApi } from '../lib/api';

export function CatalogPage() {
  const [products, setProducts] = useState<ProductSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useDocumentMetadata(
    'PayFlex | Premium tech on flexible EMI plans',
    'Browse premium technology with transparent prices, zero-interest EMI options and flexible monthly payments.',
  );

  const loadProducts = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      setProducts(await requestApi<ProductSummaryDto[]>('/api/products', undefined, signal));
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === 'AbortError') return;
      setError(loadError instanceof Error ? loadError.message : 'Unable to load products.');
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadProducts(controller.signal);
    return () => controller.abort();
  }, [attempt, loadProducts]);

  return (
    <>
      <section className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-white shadow-soft sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-moss-200 backdrop-blur">
              <Sparkles size={14} /> Premium tech, simpler payments
            </span>
            <h1 className="mt-7 font-display text-[clamp(2.8rem,7vw,6.6rem)] font-extrabold leading-[0.92] tracking-[-0.075em]">
              The smarter way
              <span className="block text-moss-300">to make it yours.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              Explore standout devices and choose an EMI plan with clear monthly costs,
              transparent interest, and cashback you can actually see.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#products"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-extrabold text-ink transition hover:-translate-y-0.5 hover:bg-moss-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Shop the collection <ArrowDown size={17} />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center rounded-full border border-white/20 px-6 text-sm font-extrabold text-white transition hover:border-white/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="relative z-10 mt-14 grid max-w-3xl grid-cols-3 gap-2 border-t border-white/10 pt-6 text-xs sm:gap-6 sm:text-sm">
            <div>
              <p className="font-display text-2xl font-extrabold text-moss-300 sm:text-3xl">0%</p>
              <p className="mt-1 text-white/50">plans available</p>
            </div>
            <div className="border-x border-white/10 px-3 sm:px-6">
              <p className="font-display text-2xl font-extrabold text-moss-300 sm:text-3xl">3–60</p>
              <p className="mt-1 text-white/50">month choices</p>
            </div>
            <div className="pl-1 sm:pl-6">
              <p className="font-display text-2xl font-extrabold text-moss-300 sm:text-3xl">100%</p>
              <p className="mt-1 text-white/50">clear pricing</p>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-moss-600">Curated collection</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.05em] sm:text-5xl">
                Flagships, made flexible.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-ink/55">
              Pick a configuration, compare real EMI math, and continue through a safe demo flow.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {isLoading &&
              Array.from({ length: 3 }).map((_, index) => <ProductCardSkeleton key={index} />)}
            {!isLoading &&
              !error &&
              products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
          </div>

          {!isLoading && error && (
            <div className="mt-10">
              <ErrorState message={error} onRetry={() => setAttempt((value) => value + 1)} />
            </div>
          )}

          {!isLoading && !error && products.length === 0 && (
            <div className="mt-10 rounded-4xl border border-dashed border-black/15 bg-white p-12 text-center">
              <h3 className="font-display text-2xl font-extrabold">The collection is being refreshed</h3>
              <p className="mt-2 text-sm text-ink/55">Check back shortly for available products.</p>
            </div>
          )}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 border-y border-black/[0.06] bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-moss-600">No surprises</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.05em] sm:text-4xl">
              From product to plan in three clear steps.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: BadgeCheck,
                step: '01',
                title: 'Choose your configuration',
                text: 'Select the storage and finish that fits, with live availability and exact pricing.',
              },
              {
                icon: CreditCard,
                step: '02',
                title: 'Compare EMI plans',
                text: 'Review monthly payments, tenure, interest, fees and cashback side by side.',
              },
              {
                icon: ShieldCheck,
                step: '03',
                title: 'Confirm with confidence',
                text: 'See one final transparent summary before confirming the safe demo checkout.',
              },
            ].map(({ icon: Icon, step, title, text }) => (
              <article key={step} className="rounded-3xl bg-canvas p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white">
                    <Icon size={20} />
                  </span>
                  <span className="font-display text-xl font-extrabold text-ink/15">{step}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-extrabold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/55">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
