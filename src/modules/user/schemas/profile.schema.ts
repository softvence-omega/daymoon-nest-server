import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Profile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: [] })
  socialLinks: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
export type ProfileDocument = Profile;
