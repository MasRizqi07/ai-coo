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
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { RestockProductUseCase } from './application/use-cases/restock-product.use-case';
import { CreateProductDto, RestockProductDto } from '@ai-coo/shared-types';
import { createProductSchema, restockProductSchema } from '@ai-coo/validation';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';

import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';

@Controller('products')
@UseInterceptors(TenantInterceptor)
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly restockProductUseCase: RestockProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async create(@Body() dto: CreateProductDto) {
    const product = await this.createProductUseCase.execute({ dto });

    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price.amount,
      stockQuantity: product.stockQuantity,
      minStockLevel: product.minStockLevel,
    };
  }

  @Get()
  async findAll() {
    const products = await this.getProductsUseCase.execute();

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category || 'Umum',
      price: p.price.amount,
      stockQuantity: p.stockQuantity,
      minStockLevel: p.minStockLevel || 10,
      createdAt: p.props.createdAt,
    }));
  }

  @Post(':id/restock')
  @UsePipes(new ZodValidationPipe(restockProductSchema))
  async restock(@Param('id') id: string, @Body() dto: RestockProductDto) {
    const product = await this.restockProductUseCase.execute({ productId: id, dto });

    return {
      id: product.id,
      name: product.name,
      stockQuantity: product.stockQuantity,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteProductUseCase.execute(id);
    return { success: true };
  }
}
