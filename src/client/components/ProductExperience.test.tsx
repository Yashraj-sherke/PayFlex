import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CheckoutIntentDto, ProductDetailDto } from '../../shared/types';
import { requestApi } from '../lib/api';
import { ProductExperience } from './ProductExperience';

vi.mock('../lib/api', () => ({ requestApi: vi.fn() }));

const product: ProductDetailDto = {
  id: 'product_1',
  slug: 'iphone-17-pro',
  name: 'iPhone 17 Pro',
  brand: 'Apple',
  badge: 'JUST IN',
  description: 'A premium phone.',
  category: 'Smartphones',
  basePrice: 127_400,
  mrp: 134_900,
  sellerName: 'Test Store',
  variants: [
    {
      id: 'variant_1',
      color: 'Cosmic Orange',
      colorHex: '#d96a32',
      storage: '256GB',
      finish: 'Satin titanium',
      imageUrl: '/products/iphone-orange.svg',
      priceAdjustment: 0,
      inventory: 12,
      price: 127_400,
    },
  ],
  emiPlans: [
    {
      id: 'plan_12',
      tenureMonths: 12,
      interestRate: 0,
      cashbackAmount: 5_000,
      processingFee: 0,
      monthlyPayment: 10_617,
      totalPayable: 127_404,
    },
  ],
  specifications: [
    { label: 'Storage', value: '256 GB' },
    { label: 'Color', value: 'Cosmic Orange' },
  ],
  rating: {
    aggregateRating: 4.2,
    aggregateRatingDisplay: '4.2',
    aggregateRatingTag: 'Excellent',
    totalRatings: 6,
    totalReviews: 6,
    noOfUnitsSold: 75,
    noOfUnitsSoldDisplay: '70+ sold',
    fiveStarPercent: 66.67,
    fourStarPercent: 16.67,
    threeStarPercent: 0,
    twoStarPercent: 0,
    oneStarPercent: 16.67,
  },
  reviews: [],
  policies: [],
};

const intent: CheckoutIntentDto = {
  intentId: 'intent_1',
  status: 'ready',
  product: { name: product.name, slug: product.slug },
  variant: {
    id: product.variants[0]!.id,
    label: '256GB · Cosmic Orange',
    imageUrl: product.variants[0]!.imageUrl,
  },
  price: 127_400,
  plan: product.emiPlans[0]!,
  disclaimer: 'Demo only — no payment or credit application will be created.',
};

describe('ProductExperience checkout', () => {
  beforeEach(() => {
    vi.mocked(requestApi).mockReset();
  });

  it('creates and confirms a checkout intent for the selected plan', async () => {
    vi.mocked(requestApi).mockResolvedValue(intent);
    const user = userEvent.setup();
    render(<ProductExperience product={product} />);

    await user.click(screen.getByRole('button', { name: /continue with 12-month plan/i }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('256GB · Cosmic Orange')).toBeInTheDocument();
    expect(requestApi).toHaveBeenCalledWith(
      '/api/checkout/intent',
      expect.objectContaining({ method: 'POST' }),
    );

    await user.click(screen.getByRole('button', { name: /confirm demo plan/i }));
    expect(screen.getByText(/plan saved successfully/i)).toBeInTheDocument();
  });
});
