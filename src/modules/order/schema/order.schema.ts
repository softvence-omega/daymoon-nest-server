import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  buyerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Shop' })
  shopId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop()
  discountedAmount?: number;

  @Prop({ type: Types.ObjectId, ref: 'Payment' })
  paymentId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Shipment' })
  shipmentId?: Types.ObjectId;

  @Prop({ default: 'pending' })
  status: 'pending' | 'completed' | 'cancelled';

  @Prop({ default: false })
  isReview: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
