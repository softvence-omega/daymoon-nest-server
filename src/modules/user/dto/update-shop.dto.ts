import {
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class RefundPolicyDto {
  @IsNumber()
  minimumDays: number;

  @IsNumber()
  reductionPercentage: number;

  @IsArray()
  @IsString({ each: true })
  appliedOnProducts: string[];
}

export class UpdateShopDto {
  // Business details
  @IsOptional() @IsString() businessName?: string;
  @IsOptional() @IsString() businessType?: string;
  @IsOptional() @IsString() businessDesc?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() phoneNumber?: string;

  // Store details
  @IsOptional() @IsString() storeLogo?: string;
  @IsOptional() @IsString() storeBanner?: string;
  @IsOptional() @IsString() storeDesc?: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  socialMediaLinks?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) productCategory?: string[];
  @IsOptional() @IsString() productShipping?: string;

  // Refund policy
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RefundPolicyDto)
  refund_policy?: RefundPolicyDto[];

  // Payment setup
  @IsOptional() @IsString() paymentMethod?: string;
  @IsOptional() @IsString() accountHolderName?: string;
  @IsOptional() @IsString() accountNumber?: string;
  @IsOptional() @IsString() taxId?: string;
  @IsOptional() @IsBoolean() acceptPrivacyPolicy?: boolean;
}
