import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerification1739735104753 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE;`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN email_verification_token VARCHAR(255);`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN email_verification_expires_at DATETIME;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN email_verified;`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN email_verification_token;`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN email_verification_expires_at;`);
  }
}
