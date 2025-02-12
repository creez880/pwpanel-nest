import { ConsoleLogger, Global, LoggerService, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from 'src/config/database.config';
import { InitUserTable1739280878664 } from 'src/migrations/1739280878664-InitUserTable';
import { DataSource } from 'typeorm';

@Global()
@Module({
  imports: [],
  exports: [DataSource],
  providers: [
    {
      provide: DataSource,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger: LoggerService = new ConsoleLogger('DataSource', { prefix: 'PW-Panel' });
        try {
          const dataSource: DataSource = new DataSource({
            type: 'mariadb',
            host: DatabaseConfig.host,
            port: Number(DatabaseConfig.port),
            username: DatabaseConfig.username,
            password: DatabaseConfig.password,
            database: DatabaseConfig.database,
            synchronize: DatabaseConfig.synchronize,
            entities: [`${__dirname}/../**/**.entity{.ts,.js}`], // this will automatically load all entity file in the src folder => needed for migration
            migrations: []
          });
          await dataSource.initialize();
          logger.log('Database connected successfully');
          return dataSource;
        } catch (error) {
          logger.error(`An error occurred while connecting to the database!`);
          throw error;
        }
      }
    }
  ]
})
export class TypeOrmModule {}
