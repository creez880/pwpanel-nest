import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterRequestDto } from './dtos/user-register-request.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../users/dtos/user.dto';
import { UserRegisterResponseDto } from './dtos/user-register-response.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(username: string, pass: string): Promise<{ access_token: string }> {
    const user: UserDto = await this.usersService.findOneByUsername(username);
    await this.validatePassword(pass, user.password);

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

    const user: UserDto = await this.usersService.create(
      registerUserDto.username,
      registerUserDto.email,
      registerUserDto.password,
      registerUserDto.displayName
    );
    return this.mapUserDtoToUserRegisterResponseDto(user);
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
}
