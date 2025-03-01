import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly logger: Logger = new Logger(CronService.name);

  constructor(private readonly userService: UsersService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  clearAllOverdueUserVerificationToken() {}
}
