import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { AppConfigService } from './config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigService: AppConfigService = app.get(AppConfigService);

  const logger: Logger = new Logger('main');
  logger.log(`Starting the app on port: ${appConfigService.port}`);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
