import { Controller, Get, Post, Body, UseInterceptors } from '@nestjs/common';
import { CreateSaleUseCase } from './application/use-cases/create-sale.use-case';
import { GetSalesUseCase } from './application/use-cases/get-sales.use-case';
import { CreateSaleDto } from './dto/create-sale.dto';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Sales')
@ApiBearerAuth()
@UseInterceptors(TenantInterceptor)
@Controller('sales')
export class SalesController {
  constructor(
    private readonly createSaleUseCase: CreateSaleUseCase,
    private readonly getSalesUseCase: GetSalesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale transaction' })
  @ApiResponse({ status: 201, description: 'Sale created successfully.' })
  async create(@Body() createSaleDto: CreateSaleDto): Promise<any> {
    const sale = await this.createSaleUseCase.execute({ dto: createSaleDto });
    return {
      id: sale.id,
      amount: sale.amount,
      date: sale.date,
      customerId: sale.customerId,
      customer: sale.props.customer,
      items: sale.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtSale: item.priceAtSale,
      })),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all sales for the company' })
  async findAll(): Promise<any[]> {
    const sales = await this.getSalesUseCase.execute();
    return sales.map((sale) => ({
      id: sale.id,
      amount: sale.amount,
      date: sale.date,
      customerId: sale.customerId,
      customer: sale.props.customer,
      items: sale.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtSale: item.priceAtSale,
      })),
    }));
  }
}
