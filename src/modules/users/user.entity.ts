import { AppConfig } from 'src/config/app.config';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users'
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username', length: AppConfig.maxUsernameLength, unique: true, nullable: false })
  username: string;

  @Column({ name: 'display_name', length: AppConfig.maxDisplayNameLength, nullable: true })
  displayName?: string;

  @Column({ name: 'password', length: 255, nullable: false })
  password: string;

  @Column({ name: 'email', length: 255, unique: true, nullable: false })
  email: string;
}
