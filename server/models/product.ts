import mongoose, { Schema, type Document, type Types } from 'mongoose';

/* ---------- Sub-document interfaces ---------- */

export interface IProductVariant {
  _id: Types.ObjectId;
  color: string;
  colorHex: string;
  storage: string;
  finish: string;
  imageUrl: string;
  priceAdjustment: number;
  inventory: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmiPlan {
  _id: Types.ObjectId;
  tenureMonths: number;
  interestRate: number;
  cashbackAmount: number;
  processingFee: number;
  isActive: boolean;
  createdAt: Date;
}

export interface ISpecification {
  label: string;
  value: string;
}

export interface IProductRating {
  aggregateRating: number;
  aggregateRatingDisplay: string;         // e.g. "4.2"
  aggregateRatingTag: string;             // e.g. "Excellent"
  totalRatings: number;
  totalReviews: number;
  noOfUnitsSold: number;
  noOfUnitsSoldDisplay: string;           // e.g. "70+ sold"
  fiveStarPercent: number;
  fourStarPercent: number;
  threeStarPercent: number;
  twoStarPercent: number;
  oneStarPercent: number;
}

export interface ICustomerReview {
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

export interface IPolicy {
  icon: string;         // emoji or icon key
  label: string;
  description: string;
}

/* ---------- Product interface ---------- */

export interface IProduct extends Document {
  _id: Types.ObjectId;
  slug: string;
  name: string;
  brand: string;
  badge: string | null;
  description: string;
  category: string;
  basePrice: number;
  mrp: number;
  sellerName: string;
  variants: IProductVariant[];
  emiPlans: IEmiPlan[];
  specifications: ISpecification[];
  rating: IProductRating;
  reviews: ICustomerReview[];
  policies: IPolicy[];
  createdAt: Date;
  updatedAt: Date;
}

/* ---------- Sub-document schemas ---------- */

const productVariantSchema = new Schema<IProductVariant>(
  {
    color: { type: String, required: true },
    colorHex: { type: String, required: true },
    storage: { type: String, required: true },
    finish: { type: String, required: true },
    imageUrl: { type: String, required: true },
    priceAdjustment: { type: Number, default: 0 },
    inventory: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const emiPlanSchema = new Schema<IEmiPlan>({
  tenureMonths: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  cashbackAmount: { type: Number, default: 0 },
  processingFee: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const specSchema = new Schema<ISpecification>({
  label: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false });

const ratingSchema = new Schema<IProductRating>({
  aggregateRating:       { type: Number, default: 0 },
  aggregateRatingDisplay:{ type: String, default: '0.0' },
  aggregateRatingTag:    { type: String, default: '' },
  totalRatings:          { type: Number, default: 0 },
  totalReviews:          { type: Number, default: 0 },
  noOfUnitsSold:         { type: Number, default: 0 },
  noOfUnitsSoldDisplay:  { type: String, default: '0 sold' },
  fiveStarPercent:       { type: Number, default: 0 },
  fourStarPercent:       { type: Number, default: 0 },
  threeStarPercent:      { type: Number, default: 0 },
  twoStarPercent:        { type: Number, default: 0 },
  oneStarPercent:        { type: Number, default: 0 },
}, { _id: false });

const reviewSchema = new Schema<ICustomerReview>({
  id:           { type: String, required: true },
  rating:       { type: Number, required: true },
  title:        { type: String, default: '' },
  body:         { type: String, required: true },
  reviewer:     { type: String, required: true },
  city:         { type: String, default: '' },
  verified:     { type: Boolean, default: true },
  daysAgo:      { type: Number, default: 0 },
  variantLabel: { type: String, default: '' },
}, { _id: false });

const policySchema = new Schema<IPolicy>({
  icon:        { type: String, required: true },
  label:       { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });

/* ---------- Product schema ---------- */

const productSchema = new Schema<IProduct>(
  {
    slug:          { type: String, required: true, unique: true },
    name:          { type: String, required: true },
    brand:         { type: String, required: true },
    badge:         { type: String, default: null },
    description:   { type: String, required: true },
    category:      { type: String, required: true },
    basePrice:     { type: Number, required: true },
    mrp:           { type: Number, required: true },
    sellerName:    { type: String, default: '' },
    variants:      [productVariantSchema],
    emiPlans:      [emiPlanSchema],
    specifications:[specSchema],
    rating:        { type: ratingSchema, default: () => ({}) },
    reviews:       [reviewSchema],
    policies:      [policySchema],
  },
  { timestamps: true },
);

productSchema.index({ category: 1 });
productSchema.index({ createdAt: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
