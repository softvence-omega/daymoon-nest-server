import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Profile, ProfileDocument } from './schemas/profile.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
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
}
