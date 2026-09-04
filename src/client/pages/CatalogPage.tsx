import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ProductSummaryDto } from '../../shared/types';
import { ErrorState } from '../components/ErrorState';
import { ProductCardSkeleton } from '../components/LoadingStates';
import { ProductCard } from '../components/ProductCard';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { requestApi } from '../lib/api';

const FEATURES = [
  { value: '0%', label: 'No Cost EMI plans' },
  { value: '3–36', label: 'Month tenures' },
  { value: '100%', label: 'Transparent pricing' },
];

export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') ?? (searchParams.get('q') ? '' : 'Mobiles');
  const searchQuery = searchParams.get('q') ?? '';

  const [products, setProducts] = useState<ProductSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const headingTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : categoryParam === 'Deals'
    ? 'Hot Deals on EMI'
    : `${categoryParam || 'Flagship Products'} on EMI`;

  const showHero = categoryParam === 'Mobiles' && !searchQuery;

  useDocumentMetadata(
    `PayFlex | ${headingTitle}`,
    'Browse premium products across all categories with transparent EMI prices, zero-interest options and flexible monthly payments.',
  );

  const loadProducts = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (categoryParam) params.set('category', categoryParam);
      if (searchQuery) params.set('q', searchQuery);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      setProducts(await requestApi<ProductSummaryDto[]>(`/api/products${queryString}`, undefined, signal));
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === 'AbortError') return;
      setError(loadError instanceof Error ? loadError.message : 'Unable to load products.');
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [categoryParam, searchQuery]);

  useEffect(() => {
    const controller = new AbortController();
    void loadProducts(controller.signal);
    return () => controller.abort();
  }, [attempt, loadProducts]);

  return (
    <>
      {/* ── Hero Banner ──────────────────────────── */}
      {showHero && (
        <section className="relative overflow-hidden bg-slate-900 px-4 pb-14 pt-12 sm:px-8 sm:pb-16 sm:pt-14 lg:px-16">
        {/* Decorative orbs */}
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />

        <div className="relative z-10 mx-auto max-w-[1440px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-300 backdrop-blur">
            ✦ No Cost EMI · Zero down payment
          </span>

          <h1 className="mt-5 font-display text-[clamp(2.2rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-tight text-white">
            Shop the Smartest
            <span className="block text-brand-400">Tech on EMI</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-white/60 sm:text-lg">
            Explore premium devices and choose an EMI plan with clear monthly costs,
            transparent interest, and cashback you can actually see.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#products"
              id="shop-collection-btn"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              Shop Collection ↓
            </a>
            <a
              href="#how-it-works"
              className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 text-sm font-bold text-white transition hover:border-white/50 hover:bg-white/10 focus:outline-none"
            >
              How it works
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-10 flex max-w-lg flex-wrap gap-8 border-t border-white/10 pt-6">
            {FEATURES.map(({ value, label }) => (
              <div key={label}>
                <p className="font-display text-2xl font-extrabold text-brand-400 sm:text-3xl">{value}</p>
                <p className="mt-0.5 text-xs text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Product Grid ─────────────────────────── */}
      <section id="products" className="scroll-mt-24 px-4 py-10 sm:px-8 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                {searchQuery ? 'Search results' : 'Curated collection'}
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {headingTitle}
              </h2>
            </div>
            <p className="max-w-sm text-sm text-slate-500">
              {isLoading ? 'Checking real-time EMI offers...' : `${products.length} product${products.length === 1 ? '' : 's'} with real EMI math, transparent pricing, and flexible tenures.`}
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading && Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            {!isLoading && !error && products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {!isLoading && error && (
            <div className="mt-10">
              <ErrorState message={error} onRetry={() => setAttempt((v) => v + 1)} />
            </div>
          )}

          {!isLoading && !error && products.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <h3 className="font-display text-2xl font-extrabold text-slate-800">No products found</h3>
              <p className="mt-2 text-sm text-slate-500">
                {searchQuery
                  ? `No products matched "${searchQuery}". Try a different keyword or category.`
                  : 'Check back shortly for newly added products in this category.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-24 border-t border-slate-100 bg-slate-50 px-4 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">No surprises</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            From product to plan in 3 clear steps
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { step: '01', title: 'Choose your configuration', text: 'Select storage and color that fits — see live price, availability and EMI.' },
              { step: '02', title: 'Compare EMI plans', text: 'Review monthly payment, tenure, interest, fees and cashback side by side.' },
              { step: '03', title: 'Confirm with confidence', text: 'See one final transparent summary before confirming the demo checkout.' },
            ].map(({ step, title, text }) => (
              <article key={step} className="rounded-xl border border-slate-200 bg-white p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {step}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
