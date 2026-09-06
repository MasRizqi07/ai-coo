import { PaymentMethod } from '../enums';

export * from './auth.dto';

export interface CreateCustomerDto {
  name: string;
  phone?: string;
  email?: string;
}

export interface CreateProductDto {
  name: string;
  sku?: string;
  category?: string;
  price: number;
  stockQuantity: number;
  minStockLevel?: number;
}

export interface RestockProductDto {
  quantity: number;
}

export interface CreateSaleDto {
  customerId?: string | null;
  paymentMethod?: PaymentMethod;
  paidAmount?: number;
  changeAmount?: number;
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface UpdateCompanyDto {
  name?: string;
  phone?: string;
  address?: string;
}

