import { Customer } from './customer.entity';
import { Money } from '../../../../common/domain/value-objects/money.vo';
import { IndonesianPhone } from '../../../../common/domain/value-objects/indonesian-phone.vo';

describe('Customer Entity', () => {
  it('should create a valid customer', () => {
    const customer = Customer.create({
      companyId: 'tenant-1',
      name: 'Budi Santoso',
      phone: IndonesianPhone.create('081234567890'),
    });

    expect(customer.name).toBe('Budi Santoso');
    expect(customer.companyId).toBe('tenant-1');
    expect(customer.totalSpent.amount).toBe(0);
    expect(customer.phone?.value).toBe('6281234567890');
  });

  it('should throw an error if name is empty', () => {
    expect(() => {
      Customer.create({
        companyId: 'tenant-1',
        name: '   ',
      });
    }).toThrow('Customer name is required');
  });

  it('should record a purchase correctly', () => {
    const customer = Customer.create({
      companyId: 'tenant-1',
      name: 'Budi Santoso',
    });

    customer.recordPurchase(Money.create(50000));
    expect(customer.totalSpent.amount).toBe(50000);
    expect(customer.props.lastPurchaseAt).toBeDefined();

    customer.recordPurchase(Money.create(25000));
    expect(customer.totalSpent.amount).toBe(75000);
  });

  it('should throw error when recording a negative purchase', () => {
    const customer = Customer.create({
      companyId: 'tenant-1',
      name: 'Budi',
    });

    expect(() => {
      customer.recordPurchase(Money.create(-1000));
    }).toThrow();
  });
});
