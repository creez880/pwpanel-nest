import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';
import { AppConfig } from 'src/config/app.config';

export class WelcomeEmailDto {
  @IsNotEmpty({ message: 'Email recipient is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  @ApiProperty({ type: String, required: true, maxLength: 255, description: 'Email recipient', example: 'some.name@domain.com' })
  to: string;

  @IsNotEmpty({ message: 'Verification token is required' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Matches(/^\S+$/, { message: 'Verification token cannot contain spaces' })
  @Length(64, 64, { message: 'The verification token must be exactly 64 characters long' })
  @ApiProperty({ type: String, required: true, minLength: 64, maxLength: 64, description: 'Email verification token' })
  verificationToken: string;

  @IsNotEmpty({ message: 'Username is required' })
  @Length(AppConfig.minUsernameLength, AppConfig.maxUsernameLength, {
    message: `Username must be between ${AppConfig.minUsernameLength} and ${AppConfig.maxUsernameLength} characters`
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Matches(/^\S+$/, { message: 'Username cannot contain spaces' })
  @ApiProperty({ type: String, required: true, minLength: AppConfig.minUsernameLength, maxLength: AppConfig.maxUsernameLength })
  username: string;

  @IsOptional()
  @MaxLength(AppConfig.maxDisplayNameLength, { message: `Display name cannot exceed ${AppConfig.maxDisplayNameLength} characters` })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({
    type: String,
    required: false,
    maxLength: AppConfig.maxDisplayNameLength,
    description: 'The name which will be shown instead of the username'
  })
  displayName?: string;
}
