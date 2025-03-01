import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, LessThan, Repository } from 'typeorm';
import { DeleteUserResponseDto } from './dtos/delete-user-response.dto';
import { UserDto } from './dtos/user.dto';
import { UserVerificationStatusDto } from './dtos/verification-status.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findAllUsers(): Promise<UserDto[]> {
    const users: User[] = await this.userRepository.find();
    if (!users.length) {
      return [];
    }

    return this.mapAllEntityToDto(users);
  }

  async findOneByUsername(username: string): Promise<UserDto> {
    const user: User | null = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    return this.mapEntityToDto(user);
  }

  async findOneByUsernameSilently(username: string): Promise<UserDto | undefined> {
    const user: User | null = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      return;
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

  async create(
    username: string,
    email: string,
    password: string,
    emailVerificationExpiresAt: Date,
    displayName?: string,
    emailVerificationToken?: string
  ): Promise<UserDto> {
    try {
      const emailVerified: boolean = false;
      const user: User = this.userRepository.create({
        username,
        displayName,
        password,
        email,
        emailVerified,
        emailVerificationToken,
        emailVerificationExpiresAt
      });
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

  async getVerificationStatus(emailVerificationToken: string): Promise<UserVerificationStatusDto> {
    const user: User | null = await this.userRepository.findOneBy({ emailVerificationToken });

    if (!user) {
      throw new NotFoundException('Invalid or expired verification token.');
    }

    return {
      userId: user.id,
      isVerified: user.emailVerified,
      emailVerificationToken: user.emailVerificationToken,
      emailVerificationExpiresAt: user.emailVerificationExpiresAt
    };
  }

  async updateUserVerificationStatus(userVerificationStatus: UserVerificationStatusDto) {
    const updateData: Partial<User> = { emailVerified: userVerificationStatus.isVerified };

    if (userVerificationStatus.isVerified) {
      updateData.emailVerificationToken = null;
      updateData.emailVerificationExpiresAt = null;
    } else {
      updateData.emailVerificationToken = userVerificationStatus.emailVerificationToken;
      updateData.emailVerificationExpiresAt = userVerificationStatus.emailVerificationExpiresAt;
    }

    await this.userRepository.update(userVerificationStatus.userId, updateData);
  }

  async isEmailVerified(id: number): Promise<boolean> {
    const user: User | null = await this.userRepository.findOneBy({ id });
    return !!user?.emailVerified;
  }

  async clearAllOverdueUserVerificationToken() {
    let users: User[] = await this.getAllUserWithOverdueVerificationToken1();
    users = users.map((user: User) => {
      user.emailVerificationExpiresAt = null;
      user.emailVerificationToken = null;
      return user;
    });

    const savedUsers: User[] = await this.userRepository.save(users);
    return this.mapAllEntityToDto(savedUsers);
  }

  private async getAllUserWithOverdueVerificationToken1(): Promise<User[]> {
    const now: Date = new Date();
    const users: User[] = await this.userRepository.find({ where: { emailVerificationExpiresAt: LessThan(now) } });
    return users;
  }

  private mapEntityToDto(user: User): UserDto {
    const userDto: UserDto = { userId: user.id, username: user.username, password: user.password, email: user.email };
    if (user.displayName) {
      userDto.displayName = user.displayName;
    }

    return userDto;
  }

  private mapAllEntityToDto(users: User[]): UserDto[] {
    return users.map((user: User) => this.mapEntityToDto(user));
  }
}
