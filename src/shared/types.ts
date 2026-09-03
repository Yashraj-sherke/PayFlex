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
  variants: ProductVariantDto[];
  emiPlans: EmiPlanDto[];
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
