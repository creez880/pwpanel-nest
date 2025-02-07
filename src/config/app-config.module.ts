import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';

@Module({
  imports: [ConfigModule.forRoot({ load: [appConfig] })],
  providers: [AppConfigService],
  exports: [AppConfigService]
})
export class AppConfigModule {}
