import { Entity } from '../../../../common/domain/entity';
import { SaleItem } from './sale-item.entity';
import { PaymentMethod } from '@ai-coo/shared-types';

export interface SaleProps {
  companyId: string;
  customerId: string | null;
  amount: number;
  paymentMethod?: PaymentMethod;
  paidAmount?: number | null;
  changeAmount?: number | null;
  notes?: string | null;
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
        paymentMethod: props.paymentMethod ?? PaymentMethod.CASH,
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

  public get paymentMethod(): PaymentMethod {
    return this.props.paymentMethod ?? PaymentMethod.CASH;
  }

  public get paidAmount(): number | null | undefined {
    return this.props.paidAmount;
  }

  public get changeAmount(): number | null | undefined {
    return this.props.changeAmount;
  }

  public get notes(): string | null | undefined {
    return this.props.notes;
  }

  public get items(): SaleItem[] {
    return this.props.items;
  }

  public get date(): Date {
    return this.props.date || new Date();
  }
}
