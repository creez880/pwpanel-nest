import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

/**
 * App variables
 */
export default registerAs('app', () => ({
  port: process.env.PORT ?? 3000
}));
