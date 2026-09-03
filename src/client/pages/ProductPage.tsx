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
      ? `Explore ${product.name} pricing, variants and flexible EMI plans on PayFlex.`
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
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-6 sm:px-8 lg:px-10 lg:pb-16 lg:pt-8">
      <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-1.5 text-xs font-semibold text-ink/45">
        <Link to="/" className="rounded hover:text-moss-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500">
          Shop
        </Link>
        <ChevronRight size={13} />
        <span>Smartphones</span>
        {product && (
          <>
            <ChevronRight size={13} />
            <span className="max-w-44 truncate text-ink/75">{product.name}</span>
          </>
        )}
      </nav>

      {error && <ErrorState message={error} onRetry={() => setAttempt((value) => value + 1)} />}
      {!error && product && <ProductExperience product={product} />}
    </div>
  );
}
