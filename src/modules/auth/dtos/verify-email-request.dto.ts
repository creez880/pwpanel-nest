import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, Length, Matches } from 'class-validator';

export class verifyEmailRequestDto {
  @IsNotEmpty({ message: 'Verification token is required' })
  @Transform(({ value }) => value?.trim())
  @Matches(/^\S+$/, { message: 'Verification token cannot contain spaces' })
  @Length(64, 64, { message: 'The verification token must be exactly 64 characters long' })
  @ApiProperty({ type: String, required: true, minLength: 64, maxLength: 64, description: 'Email verification token' })
  verificationToken: string;
}
