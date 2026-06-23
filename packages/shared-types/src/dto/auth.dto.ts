import { BusinessType } from '../enums';

export interface RegisterDto {
  companyName: string;
  businessType: BusinessType;
  userName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
