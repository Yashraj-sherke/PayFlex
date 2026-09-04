import { Check, LoaderCircle } from 'lucide-react';
import type { EmiPlanDto } from '../../shared/types';
import { formatCurrency, formatRate } from '../lib/format';

interface EmiSelectorProps {
  plans: EmiPlanDto[];
  selectedPlanId: string | null;
  isLoading?: boolean;
  onSelect: (planId: string) => void;
}

export function EmiSelector({
  plans,
  selectedPlanId,
  isLoading = false,
  onSelect,
}: EmiSelectorProps) {
  if (isLoading) {
    return (
      <div className="grid min-h-44 place-items-center rounded-xl border border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <LoaderCircle className="animate-spin" size={18} /> Updating plans…
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center">
        <p className="font-bold text-slate-700">No EMI plans currently available.</p>
        <p className="mt-1 text-sm text-slate-500">Please check back later or choose another product.</p>
      </div>
    );
  }

  return (
    <fieldset>
      <legend className="sr-only">Choose an EMI plan</legend>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {plans.map((plan) => {
          const isSelected = plan.id === selectedPlanId;
          const isNoCost = plan.interestRate === 0;

          return (
            <label
              key={plan.id}
              className={`pf-emi-card ${isSelected ? 'pf-emi-card-active' : ''}`}
            >
              <input
                type="radio"
                name="emi-plan"
                value={plan.id}
                checked={isSelected}
                onChange={() => onSelect(plan.id)}
                className="sr-only"
                aria-label={`${plan.tenureMonths} months at ${formatRate(plan.interestRate)} interest, ${formatCurrency(plan.monthlyPayment)} per month`}
              />

              {/* Selected check */}
              <span
                className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                  isSelected
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
                aria-hidden="true"
              >
                {isSelected && <Check size={11} strokeWidth={3} />}
              </span>

              {/* Top row: monthly + no cost badge */}
              <div className="flex items-start justify-between gap-2 pr-7">
                <div>
                  <span className="font-display text-xl font-extrabold text-slate-900">
                    {formatCurrency(plan.monthlyPayment)}
                  </span>
                  <span className="ml-1 text-xs font-medium text-slate-500">
                    × {plan.tenureMonths} mo
                  </span>
                </div>
                {isNoCost && (
                  <span className="pf-badge-no-cost shrink-0">No Cost</span>
                )}
              </div>

              {/* Interest rate */}
              <p className="mt-1.5 text-[11px] font-medium text-slate-500">
                {isNoCost ? (
                  <span className="text-emerald-700 font-semibold">0% Interest</span>
                ) : (
                  <span>{formatRate(plan.interestRate)} p.a.</span>
                )}
                {plan.processingFee > 0 && (
                  <span className="ml-2 text-slate-400">
                    + {formatCurrency(plan.processingFee)} fee
                  </span>
                )}
              </p>

              {/* Cashback */}
              {plan.cashbackAmount > 0 && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-amber-700">
                  🎁 {formatCurrency(plan.cashbackAmount)} cashback
                </p>
              )}

              {/* Total payable */}
              <p className="mt-1 text-[11px] text-slate-400">
                Total: {formatCurrency(plan.totalPayable)}
              </p>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
