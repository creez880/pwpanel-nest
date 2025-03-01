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
import { ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ResendVerificationEmailRequestDto } from './dtos/resend-verification-email-request.dto';
import { UserLoginRequestDto } from './dtos/user-login-request.dto';
import { UserRegisterRequestDto } from './dtos/user-register-request.dto';
import { UserRegisterResponseDto } from './dtos/user-register-response.dto';
import { VerifyEmailResponseDto } from './dtos/verify-email-response.dto';
import { verifyEmailRequestDto } from './dtos/verify-email-request.dto';

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
  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailRequest: verifyEmailRequestDto): Promise<VerifyEmailResponseDto> {
    const isVerified: boolean = await this.authService.verifyEmail(verifyEmailRequest.verificationToken);
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
}
