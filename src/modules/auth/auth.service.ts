import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      this.logger.debug(`User not found in database: '${username}'`);
      throw new NotFoundException(`User with username '${username}' not found!`);
    }

    if (user.password !== pass) {
      this.logger.debug(`Wrong credentials for user '${user.username}'!`);
      throw new UnauthorizedException('Access denied! Wrong credentials!');
    }

    const payload = { sub: user.userId, username: user.username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
