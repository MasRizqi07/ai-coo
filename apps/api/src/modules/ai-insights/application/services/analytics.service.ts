import { Injectable } from '@nestjs/common';
import { Money } from '../../../../common/domain/value-objects/money.vo';

export interface AnalyticsCustomer {
  id?: string;
  name: string;
  totalSpent: number | string | Money;
  lastPurchaseAt?: Date | string | null;
}

export interface AnalyticsProduct {
  id: string;
  name: string;
  price?: number | Money;
  stockQuantity: number;
  minStockLevel?: number | null;
}

export interface AnalyticsSaleItem {
  productId?: string | null;
  quantity: number;
  priceAtSale?: number;
}

export interface AnalyticsSale {
  id?: string;
  date: Date | string;
  amount: number | string | Money;
  items?: AnalyticsSaleItem[];
}

export interface AnalyticsInput {
  sales: AnalyticsSale[];
  products: AnalyticsProduct[];
  customers: AnalyticsCustomer[];
}

export interface AggregatedMetrics {
  revenueTrend: {
    currentPeriodRevenue: number;
    previousPeriodRevenue: number;
    percentageChange: number;
  };
  topCustomer: {
    name: string;
    totalSpent: number;
  } | null;
  atRiskCustomers: Array<{
    name: string;
    daysSinceLastPurchase: number;
  }>;
  lowStockProducts: Array<{
    name: string;
    stockQuantity: number;
  }>;
  fastestMovingProduct: {
    name: string;
    quantitySold: number;
  } | null;
}

function parseNumber(value: number | string | Money | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  if (typeof value === 'object' && 'amount' in value && typeof value.amount === 'number') {
    return value.amount;
  }
  return 0;
}

function parseDate(value: Date | string | null | undefined): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  return new Date(0);
}

@Injectable()
export class AnalyticsService {
  aggregate(data: AnalyticsInput): AggregatedMetrics {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Revenue Trend (last 7 days vs 7 days before that)
    const curPeriodSales = data.sales.filter((s) => parseDate(s.date) >= sevenDaysAgo);
    const prevPeriodSales = data.sales.filter((s) => {
      const d = parseDate(s.date);
      return d < sevenDaysAgo && d >= new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
    });

    const curRevenue = curPeriodSales.reduce((sum, s) => sum + parseNumber(s.amount), 0);
    const prevRevenue = prevPeriodSales.reduce((sum, s) => sum + parseNumber(s.amount), 0);
    let pctChange = 0;
    if (prevRevenue > 0) {
      pctChange = ((curRevenue - prevRevenue) / prevRevenue) * 100;
    } else if (curRevenue > 0) {
      pctChange = 100; // 100% increase from 0
    }

    // 2. Top Customer
    let topCustomer: { name: string; totalSpent: number } | null = null;
    if (data.customers.length > 0) {
      const sortedCustomers = [...data.customers].sort(
        (a, b) => parseNumber(b.totalSpent) - parseNumber(a.totalSpent),
      );
      const top = sortedCustomers[0];
      if (top && parseNumber(top.totalSpent) > 0) {
        topCustomer = {
          name: top.name,
          totalSpent: parseNumber(top.totalSpent),
        };
      }
    }

    // 3. At Risk Customers (no purchase in 14+ days)
    const atRiskCustomers = data.customers
      .filter((c) => {
        if (!c.lastPurchaseAt) return false;
        const lastP = parseDate(c.lastPurchaseAt);
        return lastP < fourteenDaysAgo;
      })
      .map((c) => {
        const lastP = parseDate(c.lastPurchaseAt);
        const diffTime = Math.abs(now.getTime() - lastP.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
          name: c.name,
          daysSinceLastPurchase: diffDays,
        };
      });

    // 4. Low Stock Products (stock < minStockLevel or < 15)
    const lowStockProducts = data.products
      .filter((p) => p.stockQuantity < (p.minStockLevel ?? 15))
      .map((p) => ({
        name: p.name,
        stockQuantity: p.stockQuantity,
      }));

    // 5. Fastest Moving Product (highest quantity sold in last 30 days)
    const productSalesCount: Record<string, { name: string; quantitySold: number }> = {};
    const recent30DaysSales = data.sales.filter((s) => parseDate(s.date) >= thirtyDaysAgo);

    for (const sale of recent30DaysSales) {
      for (const item of sale.items || []) {
        if (!item.productId) continue;
        const product = data.products.find((p) => p.id === item.productId);
        const name = product ? product.name : 'Unknown Product';
        const existing = productSalesCount[item.productId];
        if (!existing) {
          productSalesCount[item.productId] = { name, quantitySold: item.quantity };
        } else {
          existing.quantitySold += item.quantity;
        }
      }
    }

    const fastestMovingProducts = Object.values(productSalesCount).sort(
      (a, b) => b.quantitySold - a.quantitySold,
    );
    const fastestMoving = fastestMovingProducts[0] || null;

    return {
      revenueTrend: {
        currentPeriodRevenue: curRevenue,
        previousPeriodRevenue: prevRevenue,
        percentageChange: Math.round(pctChange * 100) / 100,
      },
      topCustomer,
      atRiskCustomers: atRiskCustomers.slice(0, 5),
      lowStockProducts,
      fastestMovingProduct: fastestMoving,
    };
  }
}
