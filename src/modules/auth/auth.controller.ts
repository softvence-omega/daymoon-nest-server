/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '../user/schemas/user.schema';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, multerStorage } from 'src/utils/multer';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post('signup')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multerStorage,
      fileFilter: imageFileFilter,
    }),
  )
  async signup(
    @Body()
    body: {
      email: string;
      password: string;
      fullName: string;
      role?: Role;
      phone?: string;
      companyName?: string;
    },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl = process.env.DEFAULT_PROFILE_IMAGE || '';
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      imageUrl = uploadResult.secure_url;
    }

    return this.authService.signup(
      body.email,
      body.password,
      body.fullName,
      imageUrl,
      body.role,
      body.phone,
      body.companyName,
    );
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // Request OTP
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  // Verify OTP and reset password
  @Post('verify-otp')
  async verifyOtp(
    @Body() body: { email: string; otp: string; newPassword: string },
  ) {
    return this.authService.verifyOtpAndResetPassword(
      body.email,
      body.otp,
      body.newPassword,
    );
  }

  // Change password (logged-in user)
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.userId, dto);
  }
}
