import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SubCategory', required: true })
  subCategoryId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop()
  description: string;

  @Prop({ default: [] })
  images: string[];

  @Prop({ default: [] })
  variantIds: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
