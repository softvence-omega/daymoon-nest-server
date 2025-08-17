import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Role {
  Admin = 'Admin',
  Buyer = 'Buyer',
  Seller = 'Seller',
}

export const RolesArray = Object.values(Role);

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  fullName: string;

  @Prop({ type: String, enum: RolesArray, default: Role.Buyer })
  role?: Role;

  @Prop()
  resetPasswordOtp?: string;

  @Prop()
  resetPasswordOtpExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
