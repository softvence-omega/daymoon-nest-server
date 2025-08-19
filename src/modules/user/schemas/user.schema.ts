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

  @Prop({ default: '' })
  phone?: string;

  @Prop({ default: '' })
  companyName?: string;

  @Prop()
  resetPasswordOtp?: string;

  @Prop()
  resetPasswordOtpExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// ✅ Add virtuals here
UserSchema.virtual('profile', {
  ref: 'Profile',            // Model name
  localField: '_id',         // User._id
  foreignField: 'userId',    // Profile.userId
  justOne: true,
});

UserSchema.virtual('shop', {
  ref: 'Shop',               // Model name
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
});

// ✅ Ensure virtuals are included in JSON and object outputs
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });