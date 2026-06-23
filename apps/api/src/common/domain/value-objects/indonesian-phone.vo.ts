import { ValueObject } from '../value-object';

export interface IndonesianPhoneProps {
  value: string;
}

export class IndonesianPhone extends ValueObject<IndonesianPhoneProps> {
  private constructor(props: IndonesianPhoneProps) {
    super(props);
  }

  public static create(phone: string): IndonesianPhone {
    const cleaned = phone.replace(/\D/g, '');

    // Basic validation for Indonesian numbers (+62 or 08...)
    if (!cleaned.startsWith('62') && !cleaned.startsWith('08')) {
      throw new Error('Must be a valid Indonesian phone number starting with 62 or 08');
    }

    if (cleaned.length < 10 || cleaned.length > 14) {
      throw new Error('Phone number length must be between 10 and 14 digits');
    }

    // Standardize to 62...
    const standardized = cleaned.startsWith('0') ? '62' + cleaned.substring(1) : cleaned;

    return new IndonesianPhone({ value: standardized });
  }

  public get value(): string {
    return this.props.value;
  }
}
