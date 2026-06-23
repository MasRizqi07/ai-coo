import { Injectable, Inject } from '@nestjs/common';
import { Sale } from '../../domain/entities/sale.entity';
import { SaleItem } from '../../domain/entities/sale-item.entity';
import {
  ISaleRepository,
  SALE_REPOSITORY,
} from '../../domain/repositories/sale.repository.interface';
import { CreateSaleDto } from '../../dto/create-sale.dto';
import { TenantContext } from '../../../../common/context/tenant-context';

export interface CreateSaleCommand {
  companyId?: string;
  dto: CreateSaleDto;
}

@Injectable()
export class CreateSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(command: CreateSaleCommand): Promise<Sale> {
    const companyId = TenantContext.getCompanyId() || command.companyId;
    if (!companyId) {
      throw new Error('Tenant context missing from create sale');
    }

    const saleItems = command.dto.items.map((item) =>
      SaleItem.create({
        productId: item.productId,
        quantity: item.quantity,
        priceAtSale: 0, // Calculated dynamically by the repository from product price
      }),
    );

    const sale = Sale.create({
      companyId,
      customerId: command.dto.customerId || null,
      amount: 0, // Calculated dynamically by the repository
      items: saleItems,
    });

    await this.saleRepository.save(sale);

    const savedSale = await this.saleRepository.findById(sale.id);
    if (!savedSale) {
      throw new Error('Failed to retrieve saved sale');
    }
    return savedSale;
  }
}
