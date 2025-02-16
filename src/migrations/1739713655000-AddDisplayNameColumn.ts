import { AppConfig } from 'src/config/app.config';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDisplayNameColumn1739713655000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const maxDisplayNameLength = AppConfig.maxDisplayNameLength;
    await queryRunner.query(`ALTER TABLE users ADD COLUMN display_name VARCHAR(${maxDisplayNameLength});`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN display_name;`);
  }
}
