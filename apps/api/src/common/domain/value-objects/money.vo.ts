import { ValueObject } from '../value-object';

export interface MoneyProps {
  amount: number;
}

export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  public static create(amount: number): Money {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    return new Money({ amount });
  }

  public get amount(): number {
    return this.props.amount;
  }

  public add(other: Money): Money {
    return Money.create(this.props.amount + other.amount);
  }

  public subtract(other: Money): Money {
    return Money.create(this.props.amount - other.amount);
  }
}
