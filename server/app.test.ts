// @vitest-environment node
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogService } from './catalog-service';
import { createApp } from './app';
import type { CheckoutIntentDto, ProductDetailDto, ProductSummaryDto } from '../src/shared/types';

const summary: ProductSummaryDto = {
  id: '507f1f77bcf86cd799439011',
  slug: 'iphone-17-pro',
  name: 'iPhone 17 Pro',
  brand: 'Apple',
  badge: 'JUST IN',
  category: 'Smartphones',
  price: 127_400,
  mrp: 134_900,
  imageUrl: '/products/iphone-orange.svg',
  startingMonthlyPayment: 2_739,
  hasZeroInterest: true,
  variantCount: 3,
  sellerName: 'RetailNet',
  rating: {
    aggregateRating: 4.5,
    aggregateRatingDisplay: '4.5',
    aggregateRatingTag: 'Excellent',
    totalRatings: 1245,
    totalReviews: 820,
    noOfUnitsSold: 5600,
    noOfUnitsSoldDisplay: '5000+ sold',
    fiveStarPercent: 68,
    fourStarPercent: 20,
    threeStarPercent: 7,
    twoStarPercent: 3,
    oneStarPercent: 2,
  },
};

const detail: ProductDetailDto = {
  ...summary,
  description: 'A premium phone.',
  basePrice: 127_400,
  variants: [],
  emiPlans: [],
  specifications: [],
  reviews: [],
  policies: [],
};

const fakeCheckoutIntent: CheckoutIntentDto = {
  intentId: 'e9b21f9c-5a9d-43cb-b092-1c70e303d7c5',
  status: 'ready',
  product: { name: 'iPhone 17 Pro', slug: 'iphone-17-pro' },
  variant: { id: '507f1f77bcf86cd799439012', label: '256GB · Cosmic Orange', imageUrl: '/products/iphone-orange.svg' },
  price: 127_400,
  plan: {
    id: '507f1f77bcf86cd799439014',
    tenureMonths: 12,
    interestRate: 0,
    cashbackAmount: 5_000,
    processingFee: 0,
    monthlyPayment: 10_617,
    totalPayable: 127_404,
  },
  disclaimer: 'Demo only — no payment or credit application will be created.',
};

function fakeService(): CatalogService {
  return {
    listProducts: vi.fn().mockResolvedValue([summary]),
    getProduct: vi.fn().mockImplementation((slug: string) =>
      Promise.resolve(slug === summary.slug ? detail : null),
    ),
    getEmiPlans: vi.fn().mockResolvedValue([]),
    createCheckoutIntent: vi.fn().mockResolvedValue(fakeCheckoutIntent),
  };
}

describe('product API', () => {
  it('lists products in a consistent response envelope', async () => {
    const response = await request(createApp({ catalogService: fakeService() })).get(
      '/api/products',
    );

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: [{ slug: 'iphone-17-pro', price: 127_400 }],
    });
  });

  it('returns a product by its slug', async () => {
    const response = await request(createApp({ catalogService: fakeService() })).get(
      '/api/products/iphone-17-pro',
    );

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('iPhone 17 Pro');
  });

  it('returns a product by its MongoDB ObjectId', async () => {
    const service = fakeService();
    service.getProduct = vi.fn().mockImplementation((idOrSlug: string) =>
      Promise.resolve(idOrSlug === summary.id ? detail : null),
    );

    const response = await request(createApp({ catalogService: service })).get(
      `/api/products/${summary.id}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('iPhone 17 Pro');
  });

  it('returns a safe 404 for an unknown product', async () => {
    const response = await request(createApp({ catalogService: fakeService() })).get(
      '/api/products/not-a-real-product',
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: 'PRODUCT_NOT_FOUND',
        message: 'We could not find that product.',
      },
    });
  });

  it('rejects malformed slugs before accessing the service', async () => {
    const response = await request(createApp({ catalogService: fakeService() })).get(
      '/api/products/INVALID_slug',
    );

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('checkout API', () => {
  it('creates a checkout intent with a valid payload', async () => {
    const response = await request(createApp({ catalogService: fakeService() }))
      .post('/api/checkout/intent')
      .send({
        productSlug: 'iphone-17-pro',
        variantId: '507f1f77bcf86cd799439012',
        emiPlanId: '507f1f77bcf86cd799439014',
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        intentId: fakeCheckoutIntent.intentId,
        status: 'ready',
        product: { name: 'iPhone 17 Pro' },
      },
    });
  });

  it('rejects a checkout intent with missing fields', async () => {
    const response = await request(createApp({ catalogService: fakeService() }))
      .post('/api/checkout/intent')
      .send({ productSlug: 'iphone-17-pro' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});

