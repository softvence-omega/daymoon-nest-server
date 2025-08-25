import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsMongoId()
  buyerId: string;

  @IsMongoId()
  shopId: string;

  @IsMongoId()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  totalAmount: number;

  @IsOptional()
  discountedAmount?: number;
}
