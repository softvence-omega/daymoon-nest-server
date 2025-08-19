import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Shop extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // Business details
  @Prop({ required: true })
  businessName: string;

  @Prop()
  businessType?: string;

  @Prop()
  businessDesc?: string;

  @Prop()
  country?: string;

  @Prop()
  phoneNumber?: string;

  // Store details
  @Prop()
  storeLogo?: string;

  @Prop()
  storeBanner?: string;

  @Prop()
  storeDesc?: string;

  @Prop({ type: [String], default: [] })
  socialMediaLinks?: string[];

  @Prop({ type: [String], default: [] })
  productCategory?: string[];

  @Prop()
  productShipping?: string;

  // Refund/return policy (already existing)
  @Prop({
    type: [
      {
        minimumDays: Number,
        reductionPercentage: Number,
        appliedOnProducts: [String],
      },
    ],
    default: [],
  })
  refund_policy?: Array<{
    minimumDays?: number;
    reductionPercentage?: number;
    appliedOnProducts?: string[];
  }>;

  // Payment setup
  @Prop()
  paymentMethod?: string;

  @Prop()
  accountHolderName?: string;

  @Prop()
  accountNumber?: string;

  @Prop()
  taxId?: string;

  @Prop({ default: false })
  acceptPrivacyPolicy: boolean;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
