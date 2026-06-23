import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository.interface';
import { RestockProductDto } from '@ai-coo/shared-types';
import { TenantContext } from '../../../../common/context/tenant-context';

export interface RestockProductCommand {
  companyId?: string;
  productId: string;
  dto: RestockProductDto;
}

@Injectable()
export class RestockProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: RestockProductCommand): Promise<Product> {
    const product = await this.productRepository.findById(command.productId);
    const companyId = TenantContext.getCompanyId() || command.companyId;

    if (!product || (companyId && product.companyId !== companyId)) {
      throw new NotFoundException('Product not found');
    }

    product.restock(command.dto.quantity);
    await this.productRepository.save(product);

    return product;
  }
}
