import { DataSource } from 'typeorm';
import { DatabaseConfig } from './config/database.config';

// This file is not supposed to be used for local development! It is used only in productive environments!

const config = {
  type: DatabaseConfig.type,
  host: DatabaseConfig.host,
  port: DatabaseConfig.port,
  username: DatabaseConfig.username,
  password: DatabaseConfig.password,
  database: DatabaseConfig.database,
  synchronize: DatabaseConfig.synchronize
};

export const connectionSource = new DataSource({
  type: 'mariadb',
  host: config.host,
  port: Number(config.port),
  database: config.database,
  username: config.username,
  password: config.password,
  entities: ['./**/*.entity.js', './**/*.view.js'],
  migrations: ['./**/build/migrations/**/*.js'],
  logging: true
});
