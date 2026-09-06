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
  sku: z.string().max(50).optional(),
  category: z.string().max(50).optional().default('Umum'),
  price: z.number().positive('Price must be greater than zero'),
  stockQuantity: z.number().int().min(0, 'Stock cannot be negative'),
  minStockLevel: z.number().int().min(1, 'Minimum stock level must be at least 1').optional().default(10),
});

export const restockProductSchema = z.object({
  quantity: z.number().int().positive('Quantity must be greater than zero'),
});

export const createSaleSchema = z.object({
  customerId: z.string().uuid().optional().nullable(),
  paymentMethod: z.enum(['CASH', 'QRIS', 'TRANSFER', 'KASBON']).default('CASH'),
  paidAmount: z.number().optional(),
  changeAmount: z.number().optional(),
  notes: z.string().max(255).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid('Invalid product ID'),
        quantity: z.number().int().positive('Quantity must be greater than zero'),
      }),
    )
    .min(1, 'At least one item is required'),
});

export const updateCompanySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(255).optional(),
});

