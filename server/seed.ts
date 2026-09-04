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

function makePlans(cashback12 = 3_000) {
  return standardPlans.map((plan) => ({
    ...plan,
    cashbackAmount: plan.tenureMonths <= 12 ? cashback12 : plan.cashbackAmount,
    isActive: true,
  }));
}

const defaultPolicies = [
  {
    icon: '🔄',
    label: '7 Days Replacement',
    description: 'Defective item: Contact Brand or visit Service Centre within 7 days of delivery for hassle-free replacement.',
  },
  {
    icon: '🏆',
    label: 'Top Brand',
    description: 'Top Brand indicates high-quality, trusted brands that consistently provide a superior customer experience on PayFlex.',
  },
  {
    icon: '🚚',
    label: 'Free Express Delivery',
    description: 'This product is eligible for free express delivery. Dispatched in less than 24 hours.',
  },
  {
    icon: '🔒',
    label: 'Secure Transaction',
    description: 'We work hard to protect your security and privacy. Our payment security system encrypts your data during transmission.',
  },
];

const products = [
  /* ==========================================================================
     MOBILES
     ========================================================================== */
  {
    slug: 'iphone-17-pro',
    name: 'iPhone 17 Pro',
    brand: 'Apple',
    badge: 'JUST IN',
    description: 'A refined pro phone experience with a vivid Super Retina XDR display, all-day battery, A19 Pro chip, and a triple 48MP camera system made for ambitious everyday photography.',
    category: 'Mobiles',
    basePrice: 134_900,
    mrp: 149_900,
    sellerName: 'Balaji Infocom',
    variants: [
      { color: 'Cosmic Orange',    colorHex: '#E6632B', storage: '256GB', finish: 'Satin titanium', imageUrl: '/products/iphone-orange.png',        priceAdjustment: 0,      inventory: 14 },
      { color: 'Desert Titanium',  colorHex: '#C39B78', storage: '512GB', finish: 'Satin titanium', imageUrl: '/products/iphone-orange-front.png',  priceAdjustment: 15_000, inventory: 8  },
      { color: 'Pro Camera Studio',colorHex: '#1E293B', storage: '1TB',   finish: 'Satin titanium', imageUrl: '/products/iphone-orange-camera.png', priceAdjustment: 35_000, inventory: 6  },
    ],
    emiPlans: makePlans(5_000),
    specifications: [
      { label: 'Storage',          value: '256 GB' },
      { label: 'Color',            value: 'Cosmic Orange' },
      { label: 'Front Camera',     value: '18MP Center Stage' },
      { label: 'Rear Camera',      value: '48MP + 48MP + 48MP Fusion' },
      { label: 'Screen Size',      value: '6.3 inch' },
      { label: 'Screen Type',      value: 'Super Retina XDR Display 120Hz' },
      { label: 'Processor',        value: 'A19 Pro Chip' },
      { label: 'Operating System', value: 'iOS 26' },
      { label: 'Battery',          value: '3,579 mAh' },
    ],
    rating: {
      aggregateRating: 4.8, aggregateRatingDisplay: '4.8', aggregateRatingTag: 'Excellent',
      totalRatings: 142, totalReviews: 89, noOfUnitsSold: 350, noOfUnitsSoldDisplay: '350+ sold',
      fiveStarPercent: 82, fourStarPercent: 12, threeStarPercent: 4, twoStarPercent: 1, oneStarPercent: 1,
    },
    reviews: [
      { id: 'rev_1', rating: 5, title: 'Unreal camera & battery', body: 'The Cosmic Orange is jaw dropping in person. Zero cost EMI made it an easy decision!', reviewer: 'Anuradha Doshi', city: 'Mumbai', verified: true, daysAgo: 14, variantLabel: 'Storage: 256 GB, Color: Cosmic Orange' },
      { id: 'rev_2', rating: 5, title: 'Smooth performance', body: 'The A19 Pro chip effortlessly handles heavy video rendering and gaming.', reviewer: 'Jayalaxmi Arigela', city: 'Hyderabad', verified: true, daysAgo: 21, variantLabel: 'Storage: 512 GB, Color: Desert Titanium' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'samsung-s24-ultra',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    badge: 'EDITOR\'S PICK',
    description: 'A powerful large-screen flagship with an integrated S Pen stylus, 200MP versatile cameras and a durable titanium frame built for productive days.',
    category: 'Mobiles',
    basePrice: 109_999,
    mrp: 129_999,
    sellerName: 'Samsung Official Store',
    variants: [
      { color: 'Titanium Gray', colorHex: '#aaa69d', storage: '256GB', finish: 'Brushed titanium', imageUrl: '/products/galaxy-gray.png',  priceAdjustment: 0,      inventory: 17 },
      { color: 'Titanium Black',colorHex: '#3b3c3d', storage: '512GB', finish: 'Brushed titanium', imageUrl: '/products/galaxy-black.png', priceAdjustment: 15_000, inventory: 9  },
    ],
    emiPlans: makePlans(6_000),
    specifications: [
      { label: 'Storage',          value: '256 GB' },
      { label: 'Rear Camera',      value: '200MP + 50MP + 12MP + 10MP' },
      { label: 'Screen Size',      value: '6.8 inch Dynamic AMOLED 2X' },
      { label: 'Processor',        value: 'Snapdragon 8 Gen 3 for Galaxy' },
      { label: 'Stylus',           value: 'Integrated Bluetooth S Pen' },
      { label: 'Battery',          value: '5,000 mAh with 45W Fast Charging' },
    ],
    rating: {
      aggregateRating: 4.7, aggregateRatingDisplay: '4.7', aggregateRatingTag: 'Excellent',
      totalRatings: 94, totalReviews: 61, noOfUnitsSold: 210, noOfUnitsSoldDisplay: '200+ sold',
      fiveStarPercent: 78, fourStarPercent: 16, threeStarPercent: 3, twoStarPercent: 2, oneStarPercent: 1,
    },
    reviews: [
      { id: 'rev_s1', rating: 5, title: 'Beast of a phone', body: 'The zoom clarity at 30x and 50x is ridiculous. S-Pen note taking during meetings is super handy.', reviewer: 'Mihir Shah', city: 'Ahmedabad', verified: true, daysAgo: 30, variantLabel: 'Storage: 256 GB, Color: Titanium Gray' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'google-pixel-10',
    name: 'Pixel 10 Pro',
    brand: 'Google',
    badge: 'AI FIRST',
    description: 'A thoughtful AI-first phone with a clean interface, expressive photography and dependable performance in a beautifully balanced form.',
    category: 'Mobiles',
    basePrice: 99_999,
    mrp: 109_999,
    sellerName: 'Google Store India',
    variants: [
      { color: 'Obsidian',  colorHex: '#343639', storage: '256GB', finish: 'Silky matte glass', imageUrl: '/products/pixel-obsidian.svg',  priceAdjustment: 0, inventory: 14 },
      { color: 'Porcelain', colorHex: '#e8e2d7', storage: '512GB', finish: 'Silky matte glass', imageUrl: '/products/pixel-porcelain.svg', priceAdjustment: 12_000, inventory: 11 },
    ],
    emiPlans: makePlans(4_500),
    specifications: [
      { label: 'Storage',          value: '256 GB' },
      { label: 'Rear Camera',      value: '50MP Main + 48MP Ultrawide + 48MP Telephoto' },
      { label: 'Screen Size',      value: '6.3 inch Super Actua OLED 120Hz' },
      { label: 'Processor',        value: 'Google Tensor G4 with Titan M2' },
      { label: 'AI Features',      value: 'Gemini Live, Magic Editor, Call Assist' },
      { label: 'Battery',          value: '4,700 mAh' },
    ],
    rating: {
      aggregateRating: 4.6, aggregateRatingDisplay: '4.6', aggregateRatingTag: 'Very Good',
      totalRatings: 68, totalReviews: 44, noOfUnitsSold: 130, noOfUnitsSoldDisplay: '130+ sold',
      fiveStarPercent: 72, fourStarPercent: 18, threeStarPercent: 6, twoStarPercent: 2, oneStarPercent: 2,
    },
    reviews: [
      { id: 'rev_p1', rating: 5, title: 'Best low-light photos', body: 'The Google camera algorithm remains untouched. Zero cost EMI approved in minutes.', reviewer: 'Rahul Menon', city: 'Bangalore', verified: true, daysAgo: 20, variantLabel: 'Storage: 256 GB, Color: Obsidian' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'oneplus-12-5g',
    name: 'OnePlus 12 5G',
    brand: 'OnePlus',
    badge: 'BESTSELLER',
    description: 'Extreme flagship performance powered by Snapdragon 8 Gen 3, Hasselblad 4th Gen Camera System, and 100W SUPERVOOC ultra-fast charging.',
    category: 'Mobiles',
    basePrice: 64_999,
    mrp: 69_999,
    sellerName: 'OnePlus Official',
    variants: [
      { color: 'Flowy Emerald', colorHex: '#2d5238', storage: '256GB', finish: 'Emerald glass', imageUrl: '/products/oneplus-emerald.jpg', priceAdjustment: 0,     inventory: 22 },
      { color: 'Silky Black',   colorHex: '#1e293b', storage: '512GB', finish: 'Matte AG glass', imageUrl: '/products/oneplus-black.jpg',   priceAdjustment: 5_000, inventory: 16 },
    ],
    emiPlans: makePlans(3_000),
    specifications: [
      { label: 'Processor',    value: 'Snapdragon 8 Gen 3 (4nm)' },
      { label: 'Display',      value: '6.82" 2K 120Hz ProXDR with DisplayMate A+' },
      { label: 'Charging',     value: '100W Wired SUPERVOOC + 50W AIRVOOC' },
      { label: 'Battery',      value: '5,400 mAh Dual-cell' },
      { label: 'Camera',       value: '50MP Sony LYT-808 + 64MP 3X Periscope' },
    ],
    rating: {
      aggregateRating: 4.7, aggregateRatingDisplay: '4.7', aggregateRatingTag: 'Excellent',
      totalRatings: 110, totalReviews: 76, noOfUnitsSold: 420, noOfUnitsSoldDisplay: '400+ sold',
      fiveStarPercent: 75, fourStarPercent: 18, threeStarPercent: 5, twoStarPercent: 1, oneStarPercent: 1,
    },
    reviews: [
      { id: 'rev_op1', rating: 5, title: 'Incredible battery & charging', body: 'Charges from 1% to 100% in 26 minutes! Screen is phenomenal in bright sunlight.', reviewer: 'Kunal Verma', city: 'Noida', verified: true, daysAgo: 12, variantLabel: 'Color: Flowy Emerald' },
    ],
    policies: defaultPolicies,
  },

  /* ==========================================================================
     ELECTRONICS
     ========================================================================== */
  {
    slug: 'macbook-pro-14-m3-pro',
    name: 'MacBook Pro 14" M3 Pro',
    brand: 'Apple',
    badge: 'PRO PERFORMANCE',
    description: 'Mind-blowing speed with the Apple M3 Pro chip, breathtaking Liquid Retina XDR display, and up to 18 hours of battery life for demanding developer and creative workflows.',
    category: 'Electronics',
    basePrice: 199_900,
    mrp: 209_900,
    sellerName: 'Imagine Apple Store',
    variants: [
      { color: 'Space Black', colorHex: '#1e2022', storage: '512GB SSD', finish: 'Anodized aluminum', imageUrl: '/products/macbook-screen.png',   priceAdjustment: 0,      inventory: 10 },
      { color: 'Silver',      colorHex: '#e2e8f0', storage: '1TB SSD',   finish: 'Anodized aluminum', imageUrl: '/products/macbook-lid.png',      priceAdjustment: 20_000, inventory: 7  },
      { color: 'Magic Studio',colorHex: '#2b2d31', storage: '1TB SSD',   finish: 'Anodized aluminum', imageUrl: '/products/macbook-keyboard.png', priceAdjustment: 20_000, inventory: 5  },
    ],
    emiPlans: makePlans(8_000),
    specifications: [
      { label: 'Chip',         value: 'Apple M3 Pro (11-core CPU, 14-core GPU)' },
      { label: 'Memory',       value: '18GB Unified Memory' },
      { label: 'Display',      value: '14.2-inch Liquid Retina XDR, 120Hz ProMotion, 1600 nits peak' },
      { label: 'Battery Life', value: 'Up to 18 hours wireless web' },
      { label: 'Ports',        value: '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3, Headphone jack' },
    ],
    rating: {
      aggregateRating: 4.9, aggregateRatingDisplay: '4.9', aggregateRatingTag: 'Outstanding',
      totalRatings: 54, totalReviews: 38, noOfUnitsSold: 160, noOfUnitsSoldDisplay: '150+ sold',
      fiveStarPercent: 91, fourStarPercent: 7, threeStarPercent: 1, twoStarPercent: 1, oneStarPercent: 0,
    },
    reviews: [
      { id: 'rev_mb1', rating: 5, title: 'Developer dream machine', body: 'Compiles massive React and Rust builds instantly. Fans never even turn on!', reviewer: 'Siddharth Rao', city: 'Bangalore', verified: true, daysAgo: 8, variantLabel: 'Color: Space Black' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    badge: 'BEST AUDIO',
    description: 'Industry-leading noise cancellation engineered with dual processors and eight microphones. Hi-Res audio with LDAC and up to 30 hours of continuous playback.',
    category: 'Electronics',
    basePrice: 29_990,
    mrp: 34_990,
    sellerName: 'Sony Center India',
    variants: [
      { color: 'Silver Platinum', colorHex: '#cbd5e1', storage: 'Standard', finish: 'Soft fit leather', imageUrl: '/products/sony-silver.jpg',       priceAdjustment: 0, inventory: 25 },
      { color: 'Silver (Studio)', colorHex: '#94a3b8', storage: 'Standard', finish: 'Soft fit leather', imageUrl: '/products/sony-silver-angle.jpg', priceAdjustment: 0, inventory: 20 },
      { color: 'Midnight Black',  colorHex: '#0f172a', storage: 'Standard', finish: 'Soft fit leather', imageUrl: '/products/sony-black.jpg',        priceAdjustment: 0, inventory: 30 },
      { color: 'Black (Studio)',  colorHex: '#1e293b', storage: 'Standard', finish: 'Soft fit leather', imageUrl: '/products/sony-black-angle.jpg',  priceAdjustment: 0, inventory: 18 },
    ],
    emiPlans: makePlans(1_500),
    specifications: [
      { label: 'Noise Cancellation', value: 'Auto NC Optimizer with 8 microphones & V1/QN1 chips' },
      { label: 'Battery Life',       value: 'Up to 30 hours with ANC on (3 min charge = 3 hours)' },
      { label: 'Audio Codec',        value: 'LDAC, AAC, SBC with DSEE Extreme' },
      { label: 'Weight',             value: '250g ultra-lightweight design' },
      { label: 'Features',           value: 'Speak-to-Chat, Multipoint connection, Touch controls' },
    ],
    rating: {
      aggregateRating: 4.7, aggregateRatingDisplay: '4.7', aggregateRatingTag: 'Excellent',
      totalRatings: 210, totalReviews: 140, noOfUnitsSold: 850, noOfUnitsSoldDisplay: '800+ sold',
      fiveStarPercent: 80, fourStarPercent: 14, threeStarPercent: 4, twoStarPercent: 1, oneStarPercent: 1,
    },
    reviews: [
      { id: 'rev_sn1', rating: 5, title: 'Silence in crowded flights', body: 'The noise cancellation completely blacks out engine noise. Call mic clarity is crystal clear.', reviewer: 'Tanya Kapoor', city: 'Delhi', verified: true, daysAgo: 15, variantLabel: 'Color: Midnight Black' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'ipad-air-11-m2',
    name: 'iPad Air 11" M2 (Wi-Fi)',
    brand: 'Apple',
    badge: 'VERSATILE',
    description: 'Powered by the astonishing Apple M2 chip with a vibrant Liquid Retina display, landscape front camera, and compatibility with the new Apple Pencil Pro.',
    category: 'Electronics',
    basePrice: 59_900,
    mrp: 64_900,
    sellerName: 'Apple Premium Reseller',
    variants: [
      { color: 'Starlight',  colorHex: '#f1ede4', storage: '128GB', finish: 'Recycled aluminum', imageUrl: '/products/ipad-air-front.jpg', priceAdjustment: 0, inventory: 18 },
      { color: 'Space Gray', colorHex: '#4b5563', storage: '256GB', finish: 'Recycled aluminum', imageUrl: '/products/ipad-air-angle.jpg', priceAdjustment: 10_000, inventory: 14 },
    ],
    emiPlans: makePlans(2_500),
    specifications: [
      { label: 'Chip',        value: 'Apple M2 (8-core CPU, 10-core GPU)' },
      { label: 'Display',     value: '11-inch Liquid Retina with True Tone and P3 wide color' },
      { label: 'Camera',      value: 'Landscape 12MP Ultra Wide with Center Stage' },
      { label: 'Accessories', value: 'Supports Apple Pencil Pro & Magic Keyboard' },
    ],
    rating: {
      aggregateRating: 4.8, aggregateRatingDisplay: '4.8', aggregateRatingTag: 'Excellent',
      totalRatings: 92, totalReviews: 55, noOfUnitsSold: 280, noOfUnitsSoldDisplay: '250+ sold',
      fiveStarPercent: 83, fourStarPercent: 12, threeStarPercent: 3, twoStarPercent: 1, oneStarPercent: 1,
    },
    reviews: [
      { id: 'rev_ia1', rating: 5, title: 'Perfect for digital illustration', body: 'The Pencil Pro barrel roll and haptic feedback work like magic on this M2 Air.', reviewer: 'Meera Chawla', city: 'Mumbai', verified: true, daysAgo: 10, variantLabel: 'Color: Starlight' },
    ],
    policies: defaultPolicies,
  },

  /* ==========================================================================
     TV & APPLIANCES
     ========================================================================== */
  {
    slug: 'lg-55-oled-c4-4k',
    name: 'LG 55" OLED evo C4 4K Smart TV',
    brand: 'LG',
    badge: 'CINEMA OLED',
    description: 'Self-lit OLED pixels deliver infinite contrast and 100% color accuracy. Powered by the α9 AI Processor Gen7 with Dolby Vision, Dolby Atmos, and 144Hz VRR for gaming.',
    category: 'TV & Appliances',
    basePrice: 139_990,
    mrp: 179_990,
    sellerName: 'LG Electronics Flagship',
    variants: [
      { color: 'Dark Titan', colorHex: '#1e293b', storage: '55 Inch', finish: 'Ultra-thin bezel', imageUrl: '/products/lg-oled-tv.jpg', priceAdjustment: 0, inventory: 12 },
      { color: 'Dark Titan', colorHex: '#1e293b', storage: '65 Inch', finish: 'Ultra-thin bezel', imageUrl: '/products/lg-oled-tv.jpg', priceAdjustment: 55_000, inventory: 8 },
    ],
    emiPlans: makePlans(7_000),
    specifications: [
      { label: 'Screen Type',     value: 'OLED evo 4K Ultra HD (3840 x 2160)' },
      { label: 'Refresh Rate',    value: '144Hz Native, NVIDIA G-Sync & AMD FreeSync Premium' },
      { label: 'Processor',       value: 'α9 Gen7 AI Processor 4K' },
      { label: 'HDR Formats',     value: 'Dolby Vision, HDR10, HLG, Filmmaker Mode' },
      { label: 'Audio',           value: '40W 2.2 Channel with Dolby Atmos & AI Sound Pro' },
      { label: 'Smart TV OS',     value: 'webOS 24 with 5 years of guaranteed OS updates' },
    ],
    rating: {
      aggregateRating: 4.9, aggregateRatingDisplay: '4.9', aggregateRatingTag: 'Outstanding',
      totalRatings: 78, totalReviews: 50, noOfUnitsSold: 140, noOfUnitsSoldDisplay: '140+ sold',
      fiveStarPercent: 88, fourStarPercent: 10, threeStarPercent: 2, twoStarPercent: 0, oneStarPercent: 0,
    },
    reviews: [
      { id: 'rev_lg1', rating: 5, title: 'Inky black levels are unmatched', body: 'Watching 4K HDR movies in a dark room is pure theater magic. PS5 at 120Hz runs like butter.', reviewer: 'Arjun Nambiar', city: 'Chennai', verified: true, daysAgo: 18, variantLabel: 'Size: 55 Inch' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'dyson-v15-detect',
    name: 'Dyson V15 Detect Extra Cordless Vacuum',
    brand: 'Dyson',
    badge: 'SMART CLEAN',
    description: 'Dyson’s most powerful intelligent cordless vacuum. Features an illuminating cleaner head that reveals invisible microscopic dust on hard floors and an acoustic piezo sensor.',
    category: 'TV & Appliances',
    basePrice: 62_900,
    mrp: 69_900,
    sellerName: 'Dyson India',
    variants: [
      { color: 'Yellow / Nickel', colorHex: '#eab308', storage: 'Standard Pack', finish: 'High-grade polymer', imageUrl: '/products/dyson-v15.jpg', priceAdjustment: 0, inventory: 15 },
    ],
    emiPlans: makePlans(3_000),
    specifications: [
      { label: 'Suction Power',   value: '230 Air Watts with Dyson Hyperdymium motor' },
      { label: 'Runtime',         value: 'Up to 60 minutes fade-free power' },
      { label: 'Filtration',      value: 'Advanced whole-machine HEPA filtration (99.99% down to 0.1 microns)' },
      { label: 'Dust Bin Size',   value: '0.77 Liters with Point-and-Shoot hygienic ejection' },
    ],
    rating: {
      aggregateRating: 4.8, aggregateRatingDisplay: '4.8', aggregateRatingTag: 'Excellent',
      totalRatings: 63, totalReviews: 42, noOfUnitsSold: 190, noOfUnitsSoldDisplay: '180+ sold',
      fiveStarPercent: 85, fourStarPercent: 11, threeStarPercent: 3, twoStarPercent: 1, oneStarPercent: 0,
    },
    reviews: [
      { id: 'rev_dy1', rating: 5, title: 'You will never look at carpets the same', body: 'The green laser optic literally shows dust you could never see. Worth every single rupee.', reviewer: 'Shweta Kulkarni', city: 'Pune', verified: true, daysAgo: 25, variantLabel: 'Color: Yellow/Nickel' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'samsung-653l-french-door',
    name: 'Samsung 653L French Door Smart Refrigerator',
    brand: 'Samsung',
    badge: 'SMART LIVING',
    description: 'Spacious 653L convertible 5-in-1 French door refrigerator with Twin Cooling Plus technology, SmartThings Wi-Fi monitoring, and durable Digital Inverter compressor.',
    category: 'TV & Appliances',
    basePrice: 89_990,
    mrp: 112_000,
    sellerName: 'Samsung Direct',
    variants: [
      { color: 'Refined Inox Steel', colorHex: '#64748b', storage: '653L', finish: 'Fingerprint resistant steel', imageUrl: '/products/samsung-fridge.jpg', priceAdjustment: 0, inventory: 9 },
    ],
    emiPlans: makePlans(4_000),
    specifications: [
      { label: 'Capacity',      value: '653 Liters (Food Compartment: 409L, Freezer: 244L)' },
      { label: 'Cooling Tech',  value: 'Twin Cooling Plus with independent evaporators' },
      { label: 'Energy Rating', value: '3 Star with 20 Year Inverter Warranty' },
      { label: 'Smart Tech',    value: 'Built-in Wi-Fi and SmartThings Energy mode' },
    ],
    rating: {
      aggregateRating: 4.6, aggregateRatingDisplay: '4.6', aggregateRatingTag: 'Very Good',
      totalRatings: 44, totalReviews: 31, noOfUnitsSold: 95, noOfUnitsSoldDisplay: '90+ sold',
      fiveStarPercent: 73, fourStarPercent: 20, threeStarPercent: 5, twoStarPercent: 1, oneStarPercent: 1,
    },
    reviews: [
      { id: 'rev_fr1', rating: 5, title: 'Humongous storage', body: 'Deep freezer bins and quiet operation. Vegetables stay crisp for over 12 days!', reviewer: 'Harish Mehta', city: 'Surat', verified: true, daysAgo: 32, variantLabel: 'Finish: Refined Inox' },
    ],
    policies: defaultPolicies,
  },

  /* ==========================================================================
     KITCHEN & HOME
     ========================================================================== */
  {
    slug: 'philips-airfryer-xxl',
    name: 'Philips Connected Digital Airfryer XXL',
    brand: 'Philips',
    badge: 'HEALTHY EATING',
    description: 'Crispy meals with up to 90% less fat using Rapid Air Technology. Massive 7.2L basket accommodates a whole chicken or up to 6 portions, with NutriU recipe app integration.',
    category: 'Kitchen & Home',
    basePrice: 14_999,
    mrp: 19_995,
    sellerName: 'Kitchen Innovations Hub',
    variants: [
      { color: 'Deep Black / Copper', colorHex: '#18181b', storage: '7.2 Liters', finish: 'Matte composite', imageUrl: '/products/philips-airfryer.jpg', priceAdjustment: 0, inventory: 35 },
    ],
    emiPlans: makePlans(1_000),
    specifications: [
      { label: 'Capacity',       value: '7.2L / 1.4kg (Suitable for 6 people)' },
      { label: 'Power',          value: '2000 Watts Rapid CombiAir' },
      { label: 'Connectivity',   value: 'Wi-Fi Connected via NutriU app' },
      { label: 'Cooking Modes',  value: 'Air fry, bake, grill, roast, dehydrate, toast, keep warm' },
      { label: 'Cleaning',       value: 'QuickClean basket with dishwasher-safe parts' },
    ],
    rating: {
      aggregateRating: 4.7, aggregateRatingDisplay: '4.7', aggregateRatingTag: 'Excellent',
      totalRatings: 185, totalReviews: 120, noOfUnitsSold: 620, noOfUnitsSoldDisplay: '600+ sold',
      fiveStarPercent: 78, fourStarPercent: 15, threeStarPercent: 5, twoStarPercent: 1, oneStarPercent: 1,
    },
    reviews: [
      { id: 'rev_af1', rating: 5, title: 'Crispy samosas and fries with zero oil', body: 'My kids love the food and it cooks in half the time of our conventional oven.', reviewer: 'Pooja Agarwal', city: 'Jaipur', verified: true, daysAgo: 11, variantLabel: 'Color: Deep Black' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'nespresso-vertuo-pop',
    name: 'Nespresso Vertuo Pop Coffee Machine',
    brand: 'Nespresso',
    badge: 'BARISTA AT HOME',
    description: 'Centrifusion technology gently brews four authentic coffee cup sizes at the touch of a single button. Automatic barcode reading calibrates temperature and water volume for velvety crema.',
    category: 'Kitchen & Home',
    basePrice: 18_999,
    mrp: 22_999,
    sellerName: 'Nespresso Boutique India',
    variants: [
      { color: 'Mango Yellow',    colorHex: '#f59e0b', storage: 'Compact Pop', finish: 'Vibrant gloss', imageUrl: '/products/nespresso.svg', priceAdjustment: 0, inventory: 20 },
      { color: 'Liquorice Black', colorHex: '#0f172a', storage: 'Compact Pop', finish: 'Matte black',   imageUrl: '/products/nespresso.svg', priceAdjustment: 0, inventory: 25 },
    ],
    emiPlans: makePlans(1_200),
    specifications: [
      { label: 'Extraction',     value: 'Centrifusion technology (up to 4000 rpm)' },
      { label: 'Cup Sizes',      value: 'Espresso (40ml), Double Espresso (80ml), Gran Lungo (150ml), Mug (230ml)' },
      { label: 'Heat-up Time',   value: 'Fast 30 seconds' },
      { label: 'Water Tank',     value: '0.6 Liter removable tank' },
      { label: 'Connectivity',   value: 'Bluetooth & Wi-Fi for capsule updates' },
    ],
    rating: {
      aggregateRating: 4.6, aggregateRatingDisplay: '4.6', aggregateRatingTag: 'Very Good',
      totalRatings: 74, totalReviews: 48, noOfUnitsSold: 210, noOfUnitsSoldDisplay: '200+ sold',
      fiveStarPercent: 74, fourStarPercent: 18, threeStarPercent: 5, twoStarPercent: 2, oneStarPercent: 1,
    },
    reviews: [
      { id: 'rev_nes1', rating: 5, title: 'Rich creamy foam every morning', body: 'The Vertuo double espresso capsules make lattes that beat Starbucks hands down.', reviewer: 'Rohan Sen', city: 'Kolkata', verified: true, daysAgo: 16, variantLabel: 'Color: Mango Yellow' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'instant-pot-pro-10-in-1',
    name: 'Instant Pot Pro 10-in-1 Multi Cooker',
    brand: 'Instant Pot',
    badge: 'TOP CHEF',
    description: 'Replaces 10 kitchen appliances in one durable package: Pressure Cooker, Slow Cooker, Sous Vide, Rice Cooker, Steamer, Sauté Pan, Cake Maker, and Food Warmer.',
    category: 'Kitchen & Home',
    basePrice: 12_490,
    mrp: 15_999,
    sellerName: 'Gourmet Kitchen World',
    variants: [
      { color: 'Brushed Stainless', colorHex: '#475569', storage: '5.7 Liters', finish: 'Brushed steel', imageUrl: '/products/instant-pot.jpg', priceAdjustment: 0, inventory: 28 },
    ],
    emiPlans: makePlans(800),
    specifications: [
      { label: 'Functions',      value: '10-in-1 Cooker with 28 customized cooking presets' },
      { label: 'Inner Pot',      value: 'Premium 304 food-grade stainless steel with silicone handles' },
      { label: 'Steam Release',  value: 'Gentle steam diffuser switch with noise reduction' },
      { label: 'Safety Systems', value: '11+ proven safety mechanisms with UL certification' },
    ],
    rating: {
      aggregateRating: 4.8, aggregateRatingDisplay: '4.8', aggregateRatingTag: 'Excellent',
      totalRatings: 130, totalReviews: 88, noOfUnitsSold: 410, noOfUnitsSoldDisplay: '400+ sold',
      fiveStarPercent: 82, fourStarPercent: 13, threeStarPercent: 3, twoStarPercent: 1, oneStarPercent: 1,
    },
    reviews: [
      { id: 'rev_ip1', rating: 5, title: 'Dal and Biryani in 15 minutes', body: 'The inner pot works on our gas cooktop too. Cleans easily in the dishwasher.', reviewer: 'Namrata Saxena', city: 'Lucknow', verified: true, daysAgo: 19, variantLabel: 'Size: 5.7 Liters' },
    ],
    policies: defaultPolicies,
  },

  /* ==========================================================================
     HEALTH & WELLNESS
     ========================================================================== */
  {
    slug: 'oral-b-io-series-9',
    name: 'Oral-B iO Series 9 Electric Toothbrush',
    brand: 'Oral-B',
    badge: 'AI DENTAL CARE',
    description: 'Combines powerful yet gentle micro-vibrations with Oral-B\'s dentist-inspired round brush head design. Features 3D teeth tracking and interactive OLED color display.',
    category: 'Health & Wellness',
    basePrice: 18_499,
    mrp: 24_999,
    sellerName: 'Procter & Gamble Healthcare',
    variants: [
      { color: 'Rose Quartz', colorHex: '#f43f5e', storage: 'Series 9 Set', finish: 'Matte ergonomic', imageUrl: '/products/oral-b-io.jpg', priceAdjustment: 0, inventory: 22 },
      { color: 'Black Onyx',  colorHex: '#0f172a', storage: 'Series 9 Set', finish: 'Matte ergonomic', imageUrl: '/products/oral-b-io.jpg', priceAdjustment: 0, inventory: 19 },
    ],
    emiPlans: makePlans(1_200),
    specifications: [
      { label: 'Technology',       value: 'Revolutionary Magnetic iO Drive' },
      { label: 'Brushing Modes',   value: '7 Modes: Daily Clean, Sensitive, Gum Care, Intense Clean, Whitening, Tongue Cleaner, Super Sensitive' },
      { label: 'Smart Sensor',     value: 'Pressure sensor alerts red for too hard, green for optimal' },
      { label: 'Tracking',         value: '3D Teeth Tracking mapping all 16 tooth surfaces' },
      { label: 'Charging',         value: 'Magnetic fast charger powers up in 3 hours' },
    ],
    rating: {
      aggregateRating: 4.8, aggregateRatingDisplay: '4.8', aggregateRatingTag: 'Excellent',
      totalRatings: 86, totalReviews: 54, noOfUnitsSold: 260, noOfUnitsSoldDisplay: '250+ sold',
      fiveStarPercent: 84, fourStarPercent: 11, threeStarPercent: 3, twoStarPercent: 1, oneStarPercent: 1,
    },
    reviews: [
      { id: 'rev_ob1', rating: 5, title: 'Feels like professional dentist cleaning', body: 'The interactive color smiley face when you brush for 2 minutes keeps you honest. Love it!', reviewer: 'Dr. Vivek Sharma', city: 'Chandigarh', verified: true, daysAgo: 14, variantLabel: 'Color: Rose Quartz' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'dyson-supersonic-nural',
    name: 'Dyson Supersonic Nural Intelligent Hair Dryer',
    brand: 'Dyson',
    badge: 'SCALP PROTECTION',
    description: 'A network of Nural sensors automatically adjusts temperature and airflow to protect scalp health and enhance natural shine. Fast drying with no heat damage.',
    category: 'Health & Wellness',
    basePrice: 41_900,
    mrp: 46_900,
    sellerName: 'Dyson India Beauty',
    variants: [
      { color: 'Vinca Blue / Topaz',    colorHex: '#3b82f6', storage: 'With 5 Attachments', finish: 'Ceramic matte', imageUrl: '/products/dyson-hairdryer.jpg', priceAdjustment: 0, inventory: 16 },
      { color: 'Strawberry Bronze',     colorHex: '#fb7185', storage: 'With 5 Attachments', finish: 'Ceramic matte', imageUrl: '/products/dyson-hairdryer.jpg', priceAdjustment: 0, inventory: 12 },
    ],
    emiPlans: makePlans(2_500),
    specifications: [
      { label: 'Scalp Protect Mode',  value: 'Time-of-Flight sensor reduces heat to 55°C as it nears your head' },
      { label: 'Attachment Learning', value: 'RFID sensors remember your personalized styling presets' },
      { label: 'Pause Detect',        value: 'Accelerometer detects when placed down and deactivates heater' },
      { label: 'Included Attachments',value: 'Gentle air attachment, Styling concentrator, Flyaway attachment, Wide-tooth comb, Wave+Curl diffuser' },
    ],
    rating: {
      aggregateRating: 4.9, aggregateRatingDisplay: '4.9', aggregateRatingTag: 'Outstanding',
      totalRatings: 49, totalReviews: 35, noOfUnitsSold: 120, noOfUnitsSoldDisplay: '120+ sold',
      fiveStarPercent: 89, fourStarPercent: 9, threeStarPercent: 2, twoStarPercent: 0, oneStarPercent: 0,
    },
    reviews: [
      { id: 'rev_sn2', rating: 5, title: 'Zero frizz and shiny hair', body: 'The scalp protect mode is genius. Dries thick hair in under 5 minutes without burning.', reviewer: 'Ananya Deshmukh', city: 'Mumbai', verified: true, daysAgo: 9, variantLabel: 'Color: Strawberry Bronze' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'withings-body-scan',
    name: 'Withings Body Scan Smart Health Station',
    brand: 'Withings',
    badge: 'CLINICAL GRADE',
    description: 'The world’s most advanced health station. Provides 6-lead ECG, segmental body composition (legs, arms, torso fat/muscle), nerve health score, and vascular age.',
    category: 'Health & Wellness',
    basePrice: 34_999,
    mrp: 39_999,
    sellerName: 'MedTech Direct',
    variants: [
      { color: 'Obsidian Glass', colorHex: '#0f172a', storage: 'Handle Station', finish: 'High-strength tempered glass', imageUrl: '/products/withings-scale.jpg', priceAdjustment: 0, inventory: 14 },
    ],
    emiPlans: makePlans(2_000),
    specifications: [
      { label: 'ECG Detection',         value: '6-Lead ECG detects atrial fibrillation in 30 seconds' },
      { label: 'Body Composition',      value: 'Multi-frequency BIA calculates precise fat and muscle mass in each limb' },
      { label: 'Nerve Health',          value: 'Sudomotor function galvanic response assessment' },
      { label: 'Vascular Age',          value: 'Pulse wave velocity arterial stiffness index' },
      { label: 'Battery',               value: 'Rechargeable Li-ion battery lasts up to 12 months per charge' },
    ],
    rating: {
      aggregateRating: 4.7, aggregateRatingDisplay: '4.7', aggregateRatingTag: 'Excellent',
      totalRatings: 38, totalReviews: 26, noOfUnitsSold: 85, noOfUnitsSoldDisplay: '80+ sold',
      fiveStarPercent: 79, fourStarPercent: 15, threeStarPercent: 4, twoStarPercent: 1, oneStarPercent: 1,
    },
    reviews: [
      { id: 'rev_wt1', rating: 5, title: 'Doctor recommended health tracker', body: 'The segmental breakdown helped me fix muscle imbalances after ACL knee surgery.', reviewer: 'Vikram Joshi', city: 'Bangalore', verified: true, daysAgo: 22, variantLabel: 'Color: Obsidian Glass' },
    ],
    policies: defaultPolicies,
  },

  /* ==========================================================================
     FASHION
     ========================================================================== */
  {
    slug: 'tissot-prx-powermatic-80',
    name: 'Tissot PRX Powermatic 80 Automatic Watch',
    brand: 'Tissot',
    badge: 'SWISS LUXURY',
    description: 'An iconic integrated bracelet silhouette inspired by the 1978 flagship. Features the revolutionary Powermatic 80 caliber with an 80-hour power reserve and Nivachron anti-magnetic balance spring.',
    category: 'Fashion',
    basePrice: 68_000,
    mrp: 72_000,
    sellerName: 'Ethos Watch Boutiques',
    variants: [
      { color: 'Ice Blue Waffle Dial',  colorHex: '#bae6fd', storage: '40mm Case', finish: 'Satin brushed 316L steel', imageUrl: '/products/tissot-watch.jpg', priceAdjustment: 0, inventory: 11 },
      { color: 'Deep Blue Waffle Dial', colorHex: '#1e3a8a', storage: '40mm Case', finish: 'Satin brushed 316L steel', imageUrl: '/products/tissot-watch.jpg', priceAdjustment: 0, inventory: 14 },
    ],
    emiPlans: makePlans(3_500),
    specifications: [
      { label: 'Movement',       value: 'Swiss Powermatic 80.111 Automatic (80 hr power reserve)' },
      { label: 'Case Material',  value: '316L Stainless Steel with see-through exhibition caseback' },
      { label: 'Glass',          value: 'Scratch-resistant sapphire crystal with anti-reflective coating' },
      { label: 'Water Resistance',value: '10 bar (100 meters / 330 feet)' },
      { label: 'Bracelet',       value: 'Quick-release integrated stainless steel with butterfly clasp' },
    ],
    rating: {
      aggregateRating: 4.9, aggregateRatingDisplay: '4.9', aggregateRatingTag: 'Outstanding',
      totalRatings: 102, totalReviews: 68, noOfUnitsSold: 310, noOfUnitsSoldDisplay: '300+ sold',
      fiveStarPercent: 90, fourStarPercent: 8, threeStarPercent: 1, twoStarPercent: 1, oneStarPercent: 0,
    },
    reviews: [
      { id: 'rev_ts1', rating: 5, title: 'Best sub-1-lakh watch on earth', body: 'The ice blue dial plays with light so gorgeously. The integrated bracelet feels like a Royal Oak at a tenth of the price.', reviewer: 'Rishi Varma', city: 'Mumbai', verified: true, daysAgo: 17, variantLabel: 'Dial: Ice Blue' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'ray-ban-meta-wayfarer',
    name: 'Ray-Ban Meta Wayfarer Smart Audio Glasses',
    brand: 'Ray-Ban',
    badge: 'TECH LUXURY',
    description: 'Next-generation smart eyewear blending timeless Wayfarer styling with an ultra-wide 12MP camera, open-ear spatial speakers, and Meta AI voice assistant integration.',
    category: 'Fashion',
    basePrice: 29_900,
    mrp: 34_900,
    sellerName: 'Sunglass Hut Official',
    variants: [
      { color: 'Shiny Black / G-15 Green', colorHex: '#0f172a', storage: 'Standard Size', finish: 'Polished acetate', imageUrl: '/products/rayban-meta.jpg', priceAdjustment: 0, inventory: 24 },
      { color: 'Matte Jeans / Clear Lens',  colorHex: '#3b82f6', storage: 'Standard Size', finish: 'Matte acetate',    imageUrl: '/products/rayban-meta.jpg', priceAdjustment: 2_000, inventory: 16 },
    ],
    emiPlans: makePlans(1_500),
    specifications: [
      { label: 'Camera',        value: '12MP ultra-wide captures 1080p video up to 60s & hi-res stills' },
      { label: 'Audio',         value: 'Custom built open-ear speakers with 2x bass and directional sound' },
      { label: 'Microphones',   value: '5-microphone array with wind noise suppression' },
      { label: 'Charging Case', value: 'Portable leather charging case provides up to 36 hours total battery' },
      { label: 'AI Voice',      value: 'Meta AI voice interaction: "Hey Meta, what am I looking at?"' },
    ],
    rating: {
      aggregateRating: 4.7, aggregateRatingDisplay: '4.7', aggregateRatingTag: 'Excellent',
      totalRatings: 84, totalReviews: 52, noOfUnitsSold: 240, noOfUnitsSoldDisplay: '240+ sold',
      fiveStarPercent: 77, fourStarPercent: 16, threeStarPercent: 5, twoStarPercent: 1, oneStarPercent: 1,
    },
    reviews: [
      { id: 'rev_rb1', rating: 5, title: 'POV videos are incredible', body: 'Captured my entire vacation through my own eyes without ever holding a smartphone. Sound is shockingly good.', reviewer: 'Kavita Chhabra', city: 'Delhi', verified: true, daysAgo: 13, variantLabel: 'Color: Shiny Black' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'rimowa-classic-cabin',
    name: 'Rimowa Classic Cabin Suitcase',
    brand: 'Rimowa',
    badge: 'ICONIC TRAVEL',
    description: 'Crafted from high-end anodized aluminum alloy with riveted matte black aluminum corners and hand-made leather handles. Designed for lifelong journeys.',
    category: 'Fashion',
    basePrice: 115_000,
    mrp: 125_000,
    sellerName: 'Rimowa Flagship Store',
    variants: [
      { color: 'Silver Aluminum', colorHex: '#e2e8f0', storage: '36 Liters (Cabin)', finish: 'Grooved anodized alloy', imageUrl: '/products/rimowa-luggage.jpg', priceAdjustment: 0, inventory: 8 },
    ],
    emiPlans: makePlans(6_000),
    specifications: [
      { label: 'Dimensions',     value: '55 x 40 x 23 CM (Cabin approved for most airlines)' },
      { label: 'Capacity',       value: '36 Liters, Weight: 4.3 KG' },
      { label: 'Wheel System',   value: 'Rimowa Multiwheel ball-bearing mounted wheels with cushioned axles' },
      { label: 'Locks',          value: 'TSA-Approved lock system integrated into aluminum frame' },
      { label: 'Warranty',       value: 'Rimowa Lifetime Manufacturer Guarantee' },
    ],
    rating: {
      aggregateRating: 4.9, aggregateRatingDisplay: '4.9', aggregateRatingTag: 'Outstanding',
      totalRatings: 42, totalReviews: 29, noOfUnitsSold: 90, noOfUnitsSoldDisplay: '90+ sold',
      fiveStarPercent: 92, fourStarPercent: 6, threeStarPercent: 1, twoStarPercent: 1, oneStarPercent: 0,
    },
    reviews: [
      { id: 'rev_rm1', rating: 5, title: 'Glides across airports effortlessly', body: 'The build quality is beyond anything else. Lifetime warranty and effortless zero cost EMI.', reviewer: 'Sanjay Singhania', city: 'Bangalore', verified: true, daysAgo: 27, variantLabel: 'Finish: Silver Aluminum' },
    ],
    policies: defaultPolicies,
  },

  /* ==========================================================================
     BABY & KIDS
     ========================================================================== */
  {
    slug: 'stokke-tripp-trapp',
    name: 'Stokke Tripp Trapp Adjustable High Chair',
    brand: 'Stokke',
    badge: 'ERGONOMIC DESIGN',
    description: 'The iconic Norwegian chair that grows with your child from newborn to adulthood. Brings your child directly to the family dining table with ergonomic seat and footplate adjustments.',
    category: 'Baby & Kids',
    basePrice: 28_500,
    mrp: 32_900,
    sellerName: 'Scandinavian Baby Co',
    variants: [
      { color: 'Natural Oak', colorHex: '#d97706', storage: 'Standard Size', finish: 'Solid European Beech', imageUrl: '/products/stokke-chair.jpg', priceAdjustment: 0, inventory: 16 },
      { color: 'Warm Red',    colorHex: '#ef4444', storage: 'Standard Size', finish: 'Solid European Beech', imageUrl: '/products/stokke-chair.jpg', priceAdjustment: 0, inventory: 12 },
    ],
    emiPlans: makePlans(1_500),
    specifications: [
      { label: 'Material',       value: 'Sustainably sourced European beech and oak wood' },
      { label: 'Weight Capacity',value: 'Supports up to 136 kg (300 lbs) for a lifetime of use' },
      { label: 'Ergonomics',     value: 'Depth and height adjustable seat and footplate support back & feet' },
      { label: 'Paints & Oils',  value: 'Non-toxic water-based paint free of harmful bisphenols' },
    ],
    rating: {
      aggregateRating: 4.9, aggregateRatingDisplay: '4.9', aggregateRatingTag: 'Outstanding',
      totalRatings: 58, totalReviews: 39, noOfUnitsSold: 180, noOfUnitsSoldDisplay: '180+ sold',
      fiveStarPercent: 90, fourStarPercent: 8, threeStarPercent: 1, twoStarPercent: 1, oneStarPercent: 0,
    },
    reviews: [
      { id: 'rev_st1', rating: 5, title: 'Worth every penny for good posture', body: 'Our toddler eats at the dining table with us happily. Sturdy as a rock.', reviewer: 'Radhika Sen', city: 'Gurgaon', verified: true, daysAgo: 20, variantLabel: 'Color: Natural Oak' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'lego-millennium-falcon-75192',
    name: 'Lego Star Wars Millennium Falcon Collector Set',
    brand: 'LEGO',
    badge: 'ULTIMATE COLLECTOR',
    description: 'The ultimate 7,541-piece Lego Star Wars flagship model. Features intricate exterior detailing, rotating sensor dish, upper and lower quad laser cannons, and landing legs.',
    category: 'Baby & Kids',
    basePrice: 79_999,
    mrp: 89_999,
    sellerName: 'LEGO Certified Store India',
    variants: [
      { color: 'UCS Galactic Gray', colorHex: '#94a3b8', storage: '7,541 Pieces', finish: 'Official LEGO bricks', imageUrl: '/products/lego-starwars.jpg', priceAdjustment: 0, inventory: 7 },
    ],
    emiPlans: makePlans(4_000),
    specifications: [
      { label: 'Piece Count',   value: '7,541 elements (One of the largest LEGO sets ever made)' },
      { label: 'Dimensions',    value: 'Over 21cm high, 84cm long, and 56cm wide' },
      { label: 'Minifigures',   value: 'Includes Han Solo, Chewbacca, Princess Leia, C-3PO, Rey, Finn, and BB-8' },
      { label: 'Age Group',     value: '16+ and Adult Collectors' },
    ],
    rating: {
      aggregateRating: 5.0, aggregateRatingDisplay: '5.0', aggregateRatingTag: 'Masterpiece',
      totalRatings: 67, totalReviews: 49, noOfUnitsSold: 110, noOfUnitsSoldDisplay: '100+ sold',
      fiveStarPercent: 96, fourStarPercent: 4, threeStarPercent: 0, twoStarPercent: 0, oneStarPercent: 0,
    },
    reviews: [
      { id: 'rev_lgf1', rating: 5, title: 'The holy grail of Lego', body: 'Took 32 hours over 3 weekends to build with my teenage son. The detail inside the cockpit is mind-blowing.', reviewer: 'Amitabh Sen', city: 'Bangalore', verified: true, daysAgo: 35, variantLabel: 'Collector Edition' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'cybex-cloud-t-car-seat',
    name: 'Cybex Cloud T i-Size Infant Car Seat',
    brand: 'Cybex',
    badge: 'MAX SAFETY',
    description: 'Ergonomic in-car lie-flat recline with 180° rotation for effortless boarding. Features Linear Side-impact Protection (L.S.P.) and all-round air ventilation.',
    category: 'Baby & Kids',
    basePrice: 36_990,
    mrp: 42_990,
    sellerName: 'FirstCry Premium Brands',
    variants: [
      { color: 'Mirage Blue', colorHex: '#3b82f6', storage: 'Group 0+ (0-24M)', finish: 'Breathable Plus fabric', imageUrl: '/products/cybex-carseat.jpg', priceAdjustment: 0, inventory: 15 },
      { color: 'Deep Black',  colorHex: '#0f172a', storage: 'Group 0+ (0-24M)', finish: 'Breathable Plus fabric', imageUrl: '/products/cybex-carseat.jpg', priceAdjustment: 0, inventory: 18 },
    ],
    emiPlans: makePlans(2_000),
    specifications: [
      { label: 'Safety Standard', value: 'UN R129/03 (i-Size compliant)' },
      { label: 'Child Height',    value: '45 cm – 87 cm (From birth to approx. 24 months)' },
      { label: 'Recline',         value: 'Full lie-flat recline inside and outside vehicle' },
      { label: 'Sun Protection',  value: 'XXL UPF50+ extendable foldaway sun canopy' },
    ],
    rating: {
      aggregateRating: 4.8, aggregateRatingDisplay: '4.8', aggregateRatingTag: 'Excellent',
      totalRatings: 42, totalReviews: 28, noOfUnitsSold: 95, noOfUnitsSoldDisplay: '90+ sold',
      fiveStarPercent: 86, fourStarPercent: 10, threeStarPercent: 3, twoStarPercent: 1, oneStarPercent: 0,
    },
    reviews: [
      { id: 'rev_cy1', rating: 5, title: 'Baby sleeps comfortably on road trips', body: 'The lie-flat mode outside the car makes it act as a mini bassinet on stroller bases.', reviewer: 'Simran Jolly', city: 'Chandigarh', verified: true, daysAgo: 16, variantLabel: 'Color: Mirage Blue' },
    ],
    policies: defaultPolicies,
  },

  /* ==========================================================================
     SPORTS & FITNESS
     ========================================================================== */
  {
    slug: 'garmin-forerunner-965',
    name: 'Garmin Forerunner 965 GPS Running Watch',
    brand: 'Garmin',
    badge: 'PRO ATHLETE',
    description: 'Lightweight titanium bezel framing a brilliant 1.4-inch AMOLED touchscreen display. Full-color built-in topography maps and next-generation training metrics.',
    category: 'Sports & Fitness',
    basePrice: 67_490,
    mrp: 74_990,
    sellerName: 'Garmin India Official',
    variants: [
      { color: 'Amp Yellow / Titanium', colorHex: '#eab308', storage: '47mm Case', finish: 'Titanium bezel', imageUrl: '/products/garmin-watch.jpg', priceAdjustment: 0, inventory: 14 },
      { color: 'Black / Titanium',       colorHex: '#0f172a', storage: '47mm Case', finish: 'Titanium bezel', imageUrl: '/products/garmin-watch.jpg', priceAdjustment: 0, inventory: 18 },
    ],
    emiPlans: makePlans(3_500),
    specifications: [
      { label: 'Display',        value: '1.4" AMOLED Corning Gorilla Glass DX Touchscreen' },
      { label: 'Battery Life',   value: 'Up to 23 days in smartwatch mode / 31 hours in GPS mode' },
      { label: 'GNSS / GPS',     value: 'Multi-band GNSS with SatIQ technology for precision tracking' },
      { label: 'Maps',           value: 'Preloaded full-color TopoActive maps with turn-by-turn navigation' },
      { label: 'Metrics',        value: 'Training Readiness, HRV status, Acute Load, Race Predictor' },
    ],
    rating: {
      aggregateRating: 4.9, aggregateRatingDisplay: '4.9', aggregateRatingTag: 'Outstanding',
      totalRatings: 62, totalReviews: 44, noOfUnitsSold: 195, noOfUnitsSoldDisplay: '190+ sold',
      fiveStarPercent: 89, fourStarPercent: 9, threeStarPercent: 2, twoStarPercent: 0, oneStarPercent: 0,
    },
    reviews: [
      { id: 'rev_gm1', rating: 5, title: 'Trained for Mumbai Marathon with this', body: 'The training readiness and race pacing helped me shatter my PR by 14 minutes. AMOLED display is stunning.', reviewer: 'Akshay Vartak', city: 'Mumbai', verified: true, daysAgo: 12, variantLabel: 'Color: Amp Yellow' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'bowflex-selecttech-552',
    name: 'Bowflex SelectTech 552 Adjustable Dumbbells',
    brand: 'Bowflex',
    badge: 'HOME GYM',
    description: 'Combines 15 sets of weights into one with an easy-to-use dial selection system. Adjusts from 2 to 24 kg per dumbbell in small increments.',
    category: 'Sports & Fitness',
    basePrice: 42_999,
    mrp: 52_999,
    sellerName: 'Fitness Pro Gear',
    variants: [
      { color: 'Carbon Black / Red', colorHex: '#dc2626', storage: 'Pair (2-24 kg)', finish: 'Durable composite molded plates', imageUrl: '/products/bowflex-dumbbells.jpg', priceAdjustment: 0, inventory: 10 },
    ],
    emiPlans: makePlans(2_500),
    specifications: [
      { label: 'Weight Range',   value: '2 to 24 kg (5 to 52.5 lbs) per dumbbell' },
      { label: 'Increments',     value: '2, 3, 4, 5, 7, 8, 9, 11, 14, 16, 18, 20, 23, 24 kg' },
      { label: 'Space Saving',   value: 'Replaces 15 separate pairs of dumbbells' },
      { label: 'Plate Coating',  value: 'Quiet thermoplastic molding for scratch-free, silent lift-off' },
    ],
    rating: {
      aggregateRating: 4.8, aggregateRatingDisplay: '4.8', aggregateRatingTag: 'Excellent',
      totalRatings: 51, totalReviews: 33, noOfUnitsSold: 140, noOfUnitsSoldDisplay: '130+ sold',
      fiveStarPercent: 84, fourStarPercent: 12, threeStarPercent: 3, twoStarPercent: 1, oneStarPercent: 0,
    },
    reviews: [
      { id: 'rev_bf1', rating: 5, title: 'Saves so much apartment space', body: 'The dial mechanism clicks solidly into place. Full body workouts without cluttering my living room.', reviewer: 'Gautam Malhotra', city: 'Delhi', verified: true, daysAgo: 24, variantLabel: 'Pair (2-24 kg)' },
    ],
    policies: defaultPolicies,
  },
  {
    slug: 'concept2-rowerg',
    name: 'Concept2 RowErg Indoor Rower with PM5',
    brand: 'Concept2',
    badge: 'GOLD STANDARD',
    description: 'The recognized benchmark for indoor rowing used by Olympic athletes and CrossFit boxes worldwide. Delivers an effective low-impact, total-body cardiovascular workout.',
    category: 'Sports & Fitness',
    basePrice: 118_000,
    mrp: 132_000,
    sellerName: 'Concept2 India Direct',
    variants: [
      { color: 'Matte Black', colorHex: '#0f172a', storage: 'Standard 14" Leg', finish: 'Powder-coated aluminum monorail', imageUrl: '/products/concept2-rower.jpg', priceAdjustment: 0, inventory: 6 },
    ],
    emiPlans: makePlans(6_000),
    specifications: [
      { label: 'Performance Monitor', value: 'Backlit PM5 monitor with Bluetooth & ANT+ wireless heart rate' },
      { label: 'Flywheel & Damper',   value: 'Spiral damper with 1-10 settings controls airflow resistance' },
      { label: 'Storage',             value: 'Quick-release frame-lock separates into two pieces in 5 seconds' },
      { label: 'Max User Weight',     value: '227 kg (500 lbs) commercial-grade rating' },
    ],
    rating: {
      aggregateRating: 5.0, aggregateRatingDisplay: '5.0', aggregateRatingTag: 'Flawless',
      totalRatings: 36, totalReviews: 28, noOfUnitsSold: 75, noOfUnitsSoldDisplay: '70+ sold',
      fiveStarPercent: 97, fourStarPercent: 3, threeStarPercent: 0, twoStarPercent: 0, oneStarPercent: 0,
    },
    reviews: [
      { id: 'rev_c21', rating: 5, title: 'Indestructible machine', body: 'Connects to ErgData and Apple Health seamlessly. Smooth flywheel feel like real water rowing.', reviewer: 'Captain R. Nair', city: 'Kochi', verified: true, daysAgo: 30, variantLabel: 'Finish: Matte Black' },
    ],
    policies: defaultPolicies,
  },
];

async function main() {
  await mongoose.connect(uri);
  console.info('Connected to MongoDB.');

  await Product.deleteMany({});

  for (const product of products) {
    await Product.create(product);
  }

  console.info(`Successfully seeded ${products.length} products across all categories with complete variants, specifications, ratings, reviews, and EMI plans.`);
}

main()
  .catch((error: unknown) => {
    console.error('Unable to seed the database.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
