import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from 'src/datasource/type-orm.module';

@Module({
  imports: [TypeOrmModule],
  providers: [DatabaseService],
  exports: [DatabaseService]
})
export class DatabaseModule {}
