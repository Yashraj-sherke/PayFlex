import 'dotenv/config';
import mongoose from 'mongoose';
import { Product } from './models/product.js';

const uri = process.env.DATABASE_URL ?? 'mongodb://localhost:27017/payflex';

const standardPlans = [
  { tenureMonths: 3, interestRate: 0, cashbackAmount: 7_500, processingFee: 0 },
  { tenureMonths: 6, interestRate: 0, cashbackAmount: 7_500, processingFee: 0 },
  { tenureMonths: 12, interestRate: 0, cashbackAmount: 5_000, processingFee: 0 },
  { tenureMonths: 24, interestRate: 0, cashbackAmount: 3_000, processingFee: 499 },
  { tenureMonths: 36, interestRate: 10.5, cashbackAmount: 2_500, processingFee: 499 },
  { tenureMonths: 48, interestRate: 10.5, cashbackAmount: 2_500, processingFee: 799 },
  { tenureMonths: 60, interestRate: 10.5, cashbackAmount: 0, processingFee: 799 },
];

interface ProductSeed {
  slug: string;
  name: string;
  brand: string;
  badge: string | null;
  description: string;
  category: string;
  basePrice: number;
  mrp: number;
  variants: {
    color: string;
    colorHex: string;
    storage: string;
    finish: string;
    imageUrl: string;
    priceAdjustment: number;
    inventory: number;
  }[];
  emiPlans: {
    tenureMonths: number;
    interestRate: number;
    cashbackAmount: number;
    processingFee: number;
    isActive: boolean;
  }[];
}

const products: ProductSeed[] = [
  {
    slug: 'iphone-17-pro',
    name: 'iPhone 17 Pro',
    brand: 'Apple',
    badge: 'JUST IN',
    description:
      'A refined pro phone experience with a vivid display, all-day battery and a camera system made for ambitious everyday photography.',
    category: 'Smartphones',
    basePrice: 127_400,
    mrp: 134_900,
    variants: [
      { color: 'Cosmic Orange', colorHex: '#d96a32', storage: '256GB', finish: 'Satin titanium', imageUrl: '/products/iphone-orange.svg', priceAdjustment: 0, inventory: 12 },
      { color: 'Silver Mist', colorHex: '#c8cec9', storage: '256GB', finish: 'Satin titanium', imageUrl: '/products/iphone-silver.svg', priceAdjustment: 0, inventory: 8 },
      { color: 'Deep Navy', colorHex: '#35435b', storage: '512GB', finish: 'Satin titanium', imageUrl: '/products/iphone-navy.svg', priceAdjustment: 20_000, inventory: 5 },
    ],
    emiPlans: standardPlans.map((plan) => ({ ...plan, isActive: true })),
  },
  {
    slug: 'samsung-s24-ultra',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    badge: 'EDITOR\u2019S PICK',
    description:
      'A powerful large-screen flagship with an integrated stylus, versatile cameras and a durable titanium frame built for productive days.',
    category: 'Smartphones',
    basePrice: 109_999,
    mrp: 129_999,
    variants: [
      { color: 'Titanium Gray', colorHex: '#aaa69d', storage: '256GB', finish: 'Brushed titanium', imageUrl: '/products/galaxy-gray.svg', priceAdjustment: 0, inventory: 17 },
      { color: 'Titanium Black', colorHex: '#3b3c3d', storage: '512GB', finish: 'Brushed titanium', imageUrl: '/products/galaxy-black.svg', priceAdjustment: 15_000, inventory: 9 },
    ],
    emiPlans: standardPlans.map((plan) => ({
      ...plan,
      cashbackAmount: plan.tenureMonths <= 12 ? 6_000 : plan.cashbackAmount,
      isActive: true,
    })),
  },
  {
    slug: 'google-pixel-10',
    name: 'Pixel 10 Pro',
    brand: 'Google',
    badge: 'SMART CHOICE',
    description:
      'A thoughtful AI-first phone with a clean interface, expressive photography and dependable performance in a beautifully balanced form.',
    category: 'Smartphones',
    basePrice: 99_999,
    mrp: 109_999,
    variants: [
      { color: 'Obsidian', colorHex: '#343639', storage: '256GB', finish: 'Silky matte', imageUrl: '/products/pixel-obsidian.svg', priceAdjustment: 0, inventory: 14 },
      { color: 'Porcelain', colorHex: '#e8e2d7', storage: '256GB', finish: 'Silky matte', imageUrl: '/products/pixel-porcelain.svg', priceAdjustment: 0, inventory: 11 },
    ],
    emiPlans: standardPlans.map((plan) => ({
      ...plan,
      cashbackAmount: plan.tenureMonths <= 12 ? 5_000 : plan.cashbackAmount,
      isActive: true,
    })),
  },
];

async function main() {
  await mongoose.connect(uri);
  console.info('Connected to MongoDB.');

  await Product.deleteMany({});

  for (const product of products) {
    await Product.create(product);
  }

  console.info(`Seeded ${products.length} products with variants and EMI plans.`);
}

main()
  .catch((error: unknown) => {
    console.error('Unable to seed the database.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
