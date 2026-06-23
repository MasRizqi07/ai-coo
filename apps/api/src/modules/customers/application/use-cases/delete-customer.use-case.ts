import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from '../../domain/repositories/customer.repository.interface';
import { TenantContext } from '../../../../common/context/tenant-context';

@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(id: string, companyId?: string): Promise<void> {
    const customer = await this.customerRepository.findById(id);
    const cid = TenantContext.getCompanyId() || companyId;

    if (!customer || (cid && customer.companyId !== cid)) {
      throw new NotFoundException('Customer not found');
    }
    await this.customerRepository.delete(id);
  }
}
