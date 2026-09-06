import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(companyId: string): Promise<any> {
    // 1. Get total revenue directly from sales (accurate for all transactions)
    const totalRevenueResult = await this.prisma.sale.aggregate({
      where: { companyId },
      _sum: { amount: true },
    });

    // 2. Get active customers count
    const activeCustomersCount = await this.prisma.customer.count({
      where: { companyId, deletedAt: null },
    });

    // 3. Get products in stock
    const productsInStockResult = await this.prisma.product.aggregate({
      where: { companyId, deletedAt: null },
      _sum: { stockQuantity: true },
    });

    // 4. Low stock alerts (< 15 units or <= minStockLevel)
    const lowStockCount = await this.prisma.product.count({
      where: {
        companyId,
        deletedAt: null,
        stockQuantity: { lt: 15 },
      },
    });

    // 5. Total transactions today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todaySalesCount = await this.prisma.sale.count({
      where: {
        companyId,
        date: { gte: startOfToday },
      },
    });

    return {
      totalRevenue: Number(totalRevenueResult._sum.amount || 0),
      activeCustomers: activeCustomersCount,
      productsInStock: productsInStockResult._sum.stockQuantity || 0,
      lowStockAlerts: lowStockCount,
      todaySalesCount,
    };
  }

  async getCharts(companyId: string): Promise<any> {
    const now = new Date();
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const dailyPoints: Array<{ date: string; displayDate: string; revenue: number; salesCount: number }> = [];

    // Generate date points for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = `${dayNames[d.getDay()]}, ${d.getDate()}`;
      dailyPoints.push({
        date: dateStr,
        displayDate: dayLabel,
        revenue: 0,
        salesCount: 0,
      });
    }

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const sales = await this.prisma.sale.findMany({
      where: {
        companyId,
        date: { gte: sevenDaysAgo },
      },
      select: {
        amount: true,
        date: true,
      },
    });

    for (const s of sales) {
      const sDate = new Date(s.date).toISOString().split('T')[0];
      const match = dailyPoints.find((p) => p.date === sDate);
      if (match) {
        match.revenue += Number(s.amount);
        match.salesCount += 1;
      }
    }

    const totalWeekRevenue = dailyPoints.reduce((sum, p) => sum + p.revenue, 0);

    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    fourteenDaysAgo.setHours(0, 0, 0, 0);
    const prevSales = await this.prisma.sale.aggregate({
      where: {
        companyId,
        date: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo,
        },
      },
      _sum: { amount: true },
    });

    const prevRevenue = Number(prevSales._sum.amount || 0);
    let revenueChangePct = 0;
    if (prevRevenue > 0) {
      revenueChangePct = Math.round(((totalWeekRevenue - prevRevenue) / prevRevenue) * 100);
    } else if (totalWeekRevenue > 0) {
      revenueChangePct = 100;
    }

    return {
      revenueTrend: dailyPoints,
      totalWeekRevenue,
      revenueChangePct,
    };
  }
}

