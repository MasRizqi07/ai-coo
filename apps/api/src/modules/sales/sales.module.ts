import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { CreateSaleUseCase } from './application/use-cases/create-sale.use-case';
import { GetSalesUseCase } from './application/use-cases/get-sales.use-case';
import { SALE_REPOSITORY } from './domain/repositories/sale.repository.interface';
import { PrismaSaleRepository } from './infrastructure/repositories/prisma-sale.repository';

@Module({
  controllers: [SalesController],
  providers: [
    CreateSaleUseCase,
    GetSalesUseCase,
    {
      provide: SALE_REPOSITORY,
      useClass: PrismaSaleRepository,
    },
  ],
  exports: [SALE_REPOSITORY],
})
export class SalesModule {}
