import { RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry: () => void;
}

export function ErrorState({
  title = 'Something did not load',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="mx-auto max-w-lg rounded-4xl border border-black/[0.07] bg-white p-8 text-center shadow-card">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-coral/10 text-coral">
        <RefreshCw size={22} />
      </div>
      <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink/60">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white transition hover:bg-moss-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2"
      >
        <RefreshCw size={16} /> Try again
      </button>
    </div>
  );
}
