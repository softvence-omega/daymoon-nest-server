import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsMongoId()
  orderId: string;

  @IsNumber()
  amount: number;

  @IsString()
  method: string;

  @IsOptional()
  transactionId?: string;
}
