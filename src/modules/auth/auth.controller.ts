import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginRequestDto } from './dtos/user-login-request.dto';
import { AuthGuard } from './auth.guard';
import { UserRegisterRequestDto } from './dtos/user-register-request.dto';
import { UserDto } from '../users/user.dto';
import { UserRegisterResponseDto } from './dtos/user-register-response.dto';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  login(@Body() loginDto: UserLoginRequestDto): Promise<{ access_token: string }> {
    try {
      return this.authService.login(loginDto.username, loginDto.password);
    } catch (error) {
      this.logger.error(`An error occurred while logging in: ${error.message}`);
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() registerDto: UserRegisterRequestDto): Promise<UserRegisterResponseDto> {
    try {
      const user: UserDto = await this.authService.register(registerDto);
      return {
        userId: user.userId,
        username: user.username,
        email: user.email
      };
    } catch (error) {
      this.logger.error(`An error occurred while registering user: ${error.message}`);
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
