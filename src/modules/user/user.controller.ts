/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { AuthUser } from '../auth/jwt.strategy';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from './schemas/user.schema';
import { UpdateShopDto } from './dto/update-shop.dto';
import { CloudinaryService } from 'src/utils/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/utils/multer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { memoryStorage } from 'multer';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage,
      fileFilter: imageFileFilter,
    }),
  )
  async createUser(
    @Body() body: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl = process.env.DEFAULT_PROFILE_IMAGE || '';
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      imageUrl = uploadResult.secure_url;
    }
    return this.userService.create(body, imageUrl);
  }

  @Patch('update-profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: imageFileFilter,
    }),
  )
  async updateProfile(
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
    @Body('data') data?: string, // JSON string from form-data
  ) {
    // Parse JSON safely with type
    let body: UpdateUserDto = {};
    if (data) {
      try {
        body = JSON.parse(data) as UpdateUserDto;
      } catch (err) {
        throw new BadRequestException('Invalid JSON in data field', err);
      }
    }

    // Upload image if present
    let imageUrl: string | undefined;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      imageUrl = uploadResult.secure_url;
    }

    // Update profile
    return this.userService.updateProfileWithImage(
      req.user.userId,
      body,
      imageUrl,
    );
  }

  // @Get('profile')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Buyer', 'Seller')
  // async getProfile(@Request() req: { user: AuthUser }) {
  //   const user = await this.userService.findById(req.user.userId);
  //   return user;
  // }
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Buyer', 'Seller')
  async getProfile(@Request() req: { user: AuthUser }) {
    try {
      const user = await this.userService.findByIdWithRelations(
        req.user.userId,
      );
      if (!user) {
        return { message: 'User not found' };
      }
      return user;
    } catch (error) {
      console.error('Error in getProfile():', error);
      throw error;
    }
  }

  // Update profile (logged-in user)
  // @UseGuards(JwtAuthGuard)
  // @Patch('update-profile')
  // async updateProfile(
  //   @Request() req,
  //   @Body() body: Partial<{ fullName: string; email: string; mobile: string }>,
  // ) {
  //   return this.userService.updateProfile(req.user.userId, body);
  // }

  @Put('shop/:userId')
  async updateShop(
    @Param('userId') userId: string,
    @Body() updateShopDto: UpdateShopDto,
  ) {
    return this.userService.updateShopDetails(userId, updateShopDto);
  }

  // Get all users (admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('all-users')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
