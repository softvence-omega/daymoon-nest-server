import { IsMongoId, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateVariantDto {
  @IsMongoId()
  productId: string;

  @IsNumber()
  pricePerUnit: number;

  @IsOptional()
  @IsNumber()
  oldPrice?: number;

  @IsOptional()
  @IsNumber()
  minimumOrderQuantity?: number;

  @IsOptional()
  @IsArray()
  images?: string[];
}
