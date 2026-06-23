import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { ISaleRepository } from '../../domain/repositories/sale.repository.interface';
import { Sale } from '../../domain/entities/sale.entity';
import { SaleItem } from '../../domain/entities/sale-item.entity';
import { TenantContext } from '../../../../common/context/tenant-context';

@Injectable()
export class PrismaSaleRepository implements ISaleRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get companyId(): string {
    const companyId = TenantContext.getCompanyId();
    if (!companyId) {
      throw new Error('Tenant context missing from database query');
    }
    return companyId;
  }

  private mapToDomain(record: any): Sale {
    const items = (record.items || []).map((item: any) =>
      SaleItem.create(
        {
          productId: item.productId,
          quantity: item.quantity,
          priceAtSale: Number(item.priceAtSale),
        },
        item.id,
      ),
    );

    return Sale.create(
      {
        companyId: record.companyId,
        customerId: record.customerId,
        amount: Number(record.amount),
        items,
        date: record.date,
        createdAt: record.createdAt,
        customer: record.customer ? { id: record.customer.id, name: record.customer.name } : null,
      },
      record.id,
    );
  }

  async save(sale: Sale): Promise<void> {
    if (sale.companyId !== this.companyId) {
      throw new Error('Tenant mismatch in sale save');
    }

    await this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const saleItemsToCreate = [];

      for (const item of sale.items) {
        const product = await tx.product.findFirst({
          where: { id: item.productId || undefined, companyId: this.companyId, deletedAt: null },
        });

        if (!product) {
          throw new BadRequestException(`Product ${item.productId} not found or is inactive`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name}. Requested: ${item.quantity}, Available: ${product.stockQuantity}`,
          );
        }

        // Deduct stock
        await tx.product.update({
          where: { id: product.id },
          data: { stockQuantity: { decrement: item.quantity } },
        });

        const priceAtSale = item.priceAtSale || Number(product.price);
        totalAmount += priceAtSale * item.quantity;

        saleItemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtSale,
        });
      }

      // Create the sale
      await tx.sale.create({
        data: {
          id: sale.id,
          companyId: this.companyId,
          customerId: sale.customerId,
          amount: totalAmount,
          date: sale.date,
          createdAt: sale.props.createdAt,
          items: {
            create: saleItemsToCreate.map((sit) => ({
              productId: sit.productId,
              quantity: sit.quantity,
              priceAtSale: sit.priceAtSale,
            })),
          },
        },
      });

      // Update customer totalSpent if applicable
      if (sale.customerId) {
        const customer = await tx.customer.findFirst({
          where: { id: sale.customerId, companyId: this.companyId, deletedAt: null },
        });
        if (!customer) {
          throw new BadRequestException(`Customer ${sale.customerId} not found or is inactive`);
        }

        await tx.customer.update({
          where: { id: sale.customerId },
          data: {
            totalSpent: { increment: totalAmount },
            lastPurchaseAt: new Date(),
          },
        });
      }
    });
  }

  async findAll(): Promise<Sale[]> {
    const records = await this.prisma.sale.findMany({
      where: { companyId: this.companyId },
      orderBy: { date: 'desc' },
      include: {
        items: true,
        customer: true,
      },
    });
    return records.map((r) => this.mapToDomain(r));
  }

  async findById(id: string): Promise<Sale | null> {
    const record = await this.prisma.sale.findFirst({
      where: { id, companyId: this.companyId },
      include: {
        items: true,
        customer: true,
      },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }
}
