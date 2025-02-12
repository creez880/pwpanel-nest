import { DataSource, DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './src/config/database.config';

// This file is used only for local development! It is not used in production!

const config = {
  type: DatabaseConfig.type,
  host: DatabaseConfig.host,
  port: DatabaseConfig.port,
  username: DatabaseConfig.username,
  password: DatabaseConfig.password,
  database: DatabaseConfig.database,
  synchronize: DatabaseConfig.synchronize
};

const configuration = {
  ...config,
  entities: ['./**/*.entity.js', './**/*.view.js'],
  migrations: ['./**/build/migrations/**/*.js'],
  logging: true
};

export default registerAs('typeorm', () => configuration);
export const connectionSource = new DataSource(configuration as DataSourceOptions);
