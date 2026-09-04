import { Search, Store } from 'lucide-react';
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PayFlexLogo } from './PayFlexLogo.js';

const CATEGORIES = [
  'Deals', 'Mobiles', 'Electronics', 'TV & Appliances',
  'Kitchen & Home', 'Health & Wellness', 'Fashion', 'Baby & Kids', 'Sports & Fitness',
];

const FOOTER_CATEGORIES = [
  ['Electronics on EMI', 'Smart Phones on EMI', 'Headphones on EMI', 'Smart Watches on EMI', 'Laptops on EMI', 'Speakers & Soundbars on EMI'],
  ['Kitchen & Home on EMI', 'Juicers & Mixers on EMI', 'Fans on EMI', 'Irons & Steamers on EMI', 'Induction Cooktops on EMI', 'Cookware on EMI'],
  ['TV, AC & Appliances on EMI', 'Televisions on EMI', 'Refrigerators on EMI', 'Washing Machines on EMI', 'Air Conditioners on EMI', 'Air Coolers on EMI'],
  ['Health & Wellness on EMI', 'Protein Supplements on EMI', 'Health Supplements on EMI', 'Cycles on EMI'],
];

const FOOTER_LINKS = {
  'Quick Links': ['About Us', 'Careers', 'FAQ', 'Join as a Merchant', 'Request EMI Solution', 'Partners'],
  'Support': ['Return Policy', 'Contact Us', 'Terms and Conditions', 'Refund Policy', 'Privacy Policy'],
};

export function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Link
      to="/"
      className="group inline-flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      aria-label="PayFlex home"
    >
      <PayFlexLogo size={size} />
    </Link>
  );
}

export function AppShell() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCategory = searchParams.get('category') ?? (searchParams.get('q') ? '' : 'Mobiles');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    setSearchQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  function handleCategoryClick(cat: string) {
    const params = new URLSearchParams();
    params.set('category', cat);
    navigate(`/?${params.toString()}#products`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/?q=${encodeURIComponent(query)}#products`);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* ── Top Header ──────────────────────────────── */}
      <header className="pf-header">
        {/* Main nav row */}
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-5 px-4 sm:px-6 lg:px-10">
          {/* Logo */}
          <BrandMark />

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="relative hidden flex-1 sm:flex"
          >
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for mobiles, laptops, appliances..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
            />
          </form>

          {/* Right actions */}
          <nav className="ml-auto flex shrink-0 items-center gap-1">
            <a
              href="#"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 lg:flex"
            >
              <Store size={16} />
              For Business
            </a>
            <a
              href="#"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 sm:flex"
            >
              Pay EMI
            </a>
            <Link
              to="/"
              id="sign-up-btn"
              className="ml-1 rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Sign Up
            </Link>
          </nav>
        </div>

        {/* Mobile search */}
        <div className="border-t border-slate-100 px-4 pb-2 pt-2 sm:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mobiles, laptops..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100"
            />
          </form>
        </div>

        {/* Category Sub-Nav */}
        <div className="border-t border-slate-100">
          <nav
            aria-label="Category navigation"
            className="pf-scrollbar-hide flex overflow-x-auto px-4 sm:px-6 lg:px-10"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                id={`cat-${cat.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                onClick={() => handleCategoryClick(cat)}
                className={`pf-cat-tab ${activeCategory === cat ? 'pf-cat-tab-active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Page Content ────────────────────────────── */}
      <main>
        <Outlet />
      </main>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-slate-50 pt-12">
        {/* EMI Category Links */}
        <div className="mx-auto max-w-[1440px] border-b border-slate-200 px-4 pb-10 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {FOOTER_CATEGORIES.map((group, gi) => (
              <div key={gi}>
                {group.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="mb-2 block text-xs text-slate-600 transition hover:text-brand-600"
                  >
                    {item}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links + Brand */}
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            {/* Brand info */}
            <div>
              <BrandMark size="lg" />
              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
                A transparent, interview-ready product financing experience. No hidden math, no confusing fine print.
              </p>
              <p className="mt-4 text-xs text-slate-400">
                PayFlex Credit Advisory Pvt. Ltd. · Mumbai, India
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Mon to Sat (10AM to 7PM)
              </p>
            </div>

            {/* Quick Links + Support */}
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">{heading}</h3>
                {links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="mb-2 block text-sm text-slate-600 transition hover:text-brand-600"
                  >
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom strip */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} PayFlex. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-moss-700">
              <span className="inline-flex items-center gap-1 rounded-full bg-moss-50 px-3 py-1 text-[11px]">
                🇮🇳 Proudly made in India
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600">
                🔒 256-bit SSL encrypted
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
