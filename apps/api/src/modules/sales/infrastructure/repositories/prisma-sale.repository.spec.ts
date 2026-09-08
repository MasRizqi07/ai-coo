import { PrismaSaleRepository } from './prisma-sale.repository';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { Sale } from '../../domain/entities/sale.entity';
import { SaleItem } from '../../domain/entities/sale-item.entity';
import { PaymentMethod } from '@ai-coo/shared-types';
import { TenantContext } from '../../../../common/context/tenant-context';
import { BadRequestException } from '@nestjs/common';

describe('PrismaSaleRepository', () => {
  let repository: PrismaSaleRepository;
  let mockPrisma: any;
  let mockTx: any;

  beforeEach(() => {
    mockTx = {
      product: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      sale: {
        create: jest.fn(),
      },
      customer: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    mockPrisma = {
      $transaction: jest.fn(async (cb: (tx: any) => Promise<any>) => cb(mockTx)),
      sale: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    repository = new PrismaSaleRepository(mockPrisma as PrismaService);
  });

  describe('save() within transaction', () => {
    it('should deduct stock and increment customer totalSpent inside atomic transaction', async () => {
      const item1 = SaleItem.create({
        productId: 'prod-1',
        quantity: 2,
        priceAtSale: 20000,
      });

      const sale = Sale.create({
        companyId: 'tenant-100',
        customerId: 'cust-100',
        amount: 40000,
        paymentMethod: PaymentMethod.CASH,
        items: [item1],
      });

      // Product has 10 stock available
      mockTx.product.findFirst.mockResolvedValue({
        id: 'prod-1',
        name: 'Kopi Tubruk',
        price: '20000',
        stockQuantity: 10,
        companyId: 'tenant-100',
      });

      // Customer exists
      mockTx.customer.findFirst.mockResolvedValue({
        id: 'cust-100',
        name: 'Pak Bambang',
        companyId: 'tenant-100',
      });

      mockTx.sale.create.mockResolvedValue({ id: sale.id });
      mockTx.product.update.mockResolvedValue({});
      mockTx.customer.update.mockResolvedValue({});

      await TenantContext.run('tenant-100', async () => {
        await repository.save(sale);
      });

      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);

      // Verify product lookup and stock decrement
      expect(mockTx.product.findFirst).toHaveBeenCalledWith({
        where: { id: 'prod-1', companyId: 'tenant-100', deletedAt: null },
      });
      expect(mockTx.product.update).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        data: { stockQuantity: { decrement: 2 } },
      });

      // Verify sale creation
      expect(mockTx.sale.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            companyId: 'tenant-100',
            customerId: 'cust-100',
            amount: 40000,
            paymentMethod: PaymentMethod.CASH,
          }),
        }),
      );

      // Verify customer total spent increment
      expect(mockTx.customer.update).toHaveBeenCalledWith({
        where: { id: 'cust-100' },
        data: expect.objectContaining({
          totalSpent: { increment: 40000 },
        }),
      });
    });

    it('should throw BadRequestException and abort when stock is insufficient', async () => {
      const item = SaleItem.create({
        productId: 'prod-1',
        quantity: 15,
        priceAtSale: 20000,
      });

      const sale = Sale.create({
        companyId: 'tenant-100',
        customerId: null,
        amount: 300000,
        items: [item],
      });

      // Only 5 in stock, but requested 15
      mockTx.product.findFirst.mockResolvedValue({
        id: 'prod-1',
        name: 'Kopi Arabika',
        price: '20000',
        stockQuantity: 5,
        companyId: 'tenant-100',
      });

      await expect(
        TenantContext.run('tenant-100', async () => {
          await repository.save(sale);
        }),
      ).rejects.toThrow(BadRequestException);

      expect(mockTx.product.update).not.toHaveBeenCalled();
      expect(mockTx.sale.create).not.toHaveBeenCalled();
    });

    it('should throw error when tenant mismatch occurs', async () => {
      const sale = Sale.create({
        companyId: 'tenant-evil',
        customerId: null,
        amount: 50000,
        items: [],
      });

      await expect(
        TenantContext.run('tenant-good', async () => {
          await repository.save(sale);
        }),
      ).rejects.toThrow('Tenant mismatch in sale save');
    });
  });
});
