import { Product } from './product.entity';
import { Money } from '../../../../common/domain/value-objects/money.vo';

describe('Product Entity', () => {
  it('should create a valid product', () => {
    const product = Product.create({
      companyId: 'tenant-1',
      name: 'Kopi Susu Gula Aren',
      price: Money.create(15000),
      stockQuantity: 50,
    });

    expect(product.name).toBe('Kopi Susu Gula Aren');
    expect(product.stockQuantity).toBe(50);
    expect(product.price.amount).toBe(15000);
  });

  it('should allow restocking', () => {
    const product = Product.create({
      companyId: 'tenant-1',
      name: 'Indomie Goreng',
      price: Money.create(3000),
      stockQuantity: 10,
    });

    product.restock(20);
    expect(product.stockQuantity).toBe(30);
  });

  it('should allow consuming stock', () => {
    const product = Product.create({
      companyId: 'tenant-1',
      name: 'Rokok Surya',
      price: Money.create(25000),
      stockQuantity: 5,
    });

    product.consumeStock(2);
    expect(product.stockQuantity).toBe(3);
  });

  it('should throw error when consuming more than available stock', () => {
    const product = Product.create({
      companyId: 'tenant-1',
      name: 'Es Teh',
      price: Money.create(5000),
      stockQuantity: 1,
    });

    expect(() => {
      product.consumeStock(2);
    }).toThrow('Insufficient stock');
  });

  it('should throw error if name is missing', () => {
    expect(() => {
      Product.create({
        companyId: 'tenant-1',
        name: '',
        price: Money.create(100),
        stockQuantity: 0,
      });
    }).toThrow('Product name is required');
  });
});
