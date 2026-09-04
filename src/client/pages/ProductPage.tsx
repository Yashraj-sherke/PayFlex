import { useCallback, useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { ProductDetailDto } from '../../shared/types';
import { ErrorState } from '../components/ErrorState';
import { ProductExperience } from '../components/ProductExperience';
import { ProductPageSkeleton } from '../components/LoadingStates';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { ApiRequestError, requestApi } from '../lib/api';
import { NotFoundPage } from './NotFoundPage';

export function ProductPage() {
  const { slug = '' } = useParams();
  const [product, setProduct] = useState<ProductDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useDocumentMetadata(
    product ? `${product.name} | EMI Plans | PayFlex` : 'Product | PayFlex',
    product
      ? `Buy ${product.name} on easy EMI from ${product.sellerName || 'PayFlex'}. Compare ${product.emiPlans.length} EMI plans with transparent pricing.`
      : 'Explore transparent product pricing and flexible EMI plans on PayFlex.',
  );

  const loadProduct = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    try {
      setProduct(
        await requestApi<ProductDetailDto>(
          `/api/products/${encodeURIComponent(slug)}`,
          undefined,
          signal,
        ),
      );
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === 'AbortError') return;
      if (loadError instanceof ApiRequestError && loadError.status === 404) {
        setNotFound(true);
      } else {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load this product.');
      }
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const controller = new AbortController();
    void loadProduct(controller.signal);
    return () => controller.abort();
  }, [attempt, loadProduct]);

  if (notFound) return <NotFoundPage product />;
  if (isLoading) return <ProductPageSkeleton />;

  return (
    <div className="bg-slate-50">
      {/* Breadcrumb */}
      <div className="hidden border-b border-slate-100 bg-white px-4 py-3 sm:px-8 lg:block lg:px-10">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto flex max-w-[1440px] items-center gap-1 text-xs font-medium text-slate-500"
        >
          <Link to="/" className="pf-breadcrumb-link">Shop on EMI</Link>
          <ChevronRight size={13} className="text-slate-300" />
          <span className="pf-breadcrumb-link cursor-pointer hover:text-brand-600">
            {product?.category ?? 'Smart Phones'}
          </span>
          <ChevronRight size={13} className="text-slate-300" />
          <span className="pf-breadcrumb-link cursor-pointer hover:text-brand-600">
            {product?.brand ?? 'Apple'}
          </span>
          {product && (
            <>
              <ChevronRight size={13} className="text-slate-300" />
              <span className="max-w-xs truncate font-semibold text-slate-800">{product.name}</span>
            </>
          )}
        </nav>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-[1440px] px-4 pb-28 pt-4 sm:px-8 lg:px-10 lg:pb-16 lg:pt-8">
        {error && <ErrorState message={error} onRetry={() => setAttempt((v) => v + 1)} />}
        {!error && product && <ProductExperience product={product} />}
      </div>
    </div>
  );
}
