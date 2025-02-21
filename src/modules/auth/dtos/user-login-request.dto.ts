import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserLoginRequestDto {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  @Transform(({ value }) => value.trim())
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Username can only contain letters and numbers (no spaces).' })
  @ApiProperty({ type: String, required: true })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Matches(/^\S+$/, { message: 'Password cannot contain spaces' })
  @ApiProperty({ type: String, required: true })
  password: string;
}
