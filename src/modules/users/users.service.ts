import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { DeleteUserResponseDto } from './dtos/delete-user-response.dto';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findAllUsers(): Promise<UserDto[]> {
    const users: User[] = await this.userRepository.find();
    if (!users.length) {
      return [];
    }

    return users.map((user: User) => this.mapEntityToDto(user));
  }

  async findOneByUsername(username: string): Promise<UserDto> {
    const user: User | null = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    return this.mapEntityToDto(user);
  }

  async findOneById(id: number): Promise<UserDto> {
    const user: User | null = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    return this.mapEntityToDto(user);
  }

  async create(username: string, email: string, password: string, displayName?: string, emailVerificationToken?: string): Promise<UserDto> {
    try {
      const user: User = this.userRepository.create({ username, displayName, email, password, emailVerificationToken });
      const savedUser: User = await this.userRepository.save(user);
      return this.mapEntityToDto(savedUser);
    } catch (error) {
      this.logger.error(`An error occurred while creating user: ${error.message}`);
      throw error;
    }
  }

  async deleteById(id: number): Promise<DeleteUserResponseDto> {
    const userByIdExists: boolean = await this.userRepository.existsBy({ id });
    if (!userByIdExists) {
      return { message: `User not found! No user was deleted!`, affected: 0 };
    }

    const deleteResult: DeleteResult = await this.userRepository.delete(id);
    if (deleteResult.affected) {
      return { message: `User with ID ${id} was deleted!`, affected: deleteResult.affected };
    }

    return { message: 'No user was deleted!', affected: 0 };
  }

  async existsByUsername(username: string): Promise<boolean> {
    return await this.userRepository.existsBy({ username });
  }

  private mapEntityToDto(user: User): UserDto {
    const userDto: UserDto = { userId: user.id, username: user.username, password: user.password, email: user.email };
    if (user.displayName) {
      userDto.displayName = user.displayName;
    }

    return userDto;
  }
}
