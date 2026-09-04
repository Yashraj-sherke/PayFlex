export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface ProductVariantDto {
  id: string;
  color: string;
  colorHex: string;
  storage: string;
  finish: string;
  imageUrl: string;
  priceAdjustment: number;
  inventory: number;
  price: number;
}

export interface EmiPlanDto {
  id: string;
  tenureMonths: number;
  interestRate: number;
  cashbackAmount: number;
  processingFee: number;
  monthlyPayment: number;
  totalPayable: number;
}

export interface ProductSummaryDto {
  id: string;
  slug: string;
  name: string;
  brand: string;
  badge: string | null;
  category: string;
  price: number;
  mrp: number;
  imageUrl: string;
  startingMonthlyPayment: number | null;
  hasZeroInterest: boolean;
  variantCount: number;
  sellerName: string;
  rating: ProductRatingDto;
}

export interface SpecificationDto {
  label: string;
  value: string;
}

export interface ProductRatingDto {
  aggregateRating: number;
  aggregateRatingDisplay: string;
  aggregateRatingTag: string;
  totalRatings: number;
  totalReviews: number;
  noOfUnitsSold: number;
  noOfUnitsSoldDisplay: string;
  fiveStarPercent: number;
  fourStarPercent: number;
  threeStarPercent: number;
  twoStarPercent: number;
  oneStarPercent: number;
}

export interface CustomerReviewDto {
  id: string;
  rating: number;
  title: string;
  body: string;
  reviewer: string;
  city: string;
  verified: boolean;
  daysAgo: number;
  variantLabel: string;
}

export interface PolicyDto {
  icon: string;
  label: string;
  description: string;
}

export interface ProductDetailDto {
  id: string;
  slug: string;
  name: string;
  brand: string;
  badge: string | null;
  description: string;
  category: string;
  basePrice: number;
  mrp: number;
  sellerName: string;
  variants: ProductVariantDto[];
  emiPlans: EmiPlanDto[];
  specifications: SpecificationDto[];
  rating: ProductRatingDto;
  reviews: CustomerReviewDto[];
  policies: PolicyDto[];
}

export interface CheckoutIntentInput {
  productSlug: string;
  variantId: string;
  emiPlanId: string;
}

export interface CheckoutIntentDto {
  intentId: string;
  status: 'ready';
  product: {
    name: string;
    slug: string;
  };
  variant: {
    id: string;
    label: string;
    imageUrl: string;
  };
  price: number;
  plan: EmiPlanDto;
  disclaimer: string;
}
