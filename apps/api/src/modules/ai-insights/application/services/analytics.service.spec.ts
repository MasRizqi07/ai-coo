import { AnalyticsService, AnalyticsInput } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    service = new AnalyticsService();
  });

  it('should correctly aggregate metrics', () => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

    const mockData: AnalyticsInput = {
      customers: [
        {
          id: 'c1',
          name: 'Customer A',
          totalSpent: '100000',
          lastPurchaseAt: tenDaysAgo.toISOString(),
        },
        {
          id: 'c2',
          name: 'Customer B',
          totalSpent: '250000',
          lastPurchaseAt: fifteenDaysAgo.toISOString(),
        },
      ],
      products: [
        { id: 'p1', name: 'Product 1', price: 10000, stockQuantity: 5 },
        { id: 'p2', name: 'Product 2', price: 20000, stockQuantity: 20 },
      ],
      sales: [
        // Current period sale (last 7 days)
        {
          id: 's1',
          date: threeDaysAgo.toISOString(),
          amount: '100000',
          items: [{ productId: 'p1', quantity: 2, priceAtSale: 10000 }],
        },
        // Previous period sale (7-14 days ago)
        {
          id: 's2',
          date: tenDaysAgo.toISOString(),
          amount: '50000',
          items: [{ productId: 'p2', quantity: 1, priceAtSale: 20000 }],
        },
      ],
    };

    const metrics = service.aggregate(mockData);

    // 1. Revenue Trend
    expect(metrics.revenueTrend.currentPeriodRevenue).toBe(100000);
    expect(metrics.revenueTrend.previousPeriodRevenue).toBe(50000);
    expect(metrics.revenueTrend.percentageChange).toBe(100);

    // 2. Top Customer
    expect(metrics.topCustomer).toEqual({
      name: 'Customer B',
      totalSpent: 250000,
    });

    // 3. At Risk Customers (no purchase in 14+ days)
    expect(metrics.atRiskCustomers.length).toBe(1);
    expect(metrics.atRiskCustomers[0].name).toBe('Customer B');
    expect(metrics.atRiskCustomers[0].daysSinceLastPurchase).toBe(15);

    // 4. Low Stock Products (< 15)
    expect(metrics.lowStockProducts.length).toBe(1);
    expect(metrics.lowStockProducts[0].name).toBe('Product 1');
    expect(metrics.lowStockProducts[0].stockQuantity).toBe(5);

    // 5. Fastest Moving Product (highest qty in 30 days)
    expect(metrics.fastestMovingProduct).toEqual({
      name: 'Product 1',
      quantitySold: 2,
    });
  });
});
