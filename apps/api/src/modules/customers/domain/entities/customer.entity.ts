import { Entity } from '../../../../common/domain/entity';
import { IndonesianPhone } from '../../../../common/domain/value-objects/indonesian-phone.vo';
import { Money } from '../../../../common/domain/value-objects/money.vo';

export interface CustomerProps {
  companyId: string;
  name: string;
  phone?: IndonesianPhone;
  email?: string;
  totalSpent: Money;
  lastPurchaseAt?: Date;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Customer extends Entity<CustomerProps> {
  private constructor(props: CustomerProps, id?: string) {
    super(props, id);
  }

  public static create(
    props: Omit<CustomerProps, 'totalSpent'> & { totalSpent?: Money },
    id?: string,
  ): Customer {
    // Domain Validation
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Customer name is required');
    }

    if (!props.companyId) {
      throw new Error('Customer must belong to a company (tenant)');
    }

    return new Customer(
      {
        ...props,
        totalSpent: props.totalSpent ?? Money.create(0),
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

  public get phone(): IndonesianPhone | undefined {
    return this.props.phone;
  }

  public get totalSpent(): Money {
    return this.props.totalSpent;
  }

  public get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  public get lastPurchaseAt(): Date | undefined {
    return this.props.lastPurchaseAt;
  }

  /**
   * Domain behavior: Soft delete the customer
   */
  public softDelete(): void {
    this.props.deletedAt = new Date();
    this.props.updatedAt = new Date();
  }

  /**
   * Domain behavior: Record a new purchase for the customer
   */
  public recordPurchase(amount: Money): void {
    if (amount.amount <= 0) {
      throw new Error('Purchase amount must be positive');
    }
    this.props.totalSpent = this.props.totalSpent.add(amount);
    this.props.lastPurchaseAt = new Date();
    this.props.updatedAt = new Date();
  }
}
