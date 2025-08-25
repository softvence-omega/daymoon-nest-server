import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Address, AddressSchema } from './address.schema';

export type ShipmentDocument = Shipment & Document;

@Schema({ timestamps: true })
export class Shipment {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Order' })
  orderId: Types.ObjectId;

  @Prop({ type: AddressSchema, required: true })
  address: Address;

  @Prop({ required: true })
  courier: string;

  @Prop()
  trackingNumber?: string;

  @Prop({ default: 'pending' })
  status: 'pending' | 'shipped' | 'delivered' | 'returned';
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
