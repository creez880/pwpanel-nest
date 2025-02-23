import { Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { DeleteUserResponseDto } from './dtos/delete-user-response.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { UserDto } from './dtos/user.dto';
import { ApiOperation } from '@nestjs/swagger';

// @Throttle({ default: { limit: 5, ttl: 15000 } })
@SkipThrottle()
@Controller('users')
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);

  constructor(private readonly userService: UsersService) {}

  @ApiOperation({
    summary: 'Retrieve all users',
    description: 'Fetches a list of all registered users. Returns an array of user data.'
  })
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

  @ApiOperation({
    summary: 'Retrieve user by ID',
    description: 'Fetches details of a specific user based on the provided user ID.'
  })
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

  @ApiOperation({
    summary: 'Delete user by ID',
    description: 'Deletes a user based on the provided user ID. Returns a confirmation response.'
  })
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
