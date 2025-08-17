/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '../user/schemas/user.schema';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body()
    body: {
      email: string;
      password: string;
      fullName: string;
      role?: Role;
    },
  ) {
    return this.authService.signup(
      body.email,
      body.password,
      body.fullName,
      body.role,
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
