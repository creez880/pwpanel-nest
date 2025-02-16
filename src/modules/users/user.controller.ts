import { Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { DeleteUserResponseDto } from './dtos/delete-user-response.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { UserDto } from './dtos/user.dto';

// @Throttle({ default: { limit: 5, ttl: 15000 } })
@SkipThrottle()
@Controller('users')
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);

  constructor(private readonly userService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(): Promise<UserDto[]> {
    try {
      return await this.userService.findAllUsers();
    } catch (error) {
      this.logger.error(`An error occurred while fetching all users: ${error.message}`);
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    try {
      return await this.userService.findOneById(id);
    } catch (error) {
      this.logger.error(`An error occurred while fetching user with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<DeleteUserResponseDto> {
    try {
      return await this.userService.deleteById(id);
    } catch (error) {
      this.logger.error(`An error occurred while deleting user with ID ${id}: ${error.message}`);
      throw error;
    }
  }
}
