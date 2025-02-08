import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app-config.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AppConfigModule, UsersModule, AuthModule]
})
export class AppModule {}
