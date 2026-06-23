import { Entity } from '../../../../common/domain/entity';
import { SaleItem } from './sale-item.entity';

export interface SaleProps {
  companyId: string;
  customerId: string | null;
  amount: number;
  items: SaleItem[];
  date?: Date;
  createdAt?: Date;
  customer?: { id: string; name: string } | null;
}

export class Sale extends Entity<SaleProps> {
  private constructor(props: SaleProps, id?: string) {
    super(props, id);
  }

  public static create(props: SaleProps, id?: string): Sale {
    if (!props.companyId) {
      throw new Error('Sale must belong to a company (tenant)');
    }
    if (props.amount < 0) {
      throw new Error('Sale amount cannot be negative');
    }
    return new Sale(
      {
        ...props,
        date: props.date ?? new Date(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  public get companyId(): string {
    return this.props.companyId;
  }

  public get customerId(): string | null {
    return this.props.customerId;
  }

  public get amount(): number {
    return this.props.amount;
  }

  public get items(): SaleItem[] {
    return this.props.items;
  }

  public get date(): Date {
    return this.props.date || new Date();
  }
}
