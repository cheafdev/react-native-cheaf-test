import { z } from 'zod';

// Basic Schemas
export const NutritionFactsSchema = z.object({
  calories: z.number().int().min(0),
  fat: z.number().min(0),
  carbs: z.number().min(0),
  protein: z.number().min(0),
});

export const SnackSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string(),
  category: z.string(),
  imageUrl: z.string().url(),
  inStock: z.boolean(),
  nutritionFacts: NutritionFactsSchema,
});

export const CartItemSchema = z.object({
  snackId: z.string().min(1),
  quantity: z.number().int().positive(),
});

// API-specific Schemas
export const SnacksResponseSchema = z.array(SnackSchema);

export const CheckoutRequestSchema = z.array(CartItemSchema);

export const CheckoutResponseSchema = z.object({
  success: z.boolean(),
  transactionId: z.string().min(1),
});

// Inferred Types
export type Snack = z.infer<typeof SnackSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
