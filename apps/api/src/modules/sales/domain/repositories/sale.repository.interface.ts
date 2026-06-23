import { Sale } from '../entities/sale.entity';

export interface ISaleRepository {
  save(sale: Sale): Promise<void>;
  findAll(): Promise<Sale[]>;
  findById(id: string): Promise<Sale | null>;
}

export const SALE_REPOSITORY = Symbol('SALE_REPOSITORY');
