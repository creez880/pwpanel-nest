import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { WelcomeEmailDto } from '../mail/dtos/welcome-email.dto';
import { MailService } from '../mail/mail.service';
import { UserDto } from '../users/dtos/user.dto';
import { UserVerificationStatusDto } from '../users/dtos/verification-status.dto';
import { UsersService } from '../users/users.service';
import { UserRegisterRequestDto } from './dtos/user-register-request.dto';
import { UserRegisterResponseDto } from './dtos/user-register-response.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  async login(username: string, pass: string): Promise<{ access_token: string }> {
    const user: UserDto = await this.usersService.findOneByUsername(username);
    await this.validatePassword(pass, user.password);

    const isUserEmailVerified: boolean = await this.usersService.isEmailVerified(user.userId);
    if (!isUserEmailVerified) {
      throw new UnauthorizedException('Access denied! Email not verified!');
    }

    const payload = { sub: user.userId, username: user.username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async register(registerUserDto: UserRegisterRequestDto): Promise<UserRegisterResponseDto> {
    const usernameExists: boolean = await this.usersService.existsByUsername(registerUserDto.username);
    if (usernameExists) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await this.getHashedPassword(registerUserDto.password);
    registerUserDto.password = hashedPassword;

    const emailVerificationToken: string = await this.generateRandomToken();
    const emailVerificationExipresAt: Date = new Date();
    emailVerificationExipresAt.setMinutes(emailVerificationExipresAt.getMinutes() + 15);

    const user: UserDto = await this.usersService.create(
      registerUserDto.username,
      registerUserDto.email,
      registerUserDto.password,
      emailVerificationExipresAt,
      registerUserDto.displayName,
      emailVerificationToken
    );

    const welcomeEmailDto: WelcomeEmailDto = {
      to: registerUserDto.email,
      verificationToken: emailVerificationToken,
      username: user.username,
      displayName: user.displayName
    };

    await this.mailService.welcomeEmail(welcomeEmailDto);

    return this.mapUserDtoToUserRegisterResponseDto(user);
  }

  async verifyEmail(verificationToken: string): Promise<boolean> {
    try {
      const userVerificationStatus: UserVerificationStatusDto = await this.usersService.getVerificationStatus(verificationToken);
      if (!userVerificationStatus.emailVerificationExpiresAt) {
        return false;
      }

      const now: Date = new Date();
      if (now > userVerificationStatus.emailVerificationExpiresAt) {
        return false;
      }

      await this.usersService.saveVerificationStatus(userVerificationStatus);
      return true;
    } catch (error) {
      this.logger.error(`An error occurred while verifying an user email: ${error.message}`);
      throw error;
    }
  }

  private async getHashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private mapUserDtoToUserRegisterResponseDto(user: UserDto): UserRegisterResponseDto {
    const userRegisterResponseDto: UserRegisterResponseDto = { userId: user.userId, username: user.username, email: user.email };
    if (user.displayName) {
      userRegisterResponseDto.displayName = user.displayName;
    }

    return userRegisterResponseDto;
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    const isPasswordValid: boolean = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Access denied! Wrong credentials!');
    }

    return isPasswordValid;
  }

  private async generateRandomToken(): Promise<string> {
    return randomBytes(32).toString('hex');
  }
}
