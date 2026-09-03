import { Check, Gift, LoaderCircle } from 'lucide-react';
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
      <div className="grid min-h-56 place-items-center rounded-3xl border border-black/[0.06] bg-white">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink/55">
          <LoaderCircle className="animate-spin" size={18} /> Updating your plans…
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-black/15 bg-white p-6 text-center">
        <p className="font-bold">No EMI plans are currently available.</p>
        <p className="mt-1 text-sm text-ink/55">Please check back later or choose another product.</p>
      </div>
    );
  }

  return (
    <fieldset>
      <legend className="sr-only">Choose an EMI plan</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {plans.map((plan) => {
          const isSelected = plan.id === selectedPlanId;
          return (
            <label
              key={plan.id}
              className={`relative cursor-pointer rounded-2xl border p-4 transition duration-200 focus-within:ring-2 focus-within:ring-moss-500 focus-within:ring-offset-2 ${
                isSelected
                  ? 'border-moss-600 bg-moss-50 shadow-[0_10px_25px_-18px_rgba(25,127,76,.7)]'
                  : 'border-black/[0.09] bg-white hover:border-moss-300 hover:bg-moss-50/40'
              }`}
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
              <span
                className={`absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full border transition ${
                  isSelected
                    ? 'border-moss-600 bg-moss-600 text-white'
                    : 'border-black/15 bg-white text-transparent'
                }`}
                aria-hidden="true"
              >
                <Check size={12} strokeWidth={3} />
              </span>

              <div className="flex items-baseline justify-between gap-2 pr-6">
                <p className="text-lg font-extrabold tracking-tight">
                  {formatCurrency(plan.monthlyPayment)}
                  <span className="text-sm font-semibold text-ink/60"> × {plan.tenureMonths} months</span>
                </p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    plan.interestRate === 0
                      ? 'bg-moss-100 text-moss-700'
                      : 'bg-black/[0.05] text-ink/70'
                  }`}
                >
                  {formatRate(plan.interestRate)} interest
                </span>
              </div>
              {plan.cashbackAmount > 0 && (
                <p className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-moss-700">
                  <Gift size={14} /> Additional cashback of {formatCurrency(plan.cashbackAmount)}
                </p>
              )}
              {plan.processingFee > 0 && (
                <p className="mt-1 text-[11px] font-medium text-ink/45">
                  {formatCurrency(plan.processingFee)} one-time processing fee
                </p>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
