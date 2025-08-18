/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { AuthUser } from '../auth/jwt.strategy';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from './schemas/user.schema';
import { UpdateShopDto } from './dto/update-shop.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

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
    const user = await this.userService.findByIdWithRelations(req.user.userId);
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
  @UseGuards(JwtAuthGuard)
  @Patch('update-profile')
  async updateProfile(
    @Request() req,
    @Body() body: Partial<{ fullName: string; email: string; mobile: string }>,
  ) {
    return this.userService.updateProfile(req.user.userId, body);
  }

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
