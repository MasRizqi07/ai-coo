import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { Money } from '../../../../common/domain/value-objects/money.vo';
import { TenantContext } from '../../../../common/context/tenant-context';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get companyId(): string {
    const companyId = TenantContext.getCompanyId();
    if (!companyId) {
      throw new Error('Tenant context missing from database query');
    }
    return companyId;
  }

  private mapToDomain(record: any): Product {
    return Product.create(
      {
        companyId: record.companyId,
        name: record.name,
        sku: record.sku,
        price: Money.create(Number(record.price)),
        stockQuantity: record.stockQuantity,
        deletedAt: record.deletedAt,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      record.id,
    );
  }

  async save(product: Product): Promise<void> {
    // Assert companyId matches current tenant context
    if (product.companyId !== this.companyId) {
      throw new Error('Tenant mismatch in product save');
    }

    await this.prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        sku: product.props.sku,
        price: product.price.amount,
        stockQuantity: product.stockQuantity,
        deletedAt: product.deletedAt,
        updatedAt: product.props.updatedAt,
      },
      create: {
        id: product.id,
        companyId: product.companyId,
        name: product.name,
        sku: product.props.sku,
        price: product.price.amount,
        stockQuantity: product.stockQuantity,
        deletedAt: product.deletedAt,
        createdAt: product.props.createdAt,
        updatedAt: product.props.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Product | null> {
    const record = await this.prisma.product.findFirst({
      where: { id, companyId: this.companyId, deletedAt: null },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findAll(): Promise<Product[]> {
    const records = await this.prisma.product.findMany({
      where: { companyId: this.companyId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.mapToDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.updateMany({
      where: { id, companyId: this.companyId },
      data: { deletedAt: new Date() },
    });
  }
}
