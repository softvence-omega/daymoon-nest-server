import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Shop extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  shopName: string;

  @Prop({
    type: {
      userName: String,
      userEmail: String,
      userAddress: String,
      mobileNumber: String,
    },
    default: {},
  })
  personalDetails: {
    userName: string;
    userEmail: string;
    userAddress: string;
    mobileNumber: string;
  };

  @Prop({
    type: {
      shopName: String,
      shopType: String,
      shopLogo: String,
      shopBanner: String,
      shopAddress: String,
      shopMobileNumber: String,
      businessDesc: String,
      storeDesc: String,
      country: String,
      socialMediaLink: [String],
      productCategory: [String],
      productShipping: String,
      transactionMethodId: String,
    },
    default: {},
  })
  shopDetails: any;

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
  refund_policy: Array<{
    minimumDays: number;
    reductionPercentage: number;
    appliedOnProducts: string[];
  }>;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
