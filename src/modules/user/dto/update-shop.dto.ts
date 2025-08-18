import {
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class PersonalDetailsDto {
  @IsOptional() @IsString() userName?: string;
  @IsOptional() @IsString() userEmail?: string;
  @IsOptional() @IsString() userAddress?: string;
  @IsOptional() @IsString() mobileNumber?: string;
}

class ShopDetailsDto {
  @IsOptional() @IsString() shopType?: string;
  @IsOptional() @IsString() shopLogo?: string;
  @IsOptional() @IsString() shopBanner?: string;
  @IsOptional() @IsString() shopAddress?: string;
  @IsOptional() @IsString() shopMobileNumber?: string;
  @IsOptional() @IsString() businessDesc?: string;
  @IsOptional() @IsString() storeDesc?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsArray() socialMediaLink?: string[];
  @IsOptional() @IsArray() productCategory?: string[];
  @IsOptional() @IsString() productShipping?: string;
  @IsOptional() @IsString() transactionMethodId?: string;
}

class RefundPolicyDto {
  @IsNumber()
  minimumDays: number;

  @IsNumber()
  reductionParcentage: number;

  @IsArray()
  @IsString({ each: true })
  appliedOnProducts: string[];
}

export class UpdateShopDto {
  @IsOptional()
  @IsString()
  shopName?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PersonalDetailsDto)
  personalDetails?: PersonalDetailsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ShopDetailsDto)
  shopDetails?: ShopDetailsDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RefundPolicyDto)
  refund_policy?: RefundPolicyDto[];
}
