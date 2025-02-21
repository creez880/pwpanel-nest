import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';
import { AppConfig } from 'src/config/app.config';
import { Match } from '../match.decorator';

export class UserRegisterRequestDto {
  @IsNotEmpty({ message: 'Username is required' })
  @Length(AppConfig.minUsernameLength, AppConfig.maxUsernameLength, {
    message: `Username must be between ${AppConfig.minUsernameLength} and ${AppConfig.maxUsernameLength} characters`
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Matches(/^\S+$/, { message: 'Username cannot contain spaces' })
  username: string;

  @IsOptional()
  @MaxLength(AppConfig.maxDisplayNameLength, { message: `Display name cannot exceed ${AppConfig.maxDisplayNameLength} characters` })
  @IsString()
  @Transform(({ value }) => value?.trim())
  displayName?: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @MinLength(AppConfig.minPasswordLength, { message: `Password must be at least ${AppConfig.minPasswordLength} characters` })
  @MaxLength(255, { message: 'Password cannot exceed 255 characters' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Matches(/^\S+$/, { message: 'Password cannot contain spaces' })
  password: string;

  @Match('password')
  @IsString()
  @Transform(({ value }) => value?.trim())
  confirmPassword: string;
}
