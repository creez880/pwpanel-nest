import { IsEmail, IsNotEmpty, IsOptional, Length, MaxLength, MinLength } from 'class-validator';
import { Match } from '../match.decorator';
import { AppConfig } from 'src/config/app.config';

export class UserRegisterRequestDto {
  @IsNotEmpty()
  @Length(AppConfig.minUsernameLength, AppConfig.maxUsernameLength)
  username: string;

  @IsOptional()
  @MaxLength(AppConfig.maxDisplayNameLength)
  displayName?: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @MinLength(AppConfig.minPasswordLength)
  @MaxLength(255)
  password: string;

  @Match('password')
  confirmPassword: string;
}
