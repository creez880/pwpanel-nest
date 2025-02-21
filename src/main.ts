import * as dotenv from 'dotenv';
import 'reflect-metadata';

// Ensure that the .env file is loaded into process.env before anything else
dotenv.config();

import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logger: Logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'PW-Panel'
      // logLevels: ['error', 'warn', 'log']
    })
  });
  const configService: ConfigService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Perfect World Admin Panel')
    .setDescription('Perfect World Admin Panel API Description')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json'
  });

  const port: number = configService.get<number>('PORT', 3000);
  logger.log(`Starting the app on port: ${port}`);
  await app.listen(port);
}
bootstrap();
