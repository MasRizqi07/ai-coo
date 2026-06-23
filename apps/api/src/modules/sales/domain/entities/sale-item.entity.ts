import { Entity } from '../../../../common/domain/entity';

export interface SaleItemProps {
  productId: string | null;
  quantity: number;
  priceAtSale: number;
}

export class SaleItem extends Entity<SaleItemProps> {
  private constructor(props: SaleItemProps, id?: string) {
    super(props, id);
  }

  public static create(props: SaleItemProps, id?: string): SaleItem {
    if (props.quantity <= 0) {
      throw new Error('SaleItem quantity must be positive');
    }
    if (props.priceAtSale < 0) {
      throw new Error('SaleItem price cannot be negative');
    }
    return new SaleItem(props, id);
  }

  public get productId(): string | null {
    return this.props.productId;
  }

  public get quantity(): number {
    return this.props.quantity;
  }

  public get priceAtSale(): number {
    return this.props.priceAtSale;
  }
}
