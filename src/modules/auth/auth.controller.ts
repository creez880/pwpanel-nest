import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UserLoginRequestDto } from './dtos/user-login-request.dto';
import { UserRegisterRequestDto } from './dtos/user-register-request.dto';
import { UserRegisterResponseDto } from './dtos/user-register-response.dto';
import { VerifyEmailResponseDto } from './dtos/verify-email-response.dto';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: UserLoginRequestDto): Promise<{ access_token: string }> {
    try {
      return await this.authService.login(loginDto.username, loginDto.password);
    } catch (error) {
      this.logger.error(`An error occurred while logging in: ${error.message}`);
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerDto: UserRegisterRequestDto): Promise<UserRegisterResponseDto> {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      this.logger.error(`An error occurred while registering user: ${error.message}`);
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string): Promise<VerifyEmailResponseDto> {
    if (!token) {
      throw new BadRequestException('Verification token is required!');
    }

    try {
      const isVerified: boolean = await this.authService.verifyEmail(token);
      if (!isVerified) {
        return { success: false, message: 'Verification token is invalid or may be expired!' };
      }

      return { success: true, message: 'Email successfully verified! You can now log in.' };
    } catch (error) {
      this.logger.error(`An error occurred while verifying email: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test method - NOT FOR PRODUCTION!
   * @param req Request
   * @returns Returns the user itself if the JWT can be verified and is not expired.
   */
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
