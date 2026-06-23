import { Injectable, Inject } from '@nestjs/common';
import { Customer } from '../../domain/entities/customer.entity';
import {
  ICustomerRepository,
  CUSTOMER_REPOSITORY,
} from '../../domain/repositories/customer.repository.interface';

@Injectable()
export class GetCustomersUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }
}
