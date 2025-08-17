import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Variant extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  pricePerUnit: number;

  @Prop()
  oldPrice: number;

  @Prop({ default: [] })
  priceTiers: [{ minQty: number; maxQty: number; price: number }];

  @Prop({ default: 1 })
  minimumOrderQuantity: number;

  @Prop({ default: [] })
  images: string[];

  @Prop({ default: [] })
  customizable: [{ key: string; value: string }];

  @Prop({ default: [] })
  attributes: [{ key: string; value: string }];

  @Prop({ default: 0 })
  totalQuantity: number;

  @Prop()
  samplePrice: number;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
