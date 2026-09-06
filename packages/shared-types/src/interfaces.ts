/**
 * Standard API success response envelope.
 * Every successful response follows this shape (spec §10.1).
 */
export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
}

/**
 * Pagination and metadata for list responses.
 */
export interface ApiMeta {
  /** Cursor for the next page, null if no more pages */
  nextCursor: string | null;
  /** Total count (only included when cheap to compute) */
  total?: number;
}

import { PaymentMethod, BusinessType, Role } from './enums';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalSpent: number;
  lastPurchaseAt?: Date;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  sku?: string | null;
  category?: string | null;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string | null;
  quantity: number;
  priceAtSale: number;
  product?: {
    name: string;
  };
}

export interface Sale {
  id: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paidAmount?: number | null;
  changeAmount?: number | null;
  notes?: string | null;
  date: Date;
  customerId?: string | null;
  customer?: Customer | null;
  items?: SaleItem[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyId: string;
  company: {
    id: string;
    name: string;
    businessType: BusinessType;
    phone?: string | null;
    address?: string | null;
  };
}

export interface DailyRevenuePoint {
  date: string; // YYYY-MM-DD
  displayDate: string; // e.g. "Senin, 01"
  revenue: number;
  salesCount: number;
}

export interface DashboardChartsResponse {
  revenueTrend: DailyRevenuePoint[];
  totalWeekRevenue: number;
  revenueChangePct: number;
}

/**
 * Standard API error response envelope.
 * Every error response follows this shape (spec §10.1).
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * AI Insight action item.
 * Each action must reference a real entity (spec §6.7).
 */
export interface InsightActionItem {
  targetType: 'CUSTOMER' | 'PRODUCT' | 'INVENTORY' | 'OTHER';
  targetName: string;
  action: string;
  reason: string;
  whatsappMessage?: string;
}

/**
 * AI Insight payload structure.
 * This is the JSON schema the AI must produce (spec §9.3).
 */
export interface InsightPayload {
  summary: string;
  risks: string[];
  opportunities: string[];
  actionItems: InsightActionItem[];
}

