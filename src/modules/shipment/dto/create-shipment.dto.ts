import { IsMongoId, IsObject, IsString } from 'class-validator';

export class CreateShipmentDto {
  @IsMongoId()
  orderId: string;

  @IsObject()
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  @IsString()
  courier: string;

  @IsString()
  trackingNumber?: string;
}
