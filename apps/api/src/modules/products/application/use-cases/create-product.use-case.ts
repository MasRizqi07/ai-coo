import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository.interface';
import { CreateProductDto } from '@ai-coo/shared-types';
import { Money } from '../../../../common/domain/value-objects/money.vo';
import { TenantContext } from '../../../../common/context/tenant-context';

export interface CreateProductCommand {
  companyId?: string;
  dto: CreateProductDto;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const companyId = TenantContext.getCompanyId() || command.companyId;
    if (!companyId) {
      throw new Error('Tenant context missing from create product');
    }

    const product = Product.create({
      companyId,
      name: command.dto.name,
      sku: command.dto.sku,
      category: command.dto.category,
      minStockLevel: command.dto.minStockLevel,
      price: Money.create(command.dto.price),
      stockQuantity: command.dto.stockQuantity,
    });

    await this.productRepository.save(product);
    return product;
  }
}
