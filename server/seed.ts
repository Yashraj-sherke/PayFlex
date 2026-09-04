import 'dotenv/config';
import mongoose from 'mongoose';
import { Product } from './models/product.js';

const uri = process.env.DATABASE_URL ?? 'mongodb://localhost:27017/payflex';

const standardPlans = [
  { tenureMonths: 3,  interestRate: 0,    cashbackAmount: 5_000, processingFee: 0   },
  { tenureMonths: 6,  interestRate: 0,    cashbackAmount: 5_000, processingFee: 0   },
  { tenureMonths: 9,  interestRate: 0,    cashbackAmount: 3_500, processingFee: 0   },
  { tenureMonths: 12, interestRate: 0,    cashbackAmount: 3_000, processingFee: 0   },
  { tenureMonths: 18, interestRate: 0,    cashbackAmount: 2_000, processingFee: 299 },
  { tenureMonths: 24, interestRate: 0,    cashbackAmount: 1_500, processingFee: 499 },
  { tenureMonths: 36, interestRate: 10.5, cashbackAmount: 0,     processingFee: 499 },
];

const iPhonePolicies = [
  {
    icon: '🔄',
    label: '2 Days Service Centre Replacement',
    description: 'Defective item: Contact Brand or visit Service Centre within 2 days of delivery. Keep item in original packaging with MRP tag. Unboxing video mandatory for any claim.',
  },
  {
    icon: '🏆',
    label: 'Top Brand',
    description: 'Top Brand indicates high-quality, trusted brands that consistently provide a superior customer experience on PayFlex.',
  },
  {
    icon: '🚚',
    label: 'Free Delivery',
    description: 'This product is eligible for free delivery. Dispatched in less than 48 hours and delivered in 3–7 working days.',
  },
  {
    icon: '🔒',
    label: 'Secure Transaction',
    description: 'We work hard to protect your security and privacy. Our payment security system encrypts your information during transmission.',
  },
];

const iPhoneSpecs = [
  { label: 'Storage',          value: '256 GB' },
  { label: 'Color',            value: 'Silver' },
  { label: 'Front Camera',     value: '18MP' },
  { label: 'Front Camera Features', value: '18MP front cam with autofocus, Center Stage, Night mode, HDR 5, portraits, Animoji, 4K stabilized video, spatial audio, and dual capture features.' },
  { label: 'Rear Camera',      value: '48MP + 48MP + 48MP' },
  { label: 'Rear Camera Features', value: '48MP Fusion system with 4 lenses, 8x zoom, up to 40x digital, ProRAW, Night mode, Smart HDR 5, macro, spatial photos, and advanced stabilization.' },
  { label: 'Screen Size',      value: '6.3 inch' },
  { label: 'Screen Resolution',value: '2622 x 1206 Pixels' },
  { label: 'Screen Type',      value: 'Super Retina XDR Display' },
  { label: 'Processor',        value: 'A19 Chip, 6 Core Processor' },
  { label: 'Operating System', value: 'iOS 26' },
  { label: 'SIM Type',         value: 'Dual SIM (Nano + eSIM)' },
  { label: 'Battery',          value: '3,579 mAh' },
  { label: 'In The Box',       value: 'Handset, USB-C Charge Cable (1m), Documentation' },
];

const iPhoneRating = {
  aggregateRating:        4.17,
  aggregateRatingDisplay: '4.2',
  aggregateRatingTag:     'Excellent',
  totalRatings:           6,
  totalReviews:           6,
  noOfUnitsSold:          75,
  noOfUnitsSoldDisplay:   '70+ sold',
  fiveStarPercent:        66.67,
  fourStarPercent:        16.67,
  threeStarPercent:       0,
  twoStarPercent:         0,
  oneStarPercent:         16.67,
};

const iPhoneReviews = [
  {
    id: 'rev_1',
    rating: 5,
    title: 'Great product!',
    body: 'This is a great support by team for this product is fantastic thanks',
    reviewer: 'Anuradha Doshi',
    city: 'Mumbai',
    verified: true,
    daysAgo: 120,
    variantLabel: 'Storage: 256 GB, Color: Silver',
  },
  {
    id: 'rev_2',
    rating: 5,
    title: 'Good',
    body: 'Excellent phone, smooth performance. Really happy with my purchase!',
    reviewer: 'Jayalaxmi Arigela',
    city: 'Hyderabad',
    verified: true,
    daysAgo: 118,
    variantLabel: 'Storage: 256 GB, Color: Cosmic Orange',
  },
  {
    id: 'rev_3',
    rating: 5,
    title: 'Excellent',
    body: 'The camera quality is outstanding. Best iPhone I have ever owned.',
    reviewer: 'Ajad Ali',
    city: 'Unnao',
    verified: true,
    daysAgo: 115,
    variantLabel: 'Storage: 256 GB, Color: Silver',
  },
  {
    id: 'rev_4',
    rating: 4,
    title: 'Good value',
    body: 'Delivery was fast and product is genuine. Loved the packaging.',
    reviewer: 'Priya Nair',
    city: 'Kochi',
    verified: true,
    daysAgo: 90,
    variantLabel: 'Storage: 256 GB, Color: Deep Blue',
  },
  {
    id: 'rev_5',
    rating: 1,
    title: 'Not satisfied',
    body: 'Expected better battery life for the price. Average experience overall.',
    reviewer: 'Ravi Kumar',
    city: 'Delhi',
    verified: true,
    daysAgo: 60,
    variantLabel: 'Storage: 256 GB, Color: Silver',
  },
];

const galaxyPolicies = [
  {
    icon: '🔄',
    label: '7 Days Replacement',
    description: 'Get a full replacement within 7 days for any defect or damage reported.',
  },
  {
    icon: '🏆',
    label: 'Top Brand',
    description: 'Samsung is a trusted premium brand on PayFlex with verified quality standards.',
  },
  {
    icon: '🚚',
    label: 'Free Express Delivery',
    description: 'Free express delivery in 2–5 working days.',
  },
  {
    icon: '🔒',
    label: 'Secure Transaction',
    description: 'End-to-end encrypted payment processing for your security.',
  },
];

const galaxySpecs = [
  { label: 'Storage',          value: '256 GB' },
  { label: 'Front Camera',     value: '12MP' },
  { label: 'Rear Camera',      value: '200MP + 12MP + 10MP + 10MP' },
  { label: 'Screen Size',      value: '6.8 inch' },
  { label: 'Screen Resolution',value: '3088 x 1440 Pixels (QHD+)' },
  { label: 'Screen Type',      value: 'Dynamic AMOLED 2X, 120Hz' },
  { label: 'Processor',        value: 'Snapdragon 8 Gen 3' },
  { label: 'Operating System', value: 'Android 14 (One UI 6.1)' },
  { label: 'Battery',          value: '5,000 mAh' },
  { label: 'Stylus',           value: 'Built-in S Pen' },
  { label: 'SIM Type',         value: 'Dual SIM (Nano + eSIM)' },
];

const pixelPolicies = [
  {
    icon: '🔄',
    label: '7 Days Service Centre Replacement',
    description: 'Contact brand or visit service centre within 7 days of delivery for any defect.',
  },
  {
    icon: '🚚',
    label: 'Free Delivery',
    description: 'Free delivery within 3–6 working days after dispatch.',
  },
  {
    icon: '🔒',
    label: 'Secure Transaction',
    description: 'Your payment data is encrypted and never shared with third parties.',
  },
];

const pixelSpecs = [
  { label: 'Storage',          value: '256 GB' },
  { label: 'Front Camera',     value: '10.5MP' },
  { label: 'Rear Camera',      value: '50MP + 48MP + 48MP' },
  { label: 'Screen Size',      value: '6.3 inch' },
  { label: 'Screen Type',      value: 'LTPO OLED, 120Hz' },
  { label: 'Processor',        value: 'Google Tensor G4' },
  { label: 'Operating System', value: 'Android 14' },
  { label: 'Battery',          value: '4,700 mAh' },
  { label: 'AI Features',      value: 'Magic Eraser, Photo Unblur, Live Translate' },
];

const products = [
  {
    slug: 'iphone-17-pro',
    name: 'iPhone 17 Pro',
    brand: 'Apple',
    badge: 'JUST IN',
    description: 'A refined pro phone experience with a vivid Super Retina XDR display, all-day battery, A19 Pro chip, and a triple 48MP camera system made for ambitious everyday photography.',
    category: 'Smartphones',
    basePrice: 134_900,
    mrp: 149_900,
    sellerName: 'Balaji Infocom',
    variants: [
      { color: 'Cosmic Orange',    colorHex: '#E6632B', storage: '256GB', finish: 'Satin titanium', imageUrl: '/products/iphone-orange.png',        priceAdjustment: 0,      inventory: 14 },
      { color: 'Desert Titanium',  colorHex: '#C39B78', storage: '512GB', finish: 'Satin titanium', imageUrl: '/products/iphone-orange-front.png',  priceAdjustment: 15_000, inventory: 8  },
      { color: 'Pro Camera Studio',colorHex: '#1E293B', storage: '1TB',   finish: 'Satin titanium', imageUrl: '/products/iphone-orange-camera.png', priceAdjustment: 35_000, inventory: 6  },
    ],
    emiPlans: standardPlans.map((plan) => ({ ...plan, isActive: true })),
    specifications: iPhoneSpecs,
    rating: iPhoneRating,
    reviews: iPhoneReviews,
    policies: iPhonePolicies,
  },
  {
    slug: 'samsung-s24-ultra',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    badge: 'EDITOR\'S PICK',
    description: 'A powerful large-screen flagship with an integrated S Pen stylus, 200MP versatile cameras and a durable titanium frame built for productive days.',
    category: 'Smartphones',
    basePrice: 109_999,
    mrp: 129_999,
    sellerName: 'Samsung Official Store',
    variants: [
      { color: 'Titanium Gray', colorHex: '#aaa69d', storage: '256GB', finish: 'Brushed titanium', imageUrl: '/products/galaxy-gray.png',  priceAdjustment: 0,      inventory: 17 },
      { color: 'Titanium Black',colorHex: '#3b3c3d', storage: '512GB', finish: 'Brushed titanium', imageUrl: '/products/galaxy-black.png', priceAdjustment: 15_000, inventory: 9  },
    ],
    emiPlans: standardPlans.map((plan) => ({
      ...plan,
      cashbackAmount: plan.tenureMonths <= 12 ? 6_000 : plan.cashbackAmount,
      isActive: true,
    })),
    specifications: galaxySpecs,
    rating: {
      aggregateRating: 4.5, aggregateRatingDisplay: '4.5', aggregateRatingTag: 'Excellent',
      totalRatings: 18, totalReviews: 14, noOfUnitsSold: 120, noOfUnitsSoldDisplay: '120+ sold',
      fiveStarPercent: 70, fourStarPercent: 20, threeStarPercent: 5, twoStarPercent: 3, oneStarPercent: 2,
    },
    reviews: [
      { id: 'rev_s1', rating: 5, title: 'Beast performance', body: 'S24 Ultra is an absolute beast. S Pen makes it unique.', reviewer: 'Mihir Shah', city: 'Ahmedabad', verified: true, daysAgo: 30, variantLabel: 'Storage: 256 GB, Color: Titanium Gray' },
      { id: 'rev_s2', rating: 4, title: 'Worth it', body: 'Camera is top class. Battery lasts all day. Slight learning curve with One UI.', reviewer: 'Sneha Joshi', city: 'Pune', verified: true, daysAgo: 45, variantLabel: 'Storage: 512 GB, Color: Titanium Black' },
    ],
    policies: galaxyPolicies,
  },
  {
    slug: 'google-pixel-10',
    name: 'Pixel 10 Pro',
    brand: 'Google',
    badge: 'SMART CHOICE',
    description: 'A thoughtful AI-first phone with a clean interface, expressive photography and dependable performance in a beautifully balanced form.',
    category: 'Smartphones',
    basePrice: 99_999,
    mrp: 109_999,
    sellerName: 'Google Store India',
    variants: [
      { color: 'Obsidian', colorHex: '#343639', storage: '256GB', finish: 'Silky matte', imageUrl: '/products/pixel-obsidian.svg', priceAdjustment: 0, inventory: 14 },
      { color: 'Porcelain',colorHex: '#e8e2d7', storage: '256GB', finish: 'Silky matte', imageUrl: '/products/pixel-porcelain.svg',priceAdjustment: 0, inventory: 11 },
    ],
    emiPlans: standardPlans.map((plan) => ({
      ...plan,
      cashbackAmount: plan.tenureMonths <= 12 ? 5_000 : plan.cashbackAmount,
      isActive: true,
    })),
    specifications: pixelSpecs,
    rating: {
      aggregateRating: 4.3, aggregateRatingDisplay: '4.3', aggregateRatingTag: 'Very Good',
      totalRatings: 10, totalReviews: 8, noOfUnitsSold: 80, noOfUnitsSoldDisplay: '80+ sold',
      fiveStarPercent: 60, fourStarPercent: 25, threeStarPercent: 10, twoStarPercent: 3, oneStarPercent: 2,
    },
    reviews: [
      { id: 'rev_p1', rating: 5, title: 'Best camera phone', body: 'Pixel 10 Pro camera in low light is unbeatable. Love the AI features.', reviewer: 'Rahul Menon', city: 'Bangalore', verified: true, daysAgo: 20, variantLabel: 'Storage: 256 GB, Color: Obsidian' },
      { id: 'rev_p2', rating: 4, title: 'Clean software', body: 'Clean Android experience with fast updates. Battery could be better.', reviewer: 'Deepika Singh', city: 'Chennai', verified: true, daysAgo: 35, variantLabel: 'Storage: 256 GB, Color: Porcelain' },
    ],
    policies: pixelPolicies,
  },
];

async function main() {
  await mongoose.connect(uri);
  console.info('Connected to MongoDB.');

  await Product.deleteMany({});

  for (const product of products) {
    await Product.create(product);
  }

  console.info(`Seeded ${products.length} products with variants, EMI plans, specs, ratings, reviews, and policies.`);
}

main()
  .catch((error: unknown) => {
    console.error('Unable to seed the database.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
