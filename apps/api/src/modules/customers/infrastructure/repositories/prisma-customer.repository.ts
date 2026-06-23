import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { Customer } from '../../domain/entities/customer.entity';
import { IndonesianPhone } from '../../../../common/domain/value-objects/indonesian-phone.vo';
import { Money } from '../../../../common/domain/value-objects/money.vo';
import { TenantContext } from '../../../../common/context/tenant-context';

@Injectable()
export class PrismaCustomerRepository implements ICustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get companyId(): string {
    const companyId = TenantContext.getCompanyId();
    if (!companyId) {
      throw new Error('Tenant context missing from database query');
    }
    return companyId;
  }

  private mapToDomain(record: any): Customer {
    return Customer.create(
      {
        companyId: record.companyId,
        name: record.name,
        phone: record.phone ? IndonesianPhone.create(record.phone) : undefined,
        email: record.email,
        totalSpent: Money.create(Number(record.totalSpent)),
        lastPurchaseAt: record.lastPurchaseAt,
        deletedAt: record.deletedAt,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      record.id,
    );
  }

  async save(customer: Customer): Promise<void> {
    // Assert companyId matches current tenant context
    if (customer.companyId !== this.companyId) {
      throw new Error('Tenant mismatch in customer save');
    }

    await this.prisma.customer.upsert({
      where: { id: customer.id },
      update: {
        name: customer.name,
        phone: customer.phone?.value,
        email: customer.props.email,
        totalSpent: customer.totalSpent.amount,
        lastPurchaseAt: customer.props.lastPurchaseAt,
        deletedAt: customer.deletedAt,
        updatedAt: customer.props.updatedAt,
      },
      create: {
        id: customer.id,
        companyId: customer.companyId,
        name: customer.name,
        phone: customer.phone?.value,
        email: customer.props.email,
        totalSpent: customer.totalSpent.amount,
        deletedAt: customer.deletedAt,
        createdAt: customer.props.createdAt,
        updatedAt: customer.props.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Customer | null> {
    const record = await this.prisma.customer.findFirst({
      where: { id, companyId: this.companyId, deletedAt: null },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findAll(): Promise<Customer[]> {
    const records = await this.prisma.customer.findMany({
      where: { companyId: this.companyId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.mapToDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.updateMany({
      where: { id, companyId: this.companyId },
      data: { deletedAt: new Date() },
    });
  }
}
