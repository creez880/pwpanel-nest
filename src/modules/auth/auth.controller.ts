import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginRequestDto } from './user-login-request.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: UserLoginRequestDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
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
