import { ArrowUpRight, BadgeIndianRupee, Layers3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ProductSummaryDto } from '../../shared/types';
import { formatCurrency } from '../lib/format';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: ProductSummaryDto;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const savings = product.mrp - product.price;

  return (
    <article
      className="group animate-fade-up overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white p-4 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <Link
        to={`/products/${product.slug}`}
        className="block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2"
        aria-label={`View ${product.name} details`}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#edf1ec]">
          {product.badge && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.15em] text-moss-700 backdrop-blur">
              {product.badge}
            </span>
          )}
          {product.hasZeroInterest && (
            <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1.5 text-[10px] font-extrabold text-white">
              <BadgeIndianRupee size={12} /> 0% EMI
            </span>
          )}
          <ProductImage
            src={product.imageUrl}
            alt={`${product.name} product view`}
            className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-[1.04]"
          />
        </div>
      </Link>

      <div className="px-2 pb-2 pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-moss-600">
            {product.brand}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-ink/45">
            <Layers3 size={13} /> {product.variantCount} options
          </span>
        </div>
        <h2 className="mt-2 truncate font-display text-2xl font-extrabold tracking-[-0.035em]">
          {product.name}
        </h2>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-extrabold">{formatCurrency(product.price)}</span>
          <span className="text-sm text-ink/40 line-through">{formatCurrency(product.mrp)}</span>
        </div>
        <p className="mt-1 text-xs font-semibold text-moss-600">
          Save {formatCurrency(savings)}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-black/[0.06] pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/40">
              Starts at
            </p>
            <p className="mt-0.5 text-sm font-extrabold">
              {product.startingMonthlyPayment
                ? `${formatCurrency(product.startingMonthlyPayment)}/mo`
                : 'Plans unavailable'}
            </p>
          </div>
          <Link
            to={`/products/${product.slug}`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-bold text-white transition group-hover:bg-moss-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2"
          >
            View details <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
