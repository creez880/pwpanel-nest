import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findOne(usernameSearch: string): Promise<UserDto> {
    const user: User | null = await this.userRepository.findOne({ where: { username: usernameSearch } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return this.mapEntityToDto(user);
  }

  private mapEntityToDto(user: User): UserDto {
    return { userId: user.id, username: user.username, password: user.password, email: user.email };
  }
}
