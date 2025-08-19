import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
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

  // async create(dto: CreateUserDto): Promise<User> {
  //   const hashedPassword = await bcrypt.hash(dto.password, 10);
  //   const newUser = new this.userModel({
  //     ...dto,
  //     password: hashedPassword,
  //     role: dto.role || 'Buyer',
  //   });

  //   const savedUser = await newUser.save();

  //   // Create profile automatically
  //   await this.profileModel.create({
  //     userId: savedUser._id,
  //     fullName: savedUser.fullName,
  //     email: savedUser.email,
  //     image: '',
  //     bio: '',
  //     socialLinks: [],
  //   });

  //   // ✅ Auto-create default shop if Seller
  //   if (savedUser.role === Role.Seller) {
  //     await this.shopModel.create({
  //       userId: savedUser._id,
  //       shopName: `${savedUser.fullName}'s Shop`,
  //       personalDetails: {
  //         userName: savedUser.fullName,
  //         userEmail: savedUser.email,
  //         userAddress: '',
  //         mobileNumber: '',
  //       },
  //       shopDetails: {
  //         shopName: '',
  //         shopType: '',
  //         shopLogo: '',
  //         shopBanner: '',
  //         shopAddress: '',
  //         shopMobileNumber: '',
  //         businessDesc: '',
  //         storeDesc: '',
  //         country: '',
  //         socialMediaLink: [],
  //         productCategory: [],
  //         productShipping: '',
  //         transactionMethodId: '',
  //       },
  //       refund_policy: [],
  //     });
  //   }

  //   return savedUser;
  // }

  async create(dto: CreateUserDto, imageUrl?: string) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 1️⃣ Create user
    const newUser = new this.userModel({
      ...dto,
      password: hashedPassword,
      role: dto.role || Role.Buyer,
      phone: dto.phone || '',
      companyName: dto.companyName || '',
    });

    const savedUser = await newUser.save();

    // 2️⃣ Auto-create profile
    await this.profileModel.create({
      userId: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      imageUrl: imageUrl || process.env.DEFAULT_PROFILE_IMAGE,
      bio: '',
      socialLinks: [],
      phone: savedUser.phone,
      companyName: savedUser.companyName,
    });

    // 3️⃣ Auto-create shop if user is Seller
    if (savedUser.role === Role.Seller) {
      await this.shopModel.create({
        userId: savedUser._id,
        businessName: savedUser.fullName + "'s Shop",
        phoneNumber: savedUser.phone || '',
        businessType: '',
        businessDesc: '',
        country: '',
        storeLogo: '',
        storeBanner: '',
        storeDesc: '',
        socialMediaLinks: [],
        productCategory: [],
        productShipping: '',
        refundPolicy: [],
        paymentMethod: '',
        accountHolderName: '',
        accountNumber: '',
        acceptPrivacyPolicy: false,
      });
    }

    return savedUser;
  }

  async updateProfileWithImage(
    userId: string,
    updateData: Partial<User>,
    imageUrl?: string,
  ) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');

    // build profile update
    const profileUpdate: Partial<Profile> = {};
    if (updateData.fullName) profileUpdate.fullName = updateData.fullName;
    if (updateData.email) profileUpdate.email = updateData.email;
    if (updateData.phone) profileUpdate.phone = updateData.phone;
    if (updateData.companyName)
      profileUpdate.companyName = updateData.companyName;
    if (imageUrl) profileUpdate.imageUrl = imageUrl; // optional update

    const profile = await this.profileModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: profileUpdate },
      { new: true },
    );

    return { user, profile };
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
  // async updateProfile(userId: string, updateData: Partial<User>) {
  //   const user = await this.userModel.findByIdAndUpdate(
  //     userId,
  //     { $set: updateData },
  //     { new: true },
  //   );
  //   if (!user) throw new NotFoundException('User not found');

  //   // Update profile too
  //   await this.profileModel.findOneAndUpdate(
  //     { userId },
  //     {
  //       $set: {
  //         fullName: updateData.fullName,
  //         email: updateData.email,
  //       },
  //     },
  //   );

  //   return user;
  // }

  // Get all users (admin)
  async getAllUsers() {
    return this.userModel.find().select('-password');
  }

  // update shop
  async updateShopDetails(
    userId: string,
    update: UpdateShopDto,
  ): Promise<Shop> {
    const updatePayload: Partial<Shop> = { ...update };

    const shop = await this.shopModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: updatePayload },
      { new: true, upsert: true },
    );

    if (!shop) {
      throw new NotFoundException('Shop not found for this user');
    }

    return shop;
  }
}
