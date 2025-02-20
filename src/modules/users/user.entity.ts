import { AppConfig } from 'src/config/app.config';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users'
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'username', length: AppConfig.maxUsernameLength, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', name: 'display_name', length: AppConfig.maxDisplayNameLength, nullable: true })
  displayName: string;

  @Column({ type: 'varchar', name: 'password', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', name: 'email', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'boolean', name: 'email_verified', nullable: false, default: false })
  emailVerified: boolean;

  @Column({ type: 'varchar', name: 'email_verification_token', length: 255, nullable: true })
  emailVerificationToken: string | null;

  @Column({ type: 'datetime', name: 'email_verification_expires_at', nullable: true })
  emailVerificationExpiresAt: Date | null;
}
