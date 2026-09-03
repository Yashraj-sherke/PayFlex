import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';

interface NotFoundPageProps {
  product?: boolean;
}

export function NotFoundPage({ product = false }: NotFoundPageProps) {
  useDocumentMetadata(
    'Page not found | PayFlex',
    'The page you requested could not be found. Return to the PayFlex product collection.',
  );

  return (
    <div className="mx-auto grid min-h-[68vh] max-w-7xl place-items-center px-5 py-16 sm:px-8">
      <div className="max-w-xl text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white text-moss-600 shadow-card">
          <SearchX size={30} strokeWidth={1.8} />
        </div>
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-moss-600">404 · Not found</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl">
          {product ? 'This product slipped off the shelf.' : 'This page took a wrong turn.'}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-ink/55">
          {product
            ? 'It may be unavailable or the link may have changed. Our current collection is one click away.'
            : 'The address may be incorrect or the page may have moved. Head back to the current collection.'}
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-extrabold text-white transition hover:bg-moss-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft size={17} /> Back to products
        </Link>
      </div>
    </div>
  );
}
