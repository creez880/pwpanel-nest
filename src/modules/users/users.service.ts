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
    return users.map((user: User) => this.mapEntityToDto(user));
  }

  async findOneByUsername(username: string): Promise<UserDto | null> {
    const user: User | null = await this.userRepository.findOne({ where: { username } });
    return this.userOrNull(user);
  }

  async findOneByEmail(email: string): Promise<UserDto | null> {
    const user: User | null = await this.userRepository.findOne({ where: { email } });
    return this.userOrNull(user);
  }

  async findOneByUsernameAndEmail(username: string, email: string): Promise<UserDto | null> {
    const user: User | null = await this.userRepository.findOne({ where: [{ username }, { email }] });
    return this.userOrNull(user);
  }

  async create(username: string, email: string, password: string): Promise<UserDto | null> {
    const user: User = this.userRepository.create({ username, email, password });
    const savedUser: User = await this.userRepository.save(user);
    return this.userOrNull(savedUser);
  }

  async deleteById(id: number): Promise<DeleteUserResponseDto> {
    const userByIdExists: boolean = await this.userRepository.existsBy({ id });
    if (!userByIdExists) {
      return { message: `User with ID ${id} does not exist! No user was deleted!`, affected: 0 };
    }

    const deleteResult: DeleteResult = await this.userRepository.delete(id);
    if (deleteResult.affected) {
      return { message: `User with ID ${id} was deleted!`, affected: deleteResult.affected };
    }

    return { message: 'No user was deleted!', affected: 0 };
  }

  private mapEntityToDto(user: User): UserDto {
    return { userId: user.id, username: user.username, password: user.password, email: user.email };
  }

  private userOrNull(user: User | null): UserDto | null {
    return user ? this.mapEntityToDto(user) : null;
  }
}
