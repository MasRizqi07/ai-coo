import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { GetCustomersUseCase } from './application/use-cases/get-customers.use-case';
import { CreateCustomerDto } from '@ai-coo/shared-types';
import { createCustomerSchema } from '@ai-coo/validation';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';

import { DeleteCustomerUseCase } from './application/use-cases/delete-customer.use-case';

@Controller('customers')
@UseInterceptors(TenantInterceptor)
export class CustomersController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomersUseCase: GetCustomersUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createCustomerSchema))
  async create(@Body() dto: CreateCustomerDto) {
    const customer = await this.createCustomerUseCase.execute({ dto });

    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone?.value,
      totalSpent: customer.totalSpent.amount,
    };
  }

  @Get()
  async findAll() {
    const customers = await this.getCustomersUseCase.execute();

    return customers.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone?.value,
      totalSpent: c.totalSpent.amount,
      createdAt: c.props.createdAt,
    }));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteCustomerUseCase.execute(id);
    return { success: true };
  }
}
