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
    const user: UserDto | null = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException(`Username '${username}' not found!`);
    }

    const isPasswordValid: boolean = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Access denied! Wrong credentials!');
    }

    const payload = { sub: user.userId, username: user.username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async register(registerUserDto: UserRegisterRequestDto): Promise<UserRegisterResponseDto> {
    const existingUser: UserDto | null = await this.usersService.findOneByUsernameAndEmail(registerUserDto.username, registerUserDto.email);
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await this.getHashedPassword(registerUserDto.password);
    registerUserDto.password = hashedPassword;
    this.logger.debug(`Password hashed successfully for user '${registerUserDto.username}'`);

    const user: UserDto | null = await this.usersService.create(registerUserDto.username, registerUserDto.email, registerUserDto.password);
    if (!user) {
      this.logger.error(`User could not be created: '${registerUserDto.username}'`);
      throw new BadRequestException('User could not be created');
    }

    this.logger.debug(`User created successfully: '${user.username}'`);
    return this.mapUserDtoToUserRegisterResponseDto(user);
  }

  private async getHashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private mapUserDtoToUserRegisterResponseDto(user: UserDto): UserRegisterResponseDto {
    return {
      userId: user.userId,
      username: user.username,
      email: user.email
    };
  }
}
