import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  IProductRepository,
} from '../../domain/repositories/product.repository.interface';
import { TenantContext } from '../../../../common/context/tenant-context';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string, companyId?: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    const cid = TenantContext.getCompanyId() || companyId;

    if (!product || (cid && product.companyId !== cid)) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.delete(id);
  }
}
