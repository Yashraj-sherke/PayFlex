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
  variants: IProductVariant[];
  emiPlans: IEmiPlan[];
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

/* ---------- Product schema ---------- */

const productSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    badge: { type: String, default: null },
    description: { type: String, required: true },
    category: { type: String, required: true },
    basePrice: { type: Number, required: true },
    mrp: { type: Number, required: true },
    variants: [productVariantSchema],
    emiPlans: [emiPlanSchema],
  },
  { timestamps: true },
);

productSchema.index({ category: 1 });
productSchema.index({ createdAt: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
