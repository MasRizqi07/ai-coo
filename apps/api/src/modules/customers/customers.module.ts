import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { GetCustomersUseCase } from './application/use-cases/get-customers.use-case';
import { DeleteCustomerUseCase } from './application/use-cases/delete-customer.use-case';
import { CUSTOMER_REPOSITORY } from './domain/repositories/customer.repository.interface';
import { PrismaCustomerRepository } from './infrastructure/repositories/prisma-customer.repository';

@Module({
  controllers: [CustomersController],
  providers: [
    CreateCustomerUseCase,
    GetCustomersUseCase,
    DeleteCustomerUseCase,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: PrismaCustomerRepository,
    },
  ],
  exports: [CUSTOMER_REPOSITORY],
})
export class CustomersModule {}
