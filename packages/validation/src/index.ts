import { z } from 'zod';
import { BusinessType, Role, InsightType } from '@ai-coo/shared-types';

// ============================================
// Common Validators
// ============================================

/**
 * Indonesian mobile phone number validation.
 * Accepts formats: 08xxxxxxxxxx, +628xxxxxxxxxx
 * Length: 10-13 digits after country code.
 */
export const indonesianPhoneSchema = z
  .string()
  .regex(
    /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/,
    'Nomor telepon Indonesia tidak valid (contoh: 08123456789)',
  );

/**
 * Money amount in integer Rupiah. Must be non-negative.
 */
export const moneySchema = z
  .number()
  .int('Jumlah harus bilangan bulat (Rupiah, tanpa desimal)')
  .nonnegative('Jumlah tidak boleh negatif');

/**
 * UUID v4 string validation.
 */
export const uuidSchema = z.string().uuid('ID tidak valid');

// ============================================
// Enum Schemas
// ============================================

export const businessTypeSchema = z.nativeEnum(BusinessType);
export const roleSchema = z.nativeEnum(Role);
export const insightTypeSchema = z.nativeEnum(InsightType);

// ============================================
// AI Insight Payload Schema (spec §9.3)
// ============================================

export const insightActionItemSchema = z.object({
  targetType: z.enum(['CUSTOMER', 'PRODUCT']),
  targetName: z.string().min(1),
  action: z.string().min(1),
  reason: z.string().min(1),
});

export const insightPayloadSchema = z.object({
  summary: z.string().min(1),
  risks: z.array(z.string().min(1)),
  opportunities: z.array(z.string().min(1)),
  actionItems: z.array(insightActionItemSchema).min(1).max(3),
});

// ============================================
// Type Exports (inferred from schemas)
// ============================================

export type IndonesianPhone = z.infer<typeof indonesianPhoneSchema>;
export type InsightActionItemInput = z.infer<typeof insightActionItemSchema>;
export type InsightPayloadInput = z.infer<typeof insightPayloadSchema>;
