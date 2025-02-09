import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { AppConfigService } from './config/app-config.service';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'PW-Panel'
      // logLevels: ['error', 'warn', 'log']
    })
  });
  const appConfigService: AppConfigService = app.get(AppConfigService);

  const logger: Logger = new Logger('main');
  logger.log(`Starting the app on port: ${appConfigService.port}`);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
