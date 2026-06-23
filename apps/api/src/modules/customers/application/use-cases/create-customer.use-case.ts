import { Injectable, Inject } from '@nestjs/common';
import { Customer } from '../../domain/entities/customer.entity';
import {
  ICustomerRepository,
  CUSTOMER_REPOSITORY,
} from '../../domain/repositories/customer.repository.interface';
import { CreateCustomerDto } from '@ai-coo/shared-types';
import { IndonesianPhone } from '../../../../common/domain/value-objects/indonesian-phone.vo';
import { TenantContext } from '../../../../common/context/tenant-context';

export interface CreateCustomerCommand {
  companyId?: string;
  dto: CreateCustomerDto;
}

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(command: CreateCustomerCommand): Promise<Customer> {
    const companyId = TenantContext.getCompanyId() || command.companyId;
    if (!companyId) {
      throw new Error('Tenant context missing from create customer');
    }

    const customer = Customer.create({
      companyId,
      name: command.dto.name,
      email: command.dto.email,
      phone: command.dto.phone ? IndonesianPhone.create(command.dto.phone) : undefined,
    });

    await this.customerRepository.save(customer);
    return customer;
  }
}
