import { z } from 'zod';

const objectIdRegex = /^[a-f\d]{24}$/i;

export const slugSchema = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a valid product slug.');

export const emiPlanQuerySchema = z.object({
  variantId: z.string().regex(objectIdRegex, 'Invalid variant ID.').optional(),
});

export const checkoutIntentSchema = z.object({
  productSlug: slugSchema,
  variantId: z.string().regex(objectIdRegex, 'Invalid variant ID.'),
  emiPlanId: z.string().regex(objectIdRegex, 'Invalid EMI plan ID.'),
});
