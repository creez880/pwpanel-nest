import 'reflect-metadata';
import * as dotenv from 'dotenv';

// Ensure that the .env file is loaded into process.env before anything else
dotenv.config();

import { ConsoleLogger, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'PW-Panel'
      // logLevels: ['error', 'warn', 'log']
    })
  });

  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT', 3000);

  const logger: Logger = new Logger('main');
  logger.log(`Starting the app on port: ${port}`);

  await app.listen(port);
}
bootstrap();
