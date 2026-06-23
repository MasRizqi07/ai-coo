import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(companyId: string): Promise<any> {
    // 1. Get total revenue from customers
    const totalRevenueResult = await this.prisma.customer.aggregate({
      where: { companyId },
      _sum: { totalSpent: true },
    });

    // 2. Get active customers (count all for now)
    const activeCustomersCount = await this.prisma.customer.count({
      where: { companyId },
    });

    // 3. Get products in stock
    const productsInStockResult = await this.prisma.product.aggregate({
      where: { companyId },
      _sum: { stockQuantity: true },
    });

    // 4. Low stock alerts (arbitrary threshold < 15 for demo)
    const lowStockCount = await this.prisma.product.count({
      where: {
        companyId,
        stockQuantity: { lt: 15 },
      },
    });

    // Format output
    return {
      totalRevenue: totalRevenueResult._sum.totalSpent || 0,
      activeCustomers: activeCustomersCount,
      productsInStock: productsInStockResult._sum.stockQuantity || 0,
      lowStockAlerts: lowStockCount,
    };
  }
}
