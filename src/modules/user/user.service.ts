import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { Shop } from './schemas/shop.schema';
import { UpdateShopDto } from './dto/update-shop.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    @InjectModel(Shop.name) private shopModel: Model<Shop>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = new this.userModel({
      ...dto,
      password: hashedPassword,
      role: dto.role || 'Buyer',
    });

    const savedUser = await newUser.save();

    // Create profile automatically
    await this.profileModel.create({
      userId: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      image: '',
      bio: '',
      socialLinks: [],
    });

    // ✅ Auto-create default shop if Seller
    if (savedUser.role === Role.Seller) {
      await this.shopModel.create({
        userId: savedUser._id,
        shopName: `${savedUser.fullName}'s Shop`,
        personalDetails: {
          userName: savedUser.fullName,
          userEmail: savedUser.email,
          userAddress: '',
          mobileNumber: '',
        },
        shopDetails: {
          shopName: '',
          shopType: '',
          shopLogo: '',
          shopBanner: '',
          shopAddress: '',
          shopMobileNumber: '',
          businessDesc: '',
          storeDesc: '',
          country: '',
          socialMediaLink: [],
          productCategory: [],
          productShipping: '',
          transactionMethodId: '',
        },
        refund_policy: [],
      });
    }

    return savedUser;
  }

  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<User | null> {
    if (includePassword) {
      return this.userModel.findOne({ email }).exec();
    }
    return this.userModel.findOne({ email }).select('-password').exec();
  }

  async findById(id: string, includePassword = false): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const objectId = new Types.ObjectId(id);

    if (includePassword) {
      return this.userModel.findById(objectId).exec();
    }
    return this.userModel.findById(objectId).select('-password').exec();
  }

  async findByIdWithRelations(
    userId: string,
    includePassword = false,
  ): Promise<User | null> {
    if (!Types.ObjectId.isValid(userId)) return null;
    const objectId = new Types.ObjectId(userId);
    const query = this.userModel
      .findById(objectId)
      .populate('profile')
      .populate('shop');

    if (!includePassword) {
      query.select('-password');
    }

    return query.exec();
  }

  async findByResetToken(token: string) {
    return this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
  }

  // Update user profile
  async updateProfile(userId: string, updateData: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');

    // Update profile too
    await this.profileModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          fullName: updateData.fullName,
          email: updateData.email,
        },
      },
    );

    return user;
  }

  // Get all users (admin)
  async getAllUsers() {
    return this.userModel.find().select('-password');
  }

  // update shop
  async updateShopDetails(
    userId: string,
    update: UpdateShopDto,
  ): Promise<Shop> {
    const updatePayload: Partial<Shop> = {};

    if (update.shopName) {
      updatePayload.shopName = update.shopName;
    }

    if (update.personalDetails) {
      updatePayload.personalDetails = { ...update.personalDetails };
    }

    if (update.shopDetails) {
      updatePayload.shopDetails = { ...update.shopDetails };
    }

    if (update.refund_policy) {
      updatePayload.refund_policy = [...update.refund_policy];
    }

    const shop = await this.shopModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: updatePayload },
      { new: true },
    );

    if (!shop) {
      throw new NotFoundException('Shop not found for this user');
    }

    return shop;
  }
}
