import { Entity } from '../../../../common/domain/entity';
import { Money } from '../../../../common/domain/value-objects/money.vo';

export interface ProductProps {
  companyId: string;
  name: string;
  sku?: string;
  price: Money;
  stockQuantity: number;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product extends Entity<ProductProps> {
  private constructor(props: ProductProps, id?: string) {
    super(props, id);
  }

  public static create(props: ProductProps, id?: string): Product {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Product name is required');
    }
    if (!props.companyId) {
      throw new Error('Product must belong to a company (tenant)');
    }
    if (props.stockQuantity < 0) {
      throw new Error('Product stock cannot be negative');
    }

    return new Product(
      {
        ...props,
        deletedAt: props.deletedAt ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }

  public get companyId(): string {
    return this.props.companyId;
  }

  public get name(): string {
    return this.props.name;
  }

  public get stockQuantity(): number {
    return this.props.stockQuantity;
  }

  public get price(): Money {
    return this.props.price;
  }

  public get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  /**
   * Domain behavior: Soft delete the product
   */
  public softDelete(): void {
    this.props.deletedAt = new Date();
    this.props.updatedAt = new Date();
  }

  /**
   * Domain behavior: Restock the product
   */
  public restock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Restock quantity must be positive');
    }
    this.props.stockQuantity += quantity;
    this.props.updatedAt = new Date();
  }

  /**
   * Domain behavior: Consume stock (e.g. for a sale)
   */
  public consumeStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Consume quantity must be positive');
    }
    if (this.props.stockQuantity < quantity) {
      throw new Error('Insufficient stock');
    }
    this.props.stockQuantity -= quantity;
    this.props.updatedAt = new Date();
  }
}
