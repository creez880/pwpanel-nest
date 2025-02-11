import { ConsoleLogger, Logger, LoggerService } from '@nestjs/common';

const logger: LoggerService = new ConsoleLogger('Auth-Constants', { prefix: 'PW-Panel' });

export const jwtConstants = { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN };

if (jwtConstants.secret) {
  logger.log(`The JWT secret has been sucessfully initialized!`);
} else {
  logger.error(`An error occurred while initializing the 'JWT_SECRET' environment variable!`);
}

if (jwtConstants.expiresIn) {
  logger.log(`The JWT expiration variable has been sucessfully initialized!`);
} else {
  logger.error(`An error occurred while initializing the 'JWT_EXPIRES_IN' environment variable!`);
}
