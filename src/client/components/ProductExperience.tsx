import { useMemo, useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  LoaderCircle,
  RotateCcw,
  Star,
  Truck,
  ShieldCheck,
  CheckCircle2,
  BadgeCheck,
} from 'lucide-react';
import type {
  CheckoutIntentDto,
  EmiPlanDto,
  ProductDetailDto,
} from '../../shared/types';
import { requestApi } from '../lib/api';
import { formatCurrency } from '../lib/format';
import { CheckoutModal } from './CheckoutModal';
import { EmiSelector } from './EmiSelector';
import { ProductImage } from './ProductImage';

interface ProductExperienceProps {
  product: ProductDetailDto;
}

function preferredPlan(plans: EmiPlanDto[], tenure = 12): string | null {
  return plans.find((p) => p.tenureMonths === tenure)?.id ?? plans[0]?.id ?? null;
}

function StarBar({ percent, color = '#22c55e' }: { percent: number; color?: string }) {
  return (
    <div className="flex-1 overflow-hidden rounded-full bg-slate-100" style={{ height: 6 }}>
      <div className="h-full rounded-full" style={{ width: `${percent}%`, background: color }} />
    </div>
  );
}

export function ProductExperience({ product }: ProductExperienceProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? '');
  const [plans, setPlans] = useState(product.emiPlans);
  const [selectedPlanId, setSelectedPlanId] = useState(preferredPlan(product.emiPlans));
  const [plansLoading, setPlansLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [intent, setIntent] = useState<CheckoutIntentDto | null>(null);
  const [activeThumb, setActiveThumb] = useState(0);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [expandedPolicy, setExpandedPolicy] = useState<number | null>(null);

  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.id === selectedVariantId),
    [product.variants, selectedVariantId],
  );
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  if (!selectedVariant) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <h1 className="font-display text-2xl font-extrabold text-slate-800">This product is being restocked</h1>
        <p className="mt-3 text-slate-500">No purchasable variants are available right now.</p>
      </div>
    );
  }

  const savings = Math.max(0, product.mrp - selectedVariant.price);
  const savingsPct = product.mrp > 0 ? Math.round((savings / product.mrp) * 100) : 0;

  // Group variants by color (for swatch selector)
  const colorVariants = product.variants;
  // Group variants by storage
  const storageVariants = product.variants;

  async function selectVariant(variantId: string) {
    if (variantId === selectedVariantId) return;
    const previousTenure = selectedPlan?.tenureMonths ?? 12;
    setSelectedVariantId(variantId);
    setPlansLoading(true);
    setErrorMessage(null);
    try {
      const nextPlans = await requestApi<EmiPlanDto[]>(
        `/api/products/${product.slug}/emi-plans?variantId=${encodeURIComponent(variantId)}`,
      );
      setPlans(nextPlans);
      setSelectedPlanId(preferredPlan(nextPlans, previousTenure));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unable to update EMI plans.');
    } finally {
      setPlansLoading(false);
    }
  }

  async function proceedToCheckout() {
    if (!selectedPlanId) { setErrorMessage('Select an EMI plan to continue.'); return; }
    const variantId = selectedVariant?.id;
    if (!variantId) { setErrorMessage('Select an available product variant.'); return; }
    setCheckoutLoading(true);
    setErrorMessage(null);
    try {
      const checkoutIntent = await requestApi<CheckoutIntentDto>('/api/checkout/intent', {
        method: 'POST',
        body: JSON.stringify({ productSlug: product.slug, variantId, emiPlanId: selectedPlanId }),
      });
      setIntent(checkoutIntent);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unable to continue right now.');
    } finally {
      setCheckoutLoading(false);
    }
  }

  const specs = product.specifications ?? [];
  const visibleSpecs = showAllSpecs ? specs : specs.slice(0, 6);

  return (
    <>
      {/* ── Two-column grid ─────────────────────── */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,1fr)] lg:gap-10">

        {/* ── LEFT: Gallery ──────────────────────── */}
        <section aria-label="Product gallery" className="lg:sticky lg:top-[130px]">
          <div className="flex gap-3">
            {/* Vertical thumbnails (desktop) */}
            <div className="hidden flex-col gap-2 lg:flex">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => { void selectVariant(v.id); setActiveThumb(i); }}
                  aria-pressed={v.id === selectedVariantId}
                  className={`pf-thumb ${v.id === selectedVariantId ? 'pf-thumb-active' : ''}`}
                >
                  <ProductImage src={v.imageUrl} alt={v.color} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>

            {/* Main product image */}
            <div className="relative flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {/* Badge & stock */}
              <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
                {product.badge && (
                  <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {product.badge}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white">
                  <CheckCircle2 size={10} /> In Stock
                </span>
              </div>

              {/* Rating pill */}
              {product.rating?.aggregateRating > 0 && (
                <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 shadow-card-hover">
                  <span className="text-xs font-bold text-slate-800">{product.rating.aggregateRatingDisplay}</span>
                  <Star size={11} fill="#f59e0b" stroke="#f59e0b" />
                </div>
              )}

              <ProductImage
                src={selectedVariant.imageUrl}
                alt={`${product.name} in ${selectedVariant.color}`}
                className="aspect-square w-full animate-fade-up object-contain p-8 sm:p-14"
              />
            </div>
          </div>

          {/* Mobile thumbs */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => void selectVariant(v.id)}
                aria-pressed={v.id === selectedVariantId}
                className={`pf-thumb ${v.id === selectedVariantId ? 'pf-thumb-active' : ''}`}
              >
                <ProductImage src={v.imageUrl} alt={v.color} className="h-full w-full object-contain" />
              </button>
            ))}
          </div>

          {/* Trust badges strip */}
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-100 bg-white p-3 text-center text-[11px] font-semibold text-slate-500">
            <span className="flex flex-col items-center gap-1">
              <Truck size={16} className="text-brand-600" /> Free Delivery
            </span>
            <span className="flex flex-col items-center gap-1 border-x border-slate-100">
              <RotateCcw size={16} className="text-brand-600" /> 2-Day Return
            </span>
            <span className="flex flex-col items-center gap-1">
              <ShieldCheck size={16} className="text-brand-600" /> Brand Warranty
            </span>
          </div>
        </section>

        {/* ── RIGHT: Product Details ──────────────── */}
        <section>
          {/* Brand & name */}
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">{product.brand}</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">({selectedVariant.storage}, {selectedVariant.color})</p>

          {/* Rating row */}
          {product.rating?.aggregateRating > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                {product.rating.aggregateRatingDisplay} <Star size={10} fill="white" />
              </span>
              <span className="text-xs text-slate-500">
                {product.rating.totalRatings} ratings · {product.rating.noOfUnitsSoldDisplay}
              </span>
              <span className="text-xs font-semibold text-emerald-700">{product.rating.aggregateRatingTag}</span>
            </div>
          )}

          {/* Pricing box */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-end gap-3">
              <p className="font-display text-3xl font-extrabold text-slate-900">
                {formatCurrency(selectedVariant.price)}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400 line-through">{formatCurrency(product.mrp)}</span>
                {savingsPct > 0 && (
                  <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">
                    {savingsPct}% off
                  </span>
                )}
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-400">Inclusive of all taxes</p>
            {product.sellerName && (
              <p className="mt-2 border-t border-slate-100 pt-2 text-xs text-slate-500">
                Sold by: <span className="font-semibold text-slate-700">{product.sellerName}</span>
              </p>
            )}
          </div>

          {/* Color selector */}
          <div className="mt-6">
            <p className="mb-2.5 text-sm font-semibold text-slate-700">
              Color: <span className="text-slate-900">{selectedVariant.color}</span>
            </p>
            <div className="flex gap-2">
              {colorVariants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  title={v.color}
                  aria-label={`Select ${v.color}`}
                  aria-pressed={v.id === selectedVariantId}
                  onClick={() => void selectVariant(v.id)}
                  className={`pf-swatch ${v.id === selectedVariantId ? 'pf-swatch-active' : ''}`}
                  style={{ backgroundColor: v.colorHex }}
                />
              ))}
            </div>
          </div>

          {/* Storage selector */}
          <div className="mt-5">
            <p className="mb-2.5 text-sm font-semibold text-slate-700">
              Storage: <span className="text-slate-900">{selectedVariant.storage}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {storageVariants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => void selectVariant(v.id)}
                  aria-pressed={v.id === selectedVariantId}
                  className={`pf-storage-chip ${v.id === selectedVariantId ? 'pf-storage-chip-active' : ''}`}
                >
                  {v.storage}
                  {v.priceAdjustment > 0 && (
                    <span className="ml-1 text-brand-600">+{formatCurrency(v.priceAdjustment)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* EMI Section */}
          <div id="emi-plans" className="mt-7 scroll-mt-32">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-900">Choose EMI Plan</h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                🔒 No hidden charges
              </span>
            </div>
            <EmiSelector
              plans={plans}
              selectedPlanId={selectedPlanId}
              isLoading={plansLoading}
              onSelect={(planId) => { setSelectedPlanId(planId); setErrorMessage(null); }}
            />
          </div>

          {/* Cashback pill */}
          {selectedPlan?.cashbackAmount ? (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm">
              <span className="text-xl">🎁</span>
              <p>
                <span className="font-bold text-amber-800">Extra {formatCurrency(selectedPlan.cashbackAmount)} cashback</span>
                <span className="block text-xs text-amber-700">Applied after successful confirmation</span>
              </p>
            </div>
          ) : null}

          {errorMessage && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {errorMessage}
            </p>
          )}

          {/* CTA (desktop) */}
          <button
            id="proceed-to-checkout-btn"
            type="button"
            onClick={() => void proceedToCheckout()}
            disabled={checkoutLoading || plansLoading || !selectedPlanId}
            className="pf-btn-primary mt-5 hidden lg:flex"
          >
            {checkoutLoading ? (
              <><LoaderCircle className="animate-spin" size={18} /> Preparing…</>
            ) : (
              <>
                {selectedPlan
                  ? `Continue with ${selectedPlan.tenureMonths}-month plan`
                  : 'Select a plan to continue'}
                <ChevronRight size={18} strokeWidth={2.5} />
              </>
            )}
          </button>

          <p className="mt-3 hidden items-center justify-center gap-2 text-xs text-slate-400 lg:flex">
            <ShieldCheck size={13} /> Transparent pricing · Demo checkout only
          </p>

          {/* Trust Policies */}
          {((product.policies ?? []).length > 0) && (
            <div className="mt-7">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                <ShieldCheck size={16} className="text-emerald-600" /> Shop with Confidence
              </h3>
              <div className="space-y-2">
                {product.policies.map((policy, i) => (
                  <div key={i} className="rounded-xl border border-slate-100 bg-white">
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 p-3 text-left"
                      onClick={() => setExpandedPolicy(expandedPolicy === i ? null : i)}
                      aria-expanded={expandedPolicy === i}
                    >
                      <span className="text-xl" aria-hidden="true">{policy.icon}</span>
                      <span className="flex-1 text-sm font-semibold text-slate-700">{policy.label}</span>
                      <ChevronDown
                        size={15}
                        className={`text-slate-400 transition-transform ${expandedPolicy === i ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedPolicy === i && (
                      <p className="border-t border-slate-100 px-3 pb-3 pt-2 text-xs leading-5 text-slate-500">
                        {policy.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ── Specifications ──────────────────────── */}
      {product.specifications.length > 0 && (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold text-slate-900">Product Details</h2>
          <div className="mt-4 divide-y divide-slate-100">
            {visibleSpecs.map((spec, i) => (
              <div key={i} className="flex gap-4 py-2.5">
                <dt className="w-36 shrink-0 text-sm font-medium text-slate-500">{spec.label}</dt>
                <dd className="text-sm text-slate-700">{spec.value}</dd>
              </div>
            ))}
          </div>
          {product.specifications.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAllSpecs((prev) => !prev)}
              className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              {showAllSpecs ? 'View less' : `View all ${product.specifications.length} specifications`}
              <ChevronDown size={16} className={`transition-transform ${showAllSpecs ? 'rotate-180' : ''}`} />
            </button>
          )}
        </section>
      )}

      {/* ── Ratings & Reviews ───────────────────── */}
      {product.rating?.totalRatings > 0 && (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold text-slate-900">Review &amp; Rating</h2>

          <div className="mt-5 flex flex-wrap gap-8">
            {/* Aggregate */}
            <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 px-8 py-6 text-center">
              <p className="font-display text-5xl font-extrabold text-slate-900">{product.rating.aggregateRatingDisplay}</p>
              <div className="mt-1 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.round(product.rating.aggregateRating) ? '#f59e0b' : 'none'}
                    stroke="#f59e0b"
                  />
                ))}
              </div>
              <p className="mt-1 text-xs font-semibold text-emerald-700">{product.rating.aggregateRatingTag}</p>
              <p className="mt-0.5 text-xs text-slate-500">{product.rating.totalRatings} ratings</p>
            </div>

            {/* Star breakdown */}
            <div className="flex flex-1 flex-col gap-2 py-2">
              {[
                { stars: 5, pct: product.rating.fiveStarPercent },
                { stars: 4, pct: product.rating.fourStarPercent },
                { stars: 3, pct: product.rating.threeStarPercent },
                { stars: 2, pct: product.rating.twoStarPercent },
                { stars: 1, pct: product.rating.oneStarPercent },
              ].map(({ stars, pct }) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="w-4 text-right text-xs font-medium text-slate-600">{stars}</span>
                  <Star size={10} fill="#f59e0b" stroke="#f59e0b" />
                  <StarBar percent={pct} />
                  <span className="w-8 text-xs text-slate-400">{pct.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards */}
          {product.reviews.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-700">Top Reviews</h3>
              {product.reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < review.rating ? '#f59e0b' : 'none'}
                        stroke="#f59e0b"
                      />
                    ))}
                    {review.verified && (
                      <span className="ml-1 inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700">
                        <BadgeCheck size={11} /> Verified
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <p className="mt-1.5 text-sm font-semibold text-slate-800">{review.title}</p>
                  )}
                  <p className="mt-1 text-sm text-slate-600">{review.body}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-medium text-slate-600">{review.reviewer}</span>
                    {review.city && <span>· {review.city}</span>}
                    <span>· {review.daysAgo} days ago</span>
                  </div>
                  {review.variantLabel && (
                    <p className="mt-1 text-[10px] text-slate-400">Review for: {review.variantLabel}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Mobile sticky bottom CTA ─────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-sticky-bar backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-slate-500">
              {selectedPlan?.tenureMonths ?? '—'} month plan
            </p>
            <p className="truncate text-sm font-bold text-slate-900">
              {selectedPlan ? `${formatCurrency(selectedPlan.monthlyPayment)}/mo` : 'Choose an EMI plan'}
            </p>
          </div>
          <button
            type="button"
            id="mobile-checkout-btn"
            onClick={() => void proceedToCheckout()}
            disabled={checkoutLoading || plansLoading || !selectedPlanId}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none disabled:opacity-60"
          >
            {checkoutLoading ? <LoaderCircle className="animate-spin" size={17} /> : <>Continue <ChevronRight size={17} /></>}
          </button>
        </div>
      </div>

      {intent && <CheckoutModal intent={intent} onClose={() => setIntent(null)} />}
    </>
  );
}
