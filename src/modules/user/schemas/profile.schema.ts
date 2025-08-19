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

  @Prop({
    default:
      process.env.DEFAULT_PROFILE_IMAGE ||
      'https://res.cloudinary.com/dpgcpei5u/image/upload/v1747546759/interviewProfile_jvo9jl.jpg',
  })
  imageUrl?: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: [] })
  socialLinks: string[];

  @Prop({ default: '' })
  phone?: string;

  @Prop({ default: '' })
  companyName?: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
export type ProfileDocument = Profile;
