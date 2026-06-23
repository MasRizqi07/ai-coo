import { z } from 'zod';
import { BusinessType } from '@ai-coo/shared-types';

export const registerSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100),
  businessType: z.nativeEnum(BusinessType, {
    errorMap: () => ({ message: 'Invalid business type' }),
  }),
  userName: z.string().min(1, 'User name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
