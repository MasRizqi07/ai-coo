import { Injectable, Inject } from '@nestjs/common';
import { Sale } from '../../domain/entities/sale.entity';
import {
  ISaleRepository,
  SALE_REPOSITORY,
} from '../../domain/repositories/sale.repository.interface';

@Injectable()
export class GetSalesUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(): Promise<Sale[]> {
    return this.saleRepository.findAll();
  }
}
