import { Sale } from './sale.entity';
import { SaleItem } from './sale-item.entity';
import { PaymentMethod } from '@ai-coo/shared-types';

describe('Sale Entity', () => {
  it('should create a valid sale entity', () => {
    const item = SaleItem.create({
      productId: 'prod-1',
      quantity: 2,
      priceAtSale: 15000,
    });

    const sale = Sale.create({
      companyId: 'tenant-1',
      customerId: 'cust-1',
      amount: 30000,
      paymentMethod: PaymentMethod.CASH,
      paidAmount: 50000,
      changeAmount: 20000,
      items: [item],
    });

    expect(sale.id).toBeDefined();
    expect(sale.companyId).toBe('tenant-1');
    expect(sale.customerId).toBe('cust-1');
    expect(sale.amount).toBe(30000);
    expect(sale.paymentMethod).toBe(PaymentMethod.CASH);
    expect(sale.paidAmount).toBe(50000);
    expect(sale.changeAmount).toBe(20000);
    expect(sale.items).toHaveLength(1);
    expect(sale.items[0].quantity).toBe(2);
  });

  it('should throw error if companyId is missing', () => {
    expect(() =>
      Sale.create({
        companyId: '',
        customerId: null,
        amount: 10000,
        items: [],
      }),
    ).toThrow('Sale must belong to a company (tenant)');
  });

  it('should throw error if amount is negative', () => {
    expect(() =>
      Sale.create({
        companyId: 'tenant-1',
        customerId: null,
        amount: -500,
        items: [],
      }),
    ).toThrow('Sale amount cannot be negative');
  });

  it('should throw error if SaleItem quantity is non-positive', () => {
    expect(() =>
      SaleItem.create({
        productId: 'prod-1',
        quantity: 0,
        priceAtSale: 10000,
      }),
    ).toThrow('SaleItem quantity must be positive');
  });
});
