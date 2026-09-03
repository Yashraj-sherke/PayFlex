import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  ChevronRight,
  CircleCheck,
  Gift,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Truck,
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
  return plans.find((plan) => plan.tenureMonths === tenure)?.id ?? plans[0]?.id ?? null;
}

export function ProductExperience({ product }: ProductExperienceProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? '');
  const [plans, setPlans] = useState(product.emiPlans);
  const [selectedPlanId, setSelectedPlanId] = useState(preferredPlan(product.emiPlans));
  const [plansLoading, setPlansLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [intent, setIntent] = useState<CheckoutIntentDto | null>(null);

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === selectedVariantId),
    [product.variants, selectedVariantId],
  );
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);

  if (!selectedVariant) {
    return (
      <div className="rounded-4xl border border-dashed border-black/15 bg-white p-10 text-center shadow-card">
        <h1 className="font-display text-3xl font-extrabold">This product is being restocked</h1>
        <p className="mt-3 text-ink/55">No purchasable variants are available right now.</p>
      </div>
    );
  }

  const savings = Math.max(0, product.mrp - selectedVariant.price);
  const savingsPercent = product.mrp > 0 ? Math.round((savings / product.mrp) * 100) : 0;

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
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to update EMI plans.');
    } finally {
      setPlansLoading(false);
    }
  }

  async function proceedToCheckout() {
    if (!selectedPlanId) {
      setErrorMessage('Select an EMI plan to continue.');
      return;
    }

    setCheckoutLoading(true);
    setErrorMessage(null);
    const variantId = selectedVariant?.id;
    if (!variantId) {
      setCheckoutLoading(false);
      setErrorMessage('Select an available product variant to continue.');
      return;
    }
    try {
      const checkoutIntent = await requestApi<CheckoutIntentDto>('/api/checkout/intent', {
        method: 'POST',
        body: JSON.stringify({
          productSlug: product.slug,
          variantId,
          emiPlanId: selectedPlanId,
        }),
      });
      setIntent(checkoutIntent);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to continue right now.');
    } finally {
      setCheckoutLoading(false);
    }
  }

  const ctaLabel = selectedPlan
    ? `Continue with ${selectedPlan.tenureMonths}-month plan`
    : 'Select a plan to continue';

  return (
    <>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,.98fr)] lg:gap-14">
        <section className="lg:sticky lg:top-28" aria-label="Product gallery">
          <div className="relative overflow-hidden rounded-4xl border border-black/[0.05] bg-[#e9eee9] shadow-soft">
            <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/85 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-ink backdrop-blur">
                {product.badge ?? 'FEATURED'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-moss-700 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white">
                <CircleCheck size={12} /> In stock
              </span>
            </div>
            <ProductImage
              src={selectedVariant.imageUrl}
              alt={`${product.name} in ${selectedVariant.color}`}
              className="aspect-square w-full animate-fade-up object-contain p-10 sm:p-16"
            />
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2" aria-label="Product thumbnails">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => void selectVariant(variant.id)}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2 ${
                  variant.id === selectedVariant.id
                    ? 'border-moss-600 ring-1 ring-moss-600'
                    : 'border-black/[0.08] hover:border-moss-300'
                }`}
                aria-label={`View ${variant.color}, ${variant.storage}`}
                aria-pressed={variant.id === selectedVariant.id}
              >
                <ProductImage src={variant.imageUrl} alt="" className="h-full w-full object-contain p-2" />
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 rounded-3xl border border-black/[0.06] bg-white p-3 text-center text-[11px] font-bold text-ink/65 shadow-card sm:text-xs">
            <span className="flex min-h-12 flex-col items-center justify-center gap-1 sm:flex-row">
              <Truck size={16} className="text-moss-600" /> Free delivery
            </span>
            <span className="flex min-h-12 flex-col items-center justify-center gap-1 border-x border-black/[0.06] sm:flex-row">
              <RotateCcw size={16} className="text-moss-600" /> 7-day return
            </span>
            <span className="flex min-h-12 flex-col items-center justify-center gap-1 sm:flex-row">
              <ShieldCheck size={16} className="text-moss-600" /> Brand warranty
            </span>
          </div>
        </section>

        <section>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-moss-600">{product.brand}</p>
          <h1 className="mt-2 max-w-xl font-display text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 font-semibold text-ink/60">
            {selectedVariant.storage} <span className="px-1 text-ink/25">·</span>{' '}
            {selectedVariant.color} <span className="px-1 text-ink/25">·</span>{' '}
            {selectedVariant.finish}
          </p>
          <p className="mt-5 max-w-xl text-sm leading-6 text-ink/55">{product.description}</p>

          <div className="mt-7 rounded-3xl border border-black/[0.06] bg-white p-5 shadow-card sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/40">Your price</p>
                <p className="mt-1 font-display text-3xl font-extrabold tracking-[-0.04em]">
                  {formatCurrency(selectedVariant.price)}
                </p>
              </div>
              {savings > 0 && (
                <span className="rounded-full bg-moss-100 px-3 py-2 text-xs font-extrabold text-moss-700">
                  Save {formatCurrency(savings)} · {savingsPercent}% off
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-ink/45">
              MRP <span className="line-through">{formatCurrency(product.mrp)}</span> · Inclusive of taxes
            </p>
            <div className="mt-3 flex items-center gap-1.5 border-t border-black/[0.06] pt-3 text-xs font-bold text-moss-700">
              <ShieldCheck size={15} /> EMI plans backed by mutual funds
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/40">Choose yours</p>
                <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight">Finish & storage</h2>
              </div>
              <p className="text-xs font-semibold text-moss-700">{selectedVariant.inventory} available</p>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {product.variants.map((variant) => {
                const isSelected = variant.id === selectedVariant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => void selectVariant(variant.id)}
                    className={`relative min-h-[76px] rounded-2xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'border-moss-600 bg-moss-50'
                        : 'border-black/[0.09] bg-white hover:border-moss-300'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span className="flex items-center gap-2.5 font-bold">
                      <span
                        className="h-4 w-4 rounded-full border border-black/10 shadow-inner"
                        style={{ backgroundColor: variant.colorHex }}
                        aria-hidden="true"
                      />
                      {variant.color}
                    </span>
                    <span className="mt-1 block pl-[26px] text-xs font-medium text-ink/50">
                      {variant.storage}
                      {variant.priceAdjustment > 0
                        ? ` · +${formatCurrency(variant.priceAdjustment)}`
                        : ' · Included'}
                    </span>
                    {isSelected && (
                      <BadgeCheck className="absolute right-3 top-3 text-moss-600" size={18} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div id="emi-plans" className="mt-9 scroll-mt-28">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/40">Pay your way</p>
                <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight">Flexible EMI plans</h2>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[11px] font-extrabold text-moss-700 shadow-card">
                <LockKeyhole size={13} /> No hidden charges
              </span>
            </div>
            <p className="mb-4 mt-2 text-sm leading-6 text-ink/50">
              Monthly amounts are calculated from the selected configuration.
            </p>
            <EmiSelector
              plans={plans}
              selectedPlanId={selectedPlanId}
              isLoading={plansLoading}
              onSelect={(planId) => {
                setSelectedPlanId(planId);
                setErrorMessage(null);
              }}
            />
          </div>

          {selectedPlan?.cashbackAmount ? (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-moss-200 bg-moss-50 p-4 text-sm">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-moss-600 text-white">
                <Gift size={17} />
              </span>
              <p>
                <span className="font-extrabold">Extra {formatCurrency(selectedPlan.cashbackAmount)} cashback</span>
                <span className="block text-xs text-ink/50">applied after successful demo confirmation</span>
              </p>
            </div>
          ) : null}

          {errorMessage && (
            <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            onClick={() => void proceedToCheckout()}
            disabled={checkoutLoading || plansLoading || !selectedPlanId}
            className="mt-5 hidden min-h-14 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-base font-extrabold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-moss-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 lg:flex"
          >
            {checkoutLoading ? (
              <><LoaderCircle className="animate-spin" size={19} /> Preparing your plan…</>
            ) : (
              <>{ctaLabel} <ChevronRight size={19} strokeWidth={2.5} /></>
            )}
          </button>

          <div className="mt-4 hidden items-center justify-center gap-2 text-xs font-semibold text-ink/45 lg:flex">
            <ShieldCheck size={14} /> Transparent pricing · Demo checkout only
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/[0.08] bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-20px_rgba(18,34,27,.4)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-ink/50">{selectedPlan?.tenureMonths ?? '—'} month plan</p>
            <p className="truncate text-sm font-extrabold">
              {selectedPlan ? `${formatCurrency(selectedPlan.monthlyPayment)}/mo` : 'Choose an EMI plan'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void proceedToCheckout()}
            disabled={checkoutLoading || plansLoading || !selectedPlanId}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-1.5 rounded-full bg-ink px-5 text-sm font-extrabold text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 disabled:opacity-55"
          >
            {checkoutLoading ? <LoaderCircle className="animate-spin" size={17} /> : <>Continue <ChevronRight size={17} /></>}
          </button>
        </div>
      </div>

      {intent && <CheckoutModal intent={intent} onClose={() => setIntent(null)} />}
    </>
  );
}
