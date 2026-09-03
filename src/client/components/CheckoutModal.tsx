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
      className="fixed inset-0 z-50 grid place-items-end bg-ink/55 p-0 backdrop-blur-sm sm:place-items-center sm:p-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-[2rem] sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-moss-100 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-moss-700">
              <LockKeyhole size={13} /> Secure demo
            </span>
            <h2 id="checkout-title" className="mt-4 font-display text-3xl font-extrabold tracking-[-0.045em]">
              {isConfirmed ? 'Plan saved successfully' : 'You’re ready to continue'}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-canvas text-ink/60 transition hover:bg-black/[0.08] hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500"
            aria-label="Close confirmation"
          >
            <X size={19} />
          </button>
        </div>

        {isConfirmed ? (
          <div className="py-10 text-center">
            <CheckCircle2 className="mx-auto text-moss-600" size={64} strokeWidth={1.5} />
            <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-ink/60">
              Your demo financing selection is complete. No payment or credit application was created.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 min-h-12 rounded-full bg-ink px-7 text-sm font-extrabold text-white transition hover:bg-moss-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mt-7 flex items-center gap-4 rounded-3xl bg-canvas p-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#e9eee9]">
                <ProductImage
                  src={intent.variant.imageUrl}
                  alt=""
                  className="h-full w-full object-contain p-2"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-extrabold">{intent.product.name}</p>
                <p className="mt-1 text-sm text-ink/55">{intent.variant.label}</p>
                <p className="mt-2 text-sm font-extrabold">{formatCurrency(intent.price)}</p>
              </div>
            </div>

            <dl className="mt-5 divide-y divide-black/[0.07] rounded-3xl border border-black/[0.07] px-5">
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-sm text-ink/55">Monthly payment</dt>
                <dd className="font-extrabold">{formatCurrency(intent.plan.monthlyPayment)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-sm text-ink/55">Tenure</dt>
                <dd className="font-bold">{intent.plan.tenureMonths} months</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-sm text-ink/55">Interest</dt>
                <dd className="font-bold text-moss-700">{formatRate(intent.plan.interestRate)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-sm text-ink/55">Cashback</dt>
                <dd className="font-bold text-moss-700">{formatCurrency(intent.plan.cashbackAmount)}</dd>
              </div>
            </dl>

            <p className="mt-4 text-center text-[11px] leading-5 text-ink/45">{intent.disclaimer}</p>
            <button
              type="button"
              onClick={() => setIsConfirmed(true)}
              className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-base font-extrabold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-moss-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2"
            >
              <Check size={18} strokeWidth={2.5} /> Confirm demo plan
            </button>
          </>
        )}
      </section>
    </div>
  );
}
