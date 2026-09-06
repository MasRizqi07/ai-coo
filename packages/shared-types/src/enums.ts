/**
 * Business type enum matching Prisma schema.
 * Represents the type of Indonesian UMKM business.
 */
export enum BusinessType {
  WARKOP = 'WARKOP',
  TOKO_BANGUNAN = 'TOKO_BANGUNAN',
  LAUNDRY = 'LAUNDRY',
  BENGKEL = 'BENGKEL',
  RETAIL = 'RETAIL',
  DISTRIBUTOR = 'DISTRIBUTOR',
  OTHER = 'OTHER',
}

/**
 * User role enum for RBAC.
 * Owner: full access.
 * Staff: no AI Insights, no financial data.
 */
export enum Role {
  OWNER = 'OWNER',
  STAFF = 'STAFF',
}

/**
 * AI Insight type enum.
 * Each insight type corresponds to a section of the daily brief.
 */
export enum InsightType {
  SALES = 'SALES',
  INVENTORY = 'INVENTORY',
  REVENUE = 'REVENUE',
  DAILY_BRIEF = 'DAILY_BRIEF',
}

/**
 * Payment method for transactions.
 */
export enum PaymentMethod {
  CASH = 'CASH',
  QRIS = 'QRIS',
  TRANSFER = 'TRANSFER',
  KASBON = 'KASBON',
}

