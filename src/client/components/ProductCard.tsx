import { Star } from 'lucide-react';
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
  const savingsPct = product.mrp > 0 ? Math.round((savings / product.mrp) * 100) : 0;
  const rating = product.rating;

  return (
    <article
      className="group animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <Link
        to={`/products/${product.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        aria-label={`View ${product.name} details`}
      >
        {/* Product image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
          {product.badge && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {product.badge}
            </span>
          )}
          {product.hasZeroInterest && (
            <span className="absolute right-3 top-3 z-10 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white">
              No Cost EMI
            </span>
          )}
          <ProductImage
            src={product.imageUrl}
            alt={`${product.name} product view`}
            className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-[1.04]"
          />
        </div>
      </Link>

      {/* Card body */}
      <div className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          {product.brand}
        </p>
        <h2 className="mt-1 truncate text-base font-bold text-slate-900">
          {product.name}
        </h2>

        {/* Rating row */}
        {rating && rating.totalRatings > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5 rounded bg-emerald-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
              {rating.aggregateRatingDisplay} <Star size={9} fill="white" />
            </span>
            <span className="text-[11px] text-slate-500">
              ({rating.totalRatings}) · {rating.noOfUnitsSoldDisplay}
            </span>
          </div>
        )}

        {/* Pricing */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">{formatCurrency(product.price)}</span>
          <span className="text-sm text-slate-400 line-through">{formatCurrency(product.mrp)}</span>
          {savingsPct > 0 && (
            <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
              {savingsPct}% off
            </span>
          )}
        </div>

        {/* EMI from */}
        {product.startingMonthlyPayment && (
          <p className="mt-1 text-xs text-slate-500">
            EMI from{' '}
            <span className="font-semibold text-slate-700">
              {formatCurrency(product.startingMonthlyPayment)}/mo
            </span>
          </p>
        )}

        {/* Seller + CTA */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <p className="truncate text-[11px] text-slate-400">
            {product.sellerName ? `By ${product.sellerName}` : `${product.variantCount} variants`}
          </p>
          <Link
            to={`/products/${product.slug}`}
            id={`view-product-${product.slug}`}
            className="shrink-0 rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Buy on EMI
          </Link>
        </div>
      </div>
    </article>
  );
}
