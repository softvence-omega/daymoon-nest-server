import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Order' })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'pending' })
  status: 'pending' | 'completed' | 'failed';

  @Prop({ required: true })
  method: string;

  @Prop()
  transactionId?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
