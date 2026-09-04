import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import { calculateEmi, calculateTotalPayable } from '../src/shared/emi.js';
import type {
  CheckoutIntentDto,
  CheckoutIntentInput,
  CustomerReviewDto,
  EmiPlanDto,
  PolicyDto,
  ProductDetailDto,
  ProductRatingDto,
  ProductSummaryDto,
  ProductVariantDto,
  SpecificationDto,
} from '../src/shared/types.js';
import { Product, type IEmiPlan, type IProduct, type IProductVariant } from './models/product.js';

export class ProductNotFoundError extends Error {}
export class InvalidSelectionError extends Error {}

export interface CatalogService {
  listProducts(): Promise<ProductSummaryDto[]>;
  getProduct(slug: string): Promise<ProductDetailDto | null>;
  getEmiPlans(slug: string, variantId?: string): Promise<EmiPlanDto[]>;
  createCheckoutIntent(input: CheckoutIntentInput): Promise<CheckoutIntentDto>;
}

function toPlan(price: number, plan: IEmiPlan): EmiPlanDto {
  const monthlyPayment = calculateEmi({
    principal: price,
    annualInterestRate: plan.interestRate,
    tenureMonths: plan.tenureMonths,
  });

  return {
    id: plan._id.toString(),
    tenureMonths: plan.tenureMonths,
    interestRate: plan.interestRate,
    cashbackAmount: plan.cashbackAmount,
    processingFee: plan.processingFee,
    monthlyPayment,
    totalPayable: calculateTotalPayable(monthlyPayment, plan.tenureMonths, plan.processingFee),
  };
}

function toVariant(basePrice: number, variant: IProductVariant): ProductVariantDto {
  return {
    id: variant._id.toString(),
    color: variant.color,
    colorHex: variant.colorHex,
    storage: variant.storage,
    finish: variant.finish,
    imageUrl: variant.imageUrl,
    priceAdjustment: variant.priceAdjustment,
    inventory: variant.inventory,
    price: basePrice + variant.priceAdjustment,
  };
}

function toRatingDto(product: IProduct): ProductRatingDto {
  const r = product.rating ?? {};
  return {
    aggregateRating:        r.aggregateRating ?? 0,
    aggregateRatingDisplay: r.aggregateRatingDisplay ?? '0.0',
    aggregateRatingTag:     r.aggregateRatingTag ?? '',
    totalRatings:           r.totalRatings ?? 0,
    totalReviews:           r.totalReviews ?? 0,
    noOfUnitsSold:          r.noOfUnitsSold ?? 0,
    noOfUnitsSoldDisplay:   r.noOfUnitsSoldDisplay ?? '0 sold',
    fiveStarPercent:        r.fiveStarPercent ?? 0,
    fourStarPercent:        r.fourStarPercent ?? 0,
    threeStarPercent:       r.threeStarPercent ?? 0,
    twoStarPercent:         r.twoStarPercent ?? 0,
    oneStarPercent:         r.oneStarPercent ?? 0,
  };
}

function toReviewDtos(product: IProduct): CustomerReviewDto[] {
  return (product.reviews ?? []).map((r) => ({
    id:           r.id,
    rating:       r.rating,
    title:        r.title,
    body:         r.body,
    reviewer:     r.reviewer,
    city:         r.city,
    verified:     r.verified,
    daysAgo:      r.daysAgo,
    variantLabel: r.variantLabel,
  }));
}

function toPolicyDtos(product: IProduct): PolicyDto[] {
  return (product.policies ?? []).map((p) => ({
    icon:        p.icon,
    label:       p.label,
    description: p.description,
  }));
}

function toSpecDtos(product: IProduct): SpecificationDto[] {
  return (product.specifications ?? []).map((s) => ({
    label: s.label,
    value: s.value,
  }));
}

function activePlans(product: IProduct): IEmiPlan[] {
  return product.emiPlans
    .filter((plan) => plan.isActive)
    .sort((a, b) => a.tenureMonths - b.tenureMonths);
}

function productFilter(slugOrId: string) {
  if (mongoose.isValidObjectId(slugOrId)) {
    return { $or: [{ slug: slugOrId }, { _id: slugOrId }] };
  }
  return { slug: slugOrId };
}

export function createMongooseCatalogService(): CatalogService {
  return {
    async listProducts() {
      const products = await Product.find().sort({ createdAt: 1 }).lean<IProduct[]>();

      return products.map((product) => {
        const defaultVariant = product.variants[0];
        const price = product.basePrice + (defaultVariant?.priceAdjustment ?? 0);
        const plans = activePlans(product);
        const computedPlans = plans.map((plan) => toPlan(price, plan));
        const startingMonthlyPayment = computedPlans.length
          ? Math.min(...computedPlans.map((plan) => plan.monthlyPayment))
          : null;

        return {
          id: product._id.toString(),
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          badge: product.badge,
          category: product.category,
          price,
          mrp: product.mrp,
          imageUrl: defaultVariant?.imageUrl ?? '/products/fallback.svg',
          startingMonthlyPayment,
          hasZeroInterest: plans.some((plan) => plan.interestRate === 0),
          variantCount: product.variants.length,
          sellerName: product.sellerName ?? '',
          rating: toRatingDto(product),
        };
      });
    },

    async getProduct(slug) {
      const product = await Product.findOne(productFilter(slug)).lean<IProduct>();
      if (!product) return null;

      const variants = product.variants
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map((variant) => toVariant(product.basePrice, variant));

      const defaultPrice = variants[0]?.price ?? product.basePrice;
      const plans = activePlans(product);

      return {
        id: product._id.toString(),
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        badge: product.badge,
        description: product.description,
        category: product.category,
        basePrice: product.basePrice,
        mrp: product.mrp,
        sellerName: product.sellerName ?? '',
        variants,
        emiPlans: plans.map((plan) => toPlan(defaultPrice, plan)),
        specifications: toSpecDtos(product),
        rating: toRatingDto(product),
        reviews: toReviewDtos(product),
        policies: toPolicyDtos(product),
      };
    },

    async getEmiPlans(slug, variantId) {
      const product = await Product.findOne(productFilter(slug)).lean<IProduct>();
      if (!product) throw new ProductNotFoundError('Product not found.');

      const variant = variantId
        ? product.variants.find((item) => item._id.toString() === variantId)
        : product.variants[0];

      if (variantId && !variant) {
        throw new InvalidSelectionError('That variant does not belong to this product.');
      }

      const price = product.basePrice + (variant?.priceAdjustment ?? 0);
      return activePlans(product).map((plan) => toPlan(price, plan));
    },

    async createCheckoutIntent(input) {
      const product = await Product.findOne(productFilter(input.productSlug)).lean<IProduct>();
      if (!product) throw new ProductNotFoundError('Product not found.');

      const variant = product.variants.find(
        (item) => item._id.toString() === input.variantId,
      );
      const plan = product.emiPlans.find(
        (item) => item._id.toString() === input.emiPlanId && item.isActive,
      );

      if (!variant || !plan) {
        throw new InvalidSelectionError('Choose a valid variant and active EMI plan.');
      }

      if (variant.inventory < 1) {
        throw new InvalidSelectionError('This variant is currently out of stock.');
      }

      const price = product.basePrice + variant.priceAdjustment;

      return {
        intentId: randomUUID(),
        status: 'ready',
        product: { name: product.name, slug: product.slug },
        variant: {
          id: variant._id.toString(),
          label: `${variant.storage} · ${variant.color}`,
          imageUrl: variant.imageUrl,
        },
        price,
        plan: toPlan(price, plan),
        disclaimer: 'Demo only — no payment or credit application will be created.',
      };
    },
  };
}
