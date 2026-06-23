import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Req,
  UseInterceptors,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { RestockProductUseCase } from './application/use-cases/restock-product.use-case';
import { CreateProductDto, RestockProductDto } from '@ai-coo/shared-types';
import { createProductSchema, restockProductSchema } from '@ai-coo/validation';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';

@Controller('products')
@UseGuards(JwtAuthGuard)
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
      price: product.price.amount,
      stockQuantity: product.stockQuantity,
    };
  }

  @Get()
  async findAll() {
    const products = await this.getProductsUseCase.execute();

    return products.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price.amount,
      stockQuantity: p.stockQuantity,
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
