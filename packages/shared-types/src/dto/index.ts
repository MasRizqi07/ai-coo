export * from './auth.dto';

export interface CreateCustomerDto {
  name: string;
  phone?: string;
  email?: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
  stockQuantity: number;
}

export interface RestockProductDto {
  quantity: number;
}
