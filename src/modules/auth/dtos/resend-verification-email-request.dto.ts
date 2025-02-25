import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, Matches } from 'class-validator';

export class ResendVerificationEmailRequestDto {
  @IsNotEmpty({ message: 'Username is required' })
  @Transform(({ value }) => value.trim())
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Username can only contain letters and numbers (no spaces).' })
  @ApiProperty({ type: String, required: true })
  username: string;
}
