import { Injectable } from '@nestjs/common';

export interface AnalyticsInput {
  sales: any[];
  products: any[];
  customers: any[];
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

@Injectable()
export class AnalyticsService {
  aggregate(data: AnalyticsInput): AggregatedMetrics {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Revenue Trend (last 7 days vs 7 days before that)
    const curPeriodSales = data.sales.filter((s) => new Date(s.date) >= sevenDaysAgo);
    const prevPeriodSales = data.sales.filter((s) => {
      const d = new Date(s.date);
      return d < sevenDaysAgo && d >= new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
    });

    const curRevenue = curPeriodSales.reduce((sum, s) => sum + Number(s.amount), 0);
    const prevRevenue = prevPeriodSales.reduce((sum, s) => sum + Number(s.amount), 0);
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
        (a, b) => Number(b.totalSpent) - Number(a.totalSpent),
      );
      if (sortedCustomers[0] && Number(sortedCustomers[0].totalSpent) > 0) {
        topCustomer = {
          name: sortedCustomers[0].name,
          totalSpent: Number(sortedCustomers[0].totalSpent),
        };
      }
    }

    // 3. At Risk Customers (no purchase in 14+ days)
    const atRiskCustomers = data.customers
      .filter((c) => {
        if (!c.lastPurchaseAt) return false;
        const lastP = new Date(c.lastPurchaseAt);
        return lastP < fourteenDaysAgo;
      })
      .map((c) => {
        const lastP = new Date(c.lastPurchaseAt);
        const diffTime = Math.abs(now.getTime() - lastP.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
          name: c.name,
          daysSinceLastPurchase: diffDays,
        };
      });

    // 4. Low Stock Products (< 15 units)
    const lowStockProducts = data.products
      .filter((p) => p.stockQuantity < 15)
      .map((p) => ({
        name: p.name,
        stockQuantity: p.stockQuantity,
      }));

    // 5. Fastest Moving Product (highest quantity sold in last 30 days)
    const productSalesCount: Record<string, { name: string; quantitySold: number }> = {};
    const recent30DaysSales = data.sales.filter((s) => new Date(s.date) >= thirtyDaysAgo);

    for (const sale of recent30DaysSales) {
      for (const item of sale.items || []) {
        if (!item.productId) continue;
        const product = data.products.find((p) => p.id === item.productId);
        const name = product ? product.name : 'Unknown Product';
        if (!productSalesCount[item.productId]) {
          productSalesCount[item.productId] = { name, quantitySold: 0 };
        }
        productSalesCount[item.productId].quantitySold += item.quantity;
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
