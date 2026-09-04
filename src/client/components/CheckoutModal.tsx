import { useEffect, useRef, useState } from 'react';
import { Check, CheckCircle2, LockKeyhole, X } from 'lucide-react';
import type { CheckoutIntentDto } from '../../shared/types';
import { formatCurrency, formatRate } from '../lib/format';
import { ProductImage } from './ProductImage';

interface CheckoutModalProps {
  intent: CheckoutIntentDto;
  onClose: () => void;
}

export function CheckoutModal({ intent, onClose }: CheckoutModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-slate-900/60 p-0 backdrop-blur-sm sm:place-items-center sm:p-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
              <LockKeyhole size={12} /> Secure Demo Checkout
            </span>
            <h2 id="checkout-title" className="mt-4 font-display text-2xl font-extrabold tracking-tight text-slate-900">
              {isConfirmed ? 'Plan saved successfully' : 'You\'re ready to continue'}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Close confirmation"
          >
            <X size={18} />
          </button>
        </div>

        {isConfirmed ? (
          <div className="py-10 text-center">
            <CheckCircle2 className="mx-auto text-emerald-600" size={64} strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-xl font-bold text-slate-900">Order Confirmed!</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
              Your demo financing selection is complete. No payment or credit application was created.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 rounded-full bg-brand-600 px-8 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Product summary */}
            <div className="mt-6 flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white border border-slate-100">
                <ProductImage
                  src={intent.variant.imageUrl}
                  alt=""
                  className="h-full w-full object-contain p-2"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-base font-bold text-slate-900">{intent.product.name}</p>
                <p className="mt-0.5 text-sm text-slate-500">{intent.variant.label}</p>
                <p className="mt-2 text-base font-bold text-slate-900">{formatCurrency(intent.price)}</p>
              </div>
            </div>

            {/* Plan summary */}
            <dl className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 px-5">
              {[
                { label: 'Monthly Payment', value: formatCurrency(intent.plan.monthlyPayment), highlight: true },
                { label: 'Tenure',          value: `${intent.plan.tenureMonths} months` },
                { label: 'Interest Rate',   value: formatRate(intent.plan.interestRate), green: intent.plan.interestRate === 0 },
                { label: 'Total Payable',   value: formatCurrency(intent.plan.totalPayable) },
                ...(intent.plan.cashbackAmount > 0
                  ? [{ label: 'Cashback', value: formatCurrency(intent.plan.cashbackAmount), amber: true }]
                  : []),
              ].map(({ label, value, highlight, green, amber }) => (
                <div key={label} className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="text-sm text-slate-500">{label}</dt>
                  <dd className={`font-bold ${highlight ? 'text-slate-900' : ''} ${green ? 'text-emerald-700' : ''} ${amber ? 'text-amber-700' : ''}`}>
                    {value}
                    {green && intent.plan.interestRate === 0 && (
                      <span className="ml-2 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">No Cost</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">{intent.disclaimer}</p>

            <button
              type="button"
              onClick={() => setIsConfirmed(true)}
              id="confirm-demo-plan-btn"
              className="pf-btn-primary mt-5"
            >
              <Check size={18} strokeWidth={2.5} /> Confirm demo plan
            </button>
          </>
        )}
      </section>
    </div>
  );
}
