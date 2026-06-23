import { RestockProductUseCase } from './restock-product.use-case';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { Money } from '../../../../common/domain/value-objects/money.vo';
import { NotFoundException } from '@nestjs/common';

describe('RestockProductUseCase', () => {
  let useCase: RestockProductUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findAllByCompany: jest.fn(),
    };
    useCase = new RestockProductUseCase(mockRepository);
  });

  it('should restock an existing product', async () => {
    const product = Product.create({
      companyId: 'tenant-1',
      name: 'Indomie',
      price: Money.create(3000),
      stockQuantity: 10,
    });
    mockRepository.findById.mockResolvedValue(product);

    const dto = { quantity: 20 };
    const updatedProduct = await useCase.execute({ companyId: 'tenant-1', productId: '123', dto });

    expect(updatedProduct.stockQuantity).toBe(30);
    expect(mockRepository.save).toHaveBeenCalledWith(product);
  });

  it('should throw NotFoundException if product does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    const dto = { quantity: 20 };
    await expect(useCase.execute({ companyId: 'tenant-1', productId: '123', dto })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException if product belongs to another tenant', async () => {
    const product = Product.create({
      companyId: 'tenant-2',
      name: 'Indomie',
      price: Money.create(3000),
      stockQuantity: 10,
    });
    mockRepository.findById.mockResolvedValue(product);

    const dto = { quantity: 20 };
    await expect(useCase.execute({ companyId: 'tenant-1', productId: '123', dto })).rejects.toThrow(
      NotFoundException,
    );
  });
});
