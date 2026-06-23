import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone must not exceed 15 digits')
    .regex(/^(08|628|\+628)[0-9]+$/, 'Must be a valid Indonesian phone number')
    .optional(),
  email: z.string().email('Must be a valid email').optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  price: z.number().positive('Price must be greater than zero'),
  stockQuantity: z.number().int().min(0, 'Stock cannot be negative'),
});

export const restockProductSchema = z.object({
  quantity: z.number().int().positive('Quantity must be greater than zero'),
});
