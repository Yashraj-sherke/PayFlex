// @vitest-environment node
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogService } from './catalog-service';
import { createApp } from './app';
import type { ProductDetailDto, ProductSummaryDto } from '../src/shared/types';

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
};

const detail: ProductDetailDto = {
  ...summary,
  description: 'A premium phone.',
  basePrice: 127_400,
  variants: [],
  emiPlans: [],
};

function fakeService(): CatalogService {
  return {
    listProducts: vi.fn().mockResolvedValue([summary]),
    getProduct: vi.fn().mockImplementation((slug: string) =>
      Promise.resolve(slug === summary.slug ? detail : null),
    ),
    getEmiPlans: vi.fn().mockResolvedValue([]),
    createCheckoutIntent: vi.fn(),
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
