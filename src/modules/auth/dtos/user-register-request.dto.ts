import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { AppConfig } from 'src/config/app.config';
import { Match } from '../match.decorator';

export class UserRegisterRequestDto {
  @IsNotEmpty({ message: 'Username is required' })
  @Length(AppConfig.minUsernameLength, AppConfig.maxUsernameLength, {
    message: `Username must be between ${AppConfig.minUsernameLength} and ${AppConfig.maxUsernameLength} characters`
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Username can only contain letters and numbers (no spaces).' })
  @ApiProperty({ type: String, required: true, minLength: AppConfig.minUsernameLength, maxLength: AppConfig.maxUsernameLength })
  username: string;

  @IsOptional()
  @MaxLength(AppConfig.maxDisplayNameLength, { message: `Display name cannot exceed ${AppConfig.maxDisplayNameLength} characters` })
  @IsString()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      // Convert empty string to undefined to make sure NULL is saved into the DB
      return trimmed.length > 0 ? trimmed : undefined;
    }
    return value;
  })
  @ValidateIf((o) => o.displayName !== '')
  @ApiProperty({
    type: String,
    required: false,
    maxLength: AppConfig.maxDisplayNameLength,
    description: 'The name which will be shown instead of the username'
  })
  displayName?: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  @ApiProperty({ type: String, required: true, maxLength: 255, example: 'some.name@domain.com' })
  email: string;

  @MinLength(AppConfig.minPasswordLength, { message: `Password must be at least ${AppConfig.minPasswordLength} characters` })
  @MaxLength(255, { message: 'Password cannot exceed 255 characters' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Matches(/^\S+$/, { message: 'Password cannot contain spaces' })
  @ApiProperty({ type: String, required: true, minLength: AppConfig.minPasswordLength, maxLength: 255 })
  password: string;

  @Match('password')
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ type: String, required: true, minLength: AppConfig.minPasswordLength, maxLength: 255 })
  confirmPassword: string;
}
