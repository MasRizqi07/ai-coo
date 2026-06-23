import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { RestockProductUseCase } from './application/use-cases/restock-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository.interface';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';

@Module({
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    GetProductsUseCase,
    RestockProductUseCase,
    DeleteProductUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
