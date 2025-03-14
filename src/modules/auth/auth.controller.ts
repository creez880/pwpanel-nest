import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ResendVerificationEmailRequestDto } from './dtos/resend-verification-email-request.dto';
import { UserLoginRequestDto } from './dtos/user-login-request.dto';
import { UserRegisterRequestDto } from './dtos/user-register-request.dto';
import { UserRegisterResponseDto } from './dtos/user-register-response.dto';
import { VerifyEmailResponseDto } from './dtos/verify-email-response.dto';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user with their username and password. If valid, returns a JWT access token for authentication.'
  })
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

  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account with the provided username, email, and password. The password is securely hashed before being stored in the database.'
  })
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

  @ApiOperation({
    summary: 'Verify user email',
    description:
      "Validates the provided email verification token. If valid, marks the user's email as verified. If the token is invalid or expired, an error response is returned."
  })
  @ApiQuery({ name: 'token', description: 'The verification token', required: true })
  @HttpCode(HttpStatus.OK)
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string): Promise<VerifyEmailResponseDto> {
    this.validateVerificationToken(token);

    const isVerified: boolean = await this.authService.verifyEmail(token);
    if (!isVerified) {
      return { success: false, message: 'Verification token is invalid or may be expired!' };
    }

    return { success: true, message: 'Email successfully verified! You can now log in.' };
  }

  @ApiOperation({
    summary: 'Resend email verification link',
    description:
      "Sends a new email verification link to the user's registered email address. This is useful if the previous verification email was lost or expired. The request requires the username of the user."
  })
  @HttpCode(HttpStatus.OK)
  @Post('resend-verification-email')
  async resendVerificationEmail(@Body() requestBody: ResendVerificationEmailRequestDto): Promise<{ message: string } | undefined> {
    try {
      return await this.authService.resendVerificationMail(requestBody.username);
    } catch (error) {
      throw new HttpException(error.message, error.statusCode ?? error.status ?? 500);
    }
  }

  /**
   * Test method - NOT FOR PRODUCTION!
   * @param req Request
   * @returns Returns the user itself if the JWT can be verified and is not expired.
   */
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  private validateVerificationToken(token: string): void {
    if (!token) {
      throw new BadRequestException('The verification token is required!');
    }

    if (token.trim() === '') {
      throw new BadRequestException('The verification token can not be empty!');
    }

    if (!token.match(/^\S+$/)) {
      throw new BadRequestException('The verification token cannot contain spaces');
    }

    if (token.length !== 64) {
      throw new BadRequestException('The verification token must have exactly 64 characters!');
    }
  }
}
