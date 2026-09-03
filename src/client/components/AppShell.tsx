import { ChevronRight, LockKeyhole, Sparkles } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export function BrandMark() {
  return (
    <Link
      to="/"
      className="group inline-flex items-center gap-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-4"
      aria-label="PayFlex home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white shadow-card transition-transform group-hover:-rotate-3">
        <span className="font-display text-sm font-extrabold tracking-tight">PF</span>
      </span>
      <span className="font-display text-xl font-extrabold tracking-[-0.04em] text-ink">
        Pay<span className="text-moss-600">Flex</span>
      </span>
    </Link>
  );
}

export function AppShell() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-canvas/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <BrandMark />
          <nav aria-label="Main navigation" className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-white hover:text-ink sm:block"
            >
              Shop
            </Link>
            <a
              href="/#how-it-works"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-white hover:text-ink md:block"
            >
              How it works
            </a>
            <Link
              to="/"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-bold text-white transition hover:bg-moss-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2"
            >
              Explore products <ChevronRight size={15} strokeWidth={2.5} />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-black/[0.07] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto] lg:px-10">
          <div>
            <BrandMark />
            <p className="mt-3 max-w-sm text-sm leading-6 text-ink/55">
              A transparent, interview-ready product financing experience. No hidden math,
              no confusing fine print.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-3 text-xs font-semibold text-ink/60 md:justify-end">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-2">
              <LockKeyhole size={14} /> Secure demo checkout
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-2">
              <Sparkles size={14} /> Clear EMI pricing
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
